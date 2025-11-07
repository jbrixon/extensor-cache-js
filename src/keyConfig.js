import GlobalConfig from "./globalConfig";
import ReadStrategies from "./readStrategies";
import WriteStrategies from "./writeStrategies";

/**
 * Key-specific configuration class that extends GlobalConfig.
 * Defines caching behavior for keys matching a specific pattern.
 * @type {KeyConfig}
 */
class KeyConfig extends GlobalConfig {
  /**
   * Create a key configuration object.
   * @param {string} pattern - The key pattern to match (supports parameter placeholders like {id}).
   * @param {number} [ttl=0] - Time to live in seconds. A value of 0 means no expiration.
   * @param {Callback} [readCallback=()=>{}] - Callback function to execute for read operations.
   * @param {ReadStrategy} [readStrategy=ReadStrategies.cacheOnly] - The read strategy to use.
   * @param {Callback} [writeCallback=()=>{}] - Callback function to execute for write operations.
   * @param {WriteStrategy} [writeStrategy=WriteStrategies.cacheOnly] - The write strategy to use.
   */
  constructor(
    pattern,
    ttl = 0,
    readCallback = () => {},
    readStrategy = ReadStrategies.cacheOnly,
    writeCallback = () => {},
    writeStrategy = WriteStrategies.cacheOnly
  ) {
    super(ttl, readStrategy, writeStrategy);
    /** @type {string} The key pattern */
    this.pattern = pattern;
    /** @type {Callback} Read callback function */
    this.readCallback = readCallback;
    /** @type {Callback} Write callback function */
    this.writeCallback = writeCallback;
    /** @type {Callback} Evict callback function */
    this.evictCallback = () => {};
    /** @type {Callback|undefined} Update callback function (optional, falls back to writeCallback) */
    this.updateCallback = undefined;
  }
}

export default KeyConfig;
