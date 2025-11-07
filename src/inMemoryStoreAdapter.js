/**
 * In-memory cache store adapter with automatic expiration handling.
 * Implements active deletion of expired values at regular intervals.
 */
class InMemoryStoreAdapter {
  #cache;

  /**
   * Create an in-memory store adapter.
   * Initializes the cache and starts background expiration cleanup.
   */
  constructor() {
    this.#cache = {};

    setInterval(() => this.#activelyDeleteExpiredValues(), 100);
  }

  /**
   * Store a value in the cache with optional TTL.
   * @param {string} key - The cache key.
   * @param {*} value - The value to store.
   * @param {number} [ttl=0] - Time to live in seconds. A value of 0 means no expiration.
   */
  put(key, value, ttl = 0) {
    const created = new Date();

    this.#cache[key] = {
      value,
      ttl,
      created,
      expires: new Date(created).setSeconds(created.getSeconds() + ttl),
    };
  }

  /**
   * Retrieve a value from the cache.
   * @param {string} key - The cache key.
   * @returns {*|undefined} The cached value if found and not expired, otherwise undefined.
   */
  get(key) {
    if (!(key in this.#cache)) {
      return;
    }
    return this.#checkForFreshness(key);
  }

  /**
   * Remove a value from the cache.
   * @param {string} key - The cache key to evict.
   */
  evict(key) {
    delete this.#cache[key];
  }

  /**
   * Clear all values from the cache.
   */
  clear() {
    this.#cache = {};
  }

  /**
   * Get the number of entries in the cache.
   * @returns {number} The count of cached entries.
   */
  size() {
    return Object.keys(this.#cache).length;
  }

  /**
   * Check if a cached value is still fresh and delete if expired.
   * @private
   * @param {string} key - The cache key to check.
   * @returns {*|undefined} The cached value if fresh, undefined if expired or not found.
   */
  #checkForFreshness(key) {
    const cache = this.#cache[key];
    if (!cache) {
      return;
    }
    const now = new Date();
    // console.log(key)
    // console.log(cache.ttl !== 0 && cache.expires < now);
    if (cache.ttl !== 0 && cache.expires < now) {
      // expired
      console.log(`Deleting ${key}`);
      delete this.#cache[key];
      return;
    }

    return cache.value;
  }

  /**
   * Actively delete expired values by sampling random keys.
   * Runs periodically to prevent expired values from accumulating.
   * Samples up to 20 keys per interval.
   * @private
   */
  #activelyDeleteExpiredValues() {
    const keys = Object.keys(this.#cache);
    let selectedKeys = [];

    if (keys.length <= 20) {
      selectedKeys = keys;
    } else {
      for (let i = 0, c = 20; i < c; i++) {
        const randomIndex = Math.floor(Math.random() * keys.length);
        const key = keys[randomIndex];
        if (!selectedKeys.includes(key)) {
          selectedKeys.push(keys[randomIndex]);
        }
      }
    }

    console.log(`Checking ${selectedKeys.length} for expired values`);

    for (const key of selectedKeys) {
      this.#checkForFreshness(key);
    }
  }
}

export default InMemoryStoreAdapter;
