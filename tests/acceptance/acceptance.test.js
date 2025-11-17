// Placeholder acceptance test suite
import { ExtensorCache } from "extensor-cache";

class StoreSpy {
  constructor() {
    this.putValues = {};
    this.evictedKeys = [];
  }

  put(key, value, ttl) {
    if (!(key in this.putValues)) {
      this.putValues[key] = [];
    }
    this.putValues[key].push({ value, ttl });
  }

  get(key) {
    if (key in this.putValues) {
      return this.putValues[key][this.putValues[key].length - 1].value;
    }
    return undefined;
  }

  evict(key) {
    this.evictedKeys.push(key);
  }

  clear() {}

  size() {
    return 0;
  }
}

describe("acceptance: basic workflows", () => {
  test("values are correctly stored", async () => {
    const store = new StoreSpy();
    const cache = new ExtensorCache(store);

    const key = "acceptance/key/1";
    const value = "v1";

    await cache.put(key, value);

    expect(store.putValues[key]).toHaveLength(1);
    expect(store.putValues[key][0].value).toEqual(value);
  });

  test("cached values are retrievable", async () => {
    const store = new StoreSpy();
    const cache = new ExtensorCache(store);
    const key = "acceptance/key/1";
    const value = "v1";
    await cache.put(key, value);

    const got = await cache.get(key);
    expect(got).toEqual(value);
  });

  test("keys are correctly evicted", async () => {
    const store = new StoreSpy();
    const cache = new ExtensorCache(store);
    const key = "acceptance/key/1";
    const value = "v1";
    await cache.put(key, value);

    await cache.evict(key);

    expect(store.evictedKeys).toHaveLength(1);
    expect(store.evictedKeys[0]).toEqual(key);
  });

  test("non-cached keys are not retrievable", async () => {
    const store = new StoreSpy();
    const cache = new ExtensorCache(store);
    const key = "acceptance/key/1";

    await expect(cache.get(key)).rejects.toBeDefined();
  });
});
