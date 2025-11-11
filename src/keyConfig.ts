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
    this.pattern = pattern;
    this.readCallback = readCallback;
    this.readStrategy = readStrategy;
    this.writeCallback = writeCallback;
    this.writeStrategy = writeStrategy;
    this.evictCallback = () => {};
    this.updateCallback = undefined;
  }
}

export default KeyConfig;
