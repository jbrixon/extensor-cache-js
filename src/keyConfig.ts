import GlobalConfig from "./globalConfig";
import { ReadStrategy } from "./readStrategies";
import { WriteStrategy } from "./writeStrategies";

export type Callback = (context: {
  key: string;
  params: object;
}) => Promise<unknown> | unknown;

/**
 * Key-specific configuration class that extends GlobalConfig.
 * Defines caching behavior for keys matching a specific pattern.
 */
class KeyConfig extends GlobalConfig {
  pattern: string;
  readCallback: Callback;
  writeCallback: Callback;
  evictCallback: Callback;
  updateCallback?: Callback;

  constructor(
    pattern: string,
    ttl?: number,
    readCallback?: Callback,
    readStrategy?: ReadStrategy,
    writeCallback?: Callback,
    writeStrategy?: WriteStrategy
  ) {
    super();
    this.pattern = pattern;

    // Only set ttl if explicitly provided, otherwise delete the inherited default
    if (ttl !== undefined) {
      this.ttl = ttl;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (this as any).ttl;
    }

    this.readCallback = readCallback !== undefined ? readCallback : () => {};

    // Only set readStrategy if explicitly provided, otherwise delete the inherited default
    if (readStrategy !== undefined) {
      this.readStrategy = readStrategy;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (this as any).readStrategy;
    }

    this.writeCallback = writeCallback !== undefined ? writeCallback : () => {};

    // Only set writeStrategy if explicitly provided, otherwise delete the inherited default
    if (writeStrategy !== undefined) {
      this.writeStrategy = writeStrategy;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (this as any).writeStrategy;
    }

    this.evictCallback = () => {};
    this.updateCallback = undefined;
  }
}

export default KeyConfig;

