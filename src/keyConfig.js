import ReadStrategies from "./readStrategies";
import WriteStrategies from "./writeStrategies";


class KeyConfig {
  constructor(pattern, ttl=0, readCallback=()=>{}, readStrategy=ReadStrategies.cacheOnly, writeCallback=()=>{}, writeStrategy=WriteStrategies.cacheOnly) {
    this.pattern = pattern;
    this.ttl = ttl;
    this.readCallback = readCallback;
    this.readStrategy = readStrategy;
    this.writeCallback = writeCallback;
    this.writeStrategy = writeStrategy;
    this.writeRetryCount = 1;
    this.writeRetryInterval = 1000;
    this.evictCallback = () => {};
    this.updateCallback = undefined;
  }
}


export default KeyConfig;
