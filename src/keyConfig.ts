import GlobalConfig from "./globalConfig";
import { ReadStrategies, ReadStrategy } from "./readStrategies";
import { WriteStrategies, WriteStrategy } from "./writeStrategies";

export type Callback = (context: {
  key: string;
  params: object;
}) => Promise<unknown> | unknown;

/**
 * Key-specific configuration class that extends GlobalConfig.
 * Defines caching behavior for keys matching a specific pattern.
 * @type {KeyConfig}
 */
class KeyConfig extends GlobalConfig {
  pattern: string;
  readCallback: Callback;
  readStrategy: ReadStrategy;
  writeCallback: Callback;
  writeStrategy: WriteStrategy;
  evictCallback: Callback;
  updateCallback?: Callback;

  constructor(
    pattern: string,
    ttl: number = 0,
    readCallback: Callback = () => {},
    readStrategy: ReadStrategy = ReadStrategies.cacheOnly,
    writeCallback: Callback = () => {},
    writeStrategy: WriteStrategy = WriteStrategies.cacheOnly
  ) {
    super(ttl, readStrategy, writeStrategy);
    /** @type {string} The key pattern */
    this.pattern = pattern;
    /** @type {Callback} Read callback function */
    this.readCallback = readCallback;
    /** @type {ReadStrategy} The read strategy */
    this.readStrategy = readStrategy;
    /** @type {Callback} Write callback function */
    this.writeCallback = writeCallback;
    /** @type {WriteStrategy} The write strategy */
    this.writeStrategy = writeStrategy;
    /** @type {Callback} Evict callback function */
    this.evictCallback = () => {};
    /** @type {Callback|undefined} Update callback function (optional, falls back to writeCallback) */
    this.updateCallback = undefined;
  }
}

export default KeyConfig;
