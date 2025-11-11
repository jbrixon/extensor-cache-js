import ExtensorCache from "../src/extensorCache";
import GlobalConfig from "../src/globalConfig";
import KeyConfig from "../src/keyConfig";
import InMemoryStoreAdapter from "./testStoreAdapter";

describe("globalConfig TTL", () => {
  let cache, store, globalConfig;

  beforeEach(() => {
    store = new InMemoryStoreAdapter();
    globalConfig = new GlobalConfig();
    globalConfig.ttl = 300; // 5 minutes
    cache = new ExtensorCache(store, globalConfig);
  });

  test("global config TTL is applied when KeyConfig does not specify TTL", async () => {
    const keyConfig = new KeyConfig("test/{id}");
    cache.register(keyConfig);

    await cache.put("test/123", "test-value");

    // The stored value should have the global TTL
    const cachedEntry = store.getCacheEntry("test/123");
    expect(cachedEntry).toBeDefined();
    expect(cachedEntry.ttl).toBe(300);
  });

  test("KeyConfig TTL overrides global config TTL when explicitly set", async () => {
    const keyConfig = new KeyConfig("test/{id}", 600); // 10 minutes
    cache.register(keyConfig);

    await cache.put("test/456", "test-value");

    // The stored value should have the KeyConfig TTL
    const cachedEntry = store.getCacheEntry("test/456");
    expect(cachedEntry).toBeDefined();
    expect(cachedEntry.ttl).toBe(600);
  });

  test("global config TTL of 0 (no expiration) works correctly", async () => {
    const globalConfigNoExpiry = new GlobalConfig();
    globalConfigNoExpiry.ttl = 0;
    const cacheNoExpiry = new ExtensorCache(store, globalConfigNoExpiry);

    const keyConfig = new KeyConfig("test/{id}");
    cacheNoExpiry.register(keyConfig);

    await cacheNoExpiry.put("test/789", "test-value");

    const cachedEntry = store.getCacheEntry("test/789");
    expect(cachedEntry).toBeDefined();
    expect(cachedEntry.ttl).toBe(0);
  });
});
