import GlobalConfig from "./globalConfig";
import KeyConfig from "./keyConfig";
import ExtensorCache from "./extensorCache";
import InMemoryStoreAdapter from "./inMemoryStoreAdapter";
import { ReadStrategies } from "./readStrategies";
import { WriteStrategies } from "./writeStrategies";

export {
  GlobalConfig,
  KeyConfig,
  ExtensorCache,
  InMemoryStoreAdapter as InMemoryStore,
  ReadStrategies,
  WriteStrategies,
};

export default {
  GlobalConfig,
  KeyConfig,
  ExtensorCache,
  InMemoryStore: InMemoryStoreAdapter,
  ReadStrategies,
  WriteStrategies,
};
