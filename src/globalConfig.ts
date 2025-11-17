import BaseConfig from "./baseConfig";
import { ReadStrategies, ReadStrategy } from "./readStrategies";
import { WriteStrategies, WriteStrategy } from "./writeStrategies";

/**
 * Global configuration class for cache behavior.
 * Defines default settings for TTL, read/write strategies, and retry policies.
 */
class GlobalConfig extends BaseConfig {
  ttl: number;

  constructor(
    ttl: number = 0,
    readStrategy: ReadStrategy = ReadStrategies.cacheOnly,
    writeStrategy: WriteStrategy = WriteStrategies.cacheOnly
  ) {
    super(readStrategy, writeStrategy);
    this.ttl = ttl;
  }
}

export default GlobalConfig;
