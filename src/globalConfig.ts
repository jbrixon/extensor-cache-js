import { ReadStrategies, ReadStrategy } from "./readStrategies";
import { WriteStrategies, WriteStrategy } from "./writeStrategies";

/**
 * Global configuration class for cache behavior.
 * Defines default settings for TTL, read/write strategies, and retry policies.
 * @type {GlobalConfig}
 */
class GlobalConfig {
  ttl: number;
  readStrategy: ReadStrategy;
  writeStrategy: WriteStrategy;
  writeRetryCount: number;
  writeRetryInterval: number;
  writeRetryBackoff: boolean;
  writeRetryIntervalCap: number;

  constructor(
    ttl: number = 0,
    readStrategy: ReadStrategy = ReadStrategies.cacheOnly,
    writeStrategy: WriteStrategy = WriteStrategies.cacheOnly
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
