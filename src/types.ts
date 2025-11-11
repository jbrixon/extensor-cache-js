export interface StoreAdapter {
  put: (key: string, value: unknown, ttl?: number) => void;
  get: (key: string) => unknown | undefined;
  evict: (key: string) => void;
  clear: () => void;
  size: () => number;
}
