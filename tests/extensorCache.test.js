import ExtensorCache from "../src/extensorCache";
import InMemoryStoreAdapter from "./testStoreAdapter";
import KeyConfig from "../src/keyConfig";


describe("extensorCache", () => {
  let cache, store;

  beforeEach(() => {
    store = new InMemoryStoreAdapter();
    cache = new ExtensorCache(store);
  });


  test("key-value pairs are stored in the cache", async () => {
    const testKey = "test-key";
    const testValue = "123";

    await cache.put(testKey, testValue);

    expect(store.get(testKey)).toEqual(testValue);
  });


  test("keys with variables are stored correctly", async () => {
    const testKey = "user/0/config/0";
    const testKey1 = "user/1/config/0";
    const testValue = "123";
    const testValue1 = "abc";

    const config = new KeyConfig("user/{uid}/config/{config_id}");

    await cache.put(testKey, testValue);
    await cache.put(testKey1, testValue1);

    expect(store.get(testKey)).toEqual(testValue);
    expect(store.get(testKey1)).toEqual(testValue1);
  });


  test("the promise is rejected if the requested key is not stored", async () => {
    const testKey = "test-key";
    expect.assertions(1);
    await expect(cache.get(testKey)).rejects.toEqual(new Error("Key not found"));
  });


  test("the value is returned if the requested key is in cache", async () => {
    const testKey = "test-key";
    const testValue = "test-value";

    store.put(testKey, testValue);

    const returnedValue = await cache.get(testKey);
    expect(returnedValue).toEqual(testValue);
  });


  test("the correct size of the cache is returned", () => {
    expect(cache.size()).toEqual(0);

    store.put("test-key-0", "test-value");
    expect(cache.size()).toEqual(1);

    store.put("test-key-1", "test-value");
    expect(cache.size()).toEqual(2);
  });


  test("containsKey returns false when a key-value pair is not cached", () => {
    expect(cache.containsKey("test-key")).toBe(false);
  });

  
  test("containsKey returns true when a key-value pair is not cached", () => {
    const testKey = "test-key";
    
    store.put(testKey, "test-value");

    expect(cache.containsKey(testKey)).toBe(true);
  });


  test("clear empties the cache", () => {    
    store.put("test-key-0", "test-value");   
    store.put("test-key-1", "test-value");

    cache.clear();

    expect(store.size()).toEqual(0);
  });


  test("an error is thrown when an invalid key pattern is registered", () => {
    const testPattern = "test/{}";
    const config = new KeyConfig(testPattern);
    expect(() => cache.register(config)).toThrow();
  });
});
