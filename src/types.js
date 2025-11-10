/**
 * Global configuration object for cache behavior.
 * @typedef {object} GlobalConfig
 * @property {number} ttl - Time to live in seconds for cached values. 0 means no expiration.
 * @property {ReadStrategy} readStrategy - Strategy for reading values (CACHE_ONLY, READ_THROUGH, or READ_AROUND).
 * @property {WriteStrategy} writeStrategy - Strategy for writing values (CACHE_ONLY, WRITE_THROUGH, or WRITE_BACK).
 * @property {number} writeRetryCount - Number of retry attempts for write-back operations.
 * @property {number} writeRetryInterval - Initial retry interval in milliseconds.
 * @property {boolean} writeRetryBackoff - Whether to use exponential backoff for retries.
 * @property {number} writeRetryIntervalCap - Maximum retry interval in milliseconds.
 */

/**
 * Key-specific configuration object that extends GlobalConfig.
 * @typedef {object} KeyConfig
 * @augments GlobalConfig
 * @property {string} pattern - The key pattern to match (supports parameter placeholders like {id}).
 * @property {Callback} readCallback - Callback function to execute for read operations.
 * @property {Callback} writeCallback - Callback function to execute for write operations.
 * @property {Callback} evictCallback - Callback function to execute for eviction operations.
 * @property {Callback} updateCallback - Callback function to execute for update operations (optional).
 */

/**
 * Read strategy type for cache operations.
 * @typedef {"CACHE_ONLY" | "READ_THROUGH" | "READ_AROUND"} ReadStrategy
 */

/**
 * Write strategy type for cache operations.
 * @typedef {"CACHE_ONLY" | "WRITE_THROUGH" | "WRITE_BACK"} WriteStrategy
 */

/**
 * @typedef {object} StoreAdapter
 * @property {(key: string, value: any, ttl?: number) => void} put - Store a value with optional TTL (seconds).
 * @property {(key: string) => any | undefined} get - Retrieve a value or undefined if missing/expired.
 * @property {(key: string) => void} evict - Remove a key from the store.
 * @property {() => void} clear - Remove all entries from the store.
 * @property {() => number} size - Return number of entries in the store.
 */

/**
 * Route context containing matched configuration and parameters.
 * @typedef {object} RouteContext
 * @property {KeyConfig} keyConfig - The key configuration that matched.
 * @property {object} context - Context object containing the key and extracted parameters.
 * @property {string} context.key - The original key that was matched.
 * @property {object} context.params - Extracted parameters from the key pattern.
 * @property {boolean} context.match - Whether the pattern matched.
 */

/**
 * Callback function for cache operations.
 * @callback Callback
 * @param {object} context - Context object containing the key and extracted parameters.
 * @param {string} context.key - The cache key.
 * @param {object} context.params - Extracted parameters from the key pattern.
 * @returns {Promise<*>|*} The result of the callback operation.
 */
