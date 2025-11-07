import ReadStrategies from "./readStrategies";
import WriteStrategies from "./writeStrategies";

/**
 * Global configuration class for cache behavior.
 * Defines default settings for TTL, read/write strategies, and retry policies.
 * @type {GlobalConfig}
 */
class GlobalConfig {
  /**
   * Create a global configuration object.
   * @param {number} [ttl=0] - Time to live in seconds. A value of 0 means no expiration.
   * @param {ReadStrategy} [readStrategy=ReadStrategies.cacheOnly] - The read strategy to use (CACHE_ONLY, READ_THROUGH, or READ_AROUND).
   * @param {WriteStrategy} [writeStrategy=WriteStrategies.cacheOnly] - The write strategy to use (CACHE_ONLY, WRITE_THROUGH, or WRITE_BACK).
   */
  constructor(
    ttl = 0,
    readStrategy = ReadStrategies.cacheOnly,
    writeStrategy = WriteStrategies.cacheOnly
  ) {
    /** @type {number} Time to live in seconds */
    this.ttl = ttl;
    /** @type {ReadStrategy} The read strategy */
    this.readStrategy = readStrategy;
    /** @type {WriteStrategy} The write strategy */
    this.writeStrategy = writeStrategy;
    /** @type {number} Number of retry attempts for write-back operations */
    this.writeRetryCount = 1;
    /** @type {number} Initial retry interval in milliseconds */
    this.writeRetryInterval = 1000;
    /** @type {boolean} Whether to use exponential backoff for retries */
    this.writeRetryBackoff = true;
    /** @type {number} Maximum retry interval cap (1 hour in milliseconds) */
    this.writeRetryIntervalCap = 60 * 60 * 1000; // 1hr
  }
}

export default GlobalConfig;
