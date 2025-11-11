import GlobalConfig from "./globalConfig";
import { checkForMatch, keyPatternIsValid } from "./patternMatching";
import { ReadStrategies } from "./readStrategies";
import { StoreAdapter } from "./types";
import KeyConfig, { Callback } from "./keyConfig";
import { WriteStrategies } from "./writeStrategies";

export type UnmatchedRouteContext = {
  match: false;
};

export type MatchedRouteContext = {
  key: string;
  params: object;
  match: true;
};

export type PossibleRouteContext = MatchedRouteContext | UnmatchedRouteContext;

/**
 * Route context containing matched configuration and parameters.
 */
export interface ConfiguredRoute {
  keyConfig: KeyConfig;
  context: MatchedRouteContext;
}

/**
 * Cache manager class that handles caching operations with configurable strategies.
 * Supports read-through, read-around, write-through, and write-back caching patterns.
 */
class ExtensorCache {
  #store: StoreAdapter;
  #globalConfig: GlobalConfig;
  #patternRegister: Array<KeyConfig>;

  /**
   * Create a cache manager.
   * @param store - The underlying store adapter (must implement put, get, evict, clear, size methods).
   * @param globalConfig - Global configuration settings for the cache.
   */
  constructor(
    store: StoreAdapter,
    globalConfig: GlobalConfig = new GlobalConfig()
  ) {
    this.#store = store;
    this.#globalConfig = globalConfig;
    this.#patternRegister = [];
  }

  /**
   * Write and cache a value.
   * @param key - The cache key.
   * @param value - The value to cache.
   * @returns A Promise which resolves when the put attempt has finished.
   */
  async put(key: string, value: unknown): Promise<void> {
    const route = this.#findRoute(key);

    // write-through
    if (route?.keyConfig.writeStrategy === WriteStrategies.writeThrough) {
      return Promise.resolve(route.keyConfig.writeCallback(route.context)).then(
        () => {
          this.#store.put(key, value, route?.keyConfig.ttl);
        }
      );
    }

    // no write strategy
    this.#store.put(key, value, route?.keyConfig.ttl);

    // write-back
    if (route?.keyConfig.writeStrategy === WriteStrategies.writeBack) {
      return this.#writeBack(route, route.keyConfig.writeCallback);
    }
  }

  /**
   * Fetch a value.
   * @param key - The cache key to retrieve.
   * @returns The value of the key. Depending on the configuration this will be either
   *   a cached or live value.
   * @throws If the key is not found (cache-only mode) or if read callback fails without cached fallback.
   */
  async get(key: string): Promise<unknown> {
    const route = this.#findRoute(key);

    // read-through
    if (route?.keyConfig.readStrategy === ReadStrategies.readThrough) {
      const cachedValue = this.#store.get(key);
      if (cachedValue !== undefined) {
        return cachedValue;
      }
      const freshValue = await route.keyConfig.readCallback(route.context);
      this.#store.put(key, freshValue, route.keyConfig.ttl);
      return freshValue;
    }

    // read-around
    if (route?.keyConfig.readStrategy === ReadStrategies.readAround) {
      let freshValue;
      try {
        freshValue = await route.keyConfig.readCallback(route.context);
        this.#store.put(key, freshValue, route.keyConfig.ttl);
      } catch (error) {
        let errName = "UnknownError";
        let errMessage = String(error);
        if (error instanceof Error) {
          errName = error.name;
          errMessage = error.message;
        }

        freshValue = this.#store.get(key);
        if (freshValue === undefined) {
          throw new Error(
            `Read callback for key ${key} failed due to ${errName}: ${errMessage}. The key was not found in the cache.`
          );
        } else {
          console.info(
            `Read callback for key ${key} failed due to ${errName}: ${errMessage}, reverting to cached value.`
          );
        }
      }
      return freshValue;
    }

    // no read strategy
    const cachedValue = this.#store.get(key);
    if (cachedValue === undefined) {
      throw new Error("Key not found");
    }
    return cachedValue;
  }

  /**
   * Update a value.
   * @param key - The cache key to update.
   * @param value - The new value.
   * @returns A Promise which resolves when the update attempt has finished.
   */
  async update(key: string, value: unknown): Promise<void> {
    const route = this.#findRoute(key);
    if (!route) {
      throw new Error("No configuration found for key!");
    }
    const callback =
      route.keyConfig.updateCallback || route.keyConfig.writeCallback;

    // write-through
    if (route?.keyConfig.writeStrategy === WriteStrategies.writeThrough) {
      return Promise.resolve(callback(route.context)).then(() => {
        this.#store.put(key, value, route?.keyConfig.ttl);
      });
    }

    // no write strategy
    this.#store.put(key, value, route?.keyConfig.ttl);

    // write-back
    if (route?.keyConfig.writeStrategy === WriteStrategies.writeBack) {
      return this.#writeBack(route, callback);
    }
  }

  /**
   * Delete a value.
   * @param key - The cache key to evict.
   * @returns A Promise which resolves when the delete attempt has finished.
   */
  async evict(key: string): Promise<void> {
    const route = this.#findRoute(key);

    // write-through
    if (route?.keyConfig.writeStrategy === WriteStrategies.writeThrough) {
      return Promise.resolve(route.keyConfig.evictCallback(route.context)).then(
        () => {
          this.#store.evict(key);
        }
      );
    }

    // no write strategy
    this.#store.evict(key);

    // write-back
    if (route?.keyConfig.writeStrategy === WriteStrategies.writeBack) {
      return this.#writeBack(route, route.keyConfig.evictCallback);
    }
  }

  /**
   * Add configuration for a new cached value.
   * @param config - The key configuration to register.
   * @throws If the key pattern is invalid.
   */
  register(config: KeyConfig) {
    if (!keyPatternIsValid(config.pattern)) {
      throw new Error("Invalid key pattern!");
    }
    this.#patternRegister.push({ ...this.#globalConfig, ...config });
  }

  /**
   * Remove all cached values.
   */
  clear() {
    this.#store.clear();
  }

  /**
   * Check if a key exists in the cache.
   * @param key - The cache key to check.
   * @returns true if the key is present in the cache.
   */
  containsKey(key: string): boolean {
    return this.#store.get(key) !== undefined;
  }

  /**
   * Count the number of keys stored in the cache.
   * @returns An integer representing the total number of keys stored.
   */
  size(): number {
    return this.#store.size();
  }

  /**
   * Handle callback for keys configured with write-back caching.
   * Implements retry logic with optional exponential backoff.
   * @private
   * @param route - The route context containing key configuration and parameters.
   * @param callback - The callback function to execute.
   * @returns A Promise which resolves when the write has finished, either due to
   *   success or failure after all retry attempts.
   */
  async #writeBack(route: ConfiguredRoute, callback: Callback): Promise<void> {
    const rejectDelay = (reason: string, attempt: number) => {
      return new Promise((resolve, reject) => {
        console.info(
          `Write back for key '${route.context.key}' failed due to ${reason}`
        );
        const nextTimeout =
          route.keyConfig.writeRetryInterval *
          (route.keyConfig.writeRetryBackoff ? 2 ** attempt : 1);
        const cappedTimeout = Math.min(
          route.keyConfig.writeRetryIntervalCap,
          nextTimeout
        );
        setTimeout(reject.bind(null, reason), cappedTimeout);
      });
    };

    const rejectQuit = (reason: string) => {
      console.info(
        `Write back for key '${route.context.key}' failed due to ${reason}`
      );
      console.warn(
        `Write back for key '${route.context.key}' failed after ${tryCount} attempts. Giving up.`
      );
    };

    const tryCount = route.keyConfig.writeRetryCount + 1; // include initial attempt
    let p: Promise<void> = Promise.reject();

    for (let i = 0; i < tryCount; i++) {
      p = p
        .catch(() => callback(route.context))
        .catch(
          i < tryCount - 1 ? (reason) => rejectDelay(reason, i) : rejectQuit
        ) as Promise<void>;
    }

    return p;
  }

  /**
   * Find the configured route matching a key.
   * @private
   * @param key - The key to match against registered patterns.
   * @returns The route which matched the passed key, or undefined if no match found.
   */
  #findRoute(key: string): ConfiguredRoute | undefined {
    for (const keyConfig of this.#patternRegister) {
      const context = checkForMatch(keyConfig.pattern, key);
      if (context.match) {
        return {
          keyConfig,
          context,
        };
      }
    }
  }
}

export default ExtensorCache;
