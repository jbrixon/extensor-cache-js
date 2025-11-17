// Placeholder acceptance test suite
import ExtensorCache from "../../src/extensorCache";
import InMemoryStoreAdapter from "../unit/testStoreAdapter";

describe("acceptance: basic workflows", () => {
  test("basic put/get/evict flow works end-to-end", async () => {
    const store = new InMemoryStoreAdapter();
    const cache = new ExtensorCache(store);

    const key = "acceptance/key/1";
    const value = "v1";

    await cache.put(key, value);
    const got = await cache.get(key);
    expect(got).toEqual(value);

    await cache.evict(key);
    await expect(cache.get(key)).rejects.toBeDefined();
  });
});
