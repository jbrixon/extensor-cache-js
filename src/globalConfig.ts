import { ReadStrategies, ReadStrategy } from "./readStrategies";
import { WriteStrategies, WriteStrategy } from "./writeStrategies";

/**
 * Global configuration class for cache behavior.
 * Defines default settings for TTL, read/write strategies, and retry policies.
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
    this.ttl = ttl;
    this.readStrategy = readStrategy;
    this.writeStrategy = writeStrategy;
    this.writeRetryCount = 1;
    this.writeRetryInterval = 1000;
    this.writeRetryBackoff = true;
    this.writeRetryIntervalCap = 60 * 60 * 1000; // 1hr
  }
}

export default GlobalConfig;
