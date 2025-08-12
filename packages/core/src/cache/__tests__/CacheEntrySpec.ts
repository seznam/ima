import { beforeEach, describe, expect, it } from 'vitest';

import { CacheEntry } from '../CacheEntry';

describe('ima.core.cache.CacheEntry', () => {
  let cacheEntry: CacheEntry<number>;

  beforeEach(() => {
    Date.now = () => 1000;
    cacheEntry = new CacheEntry(123, 1000);
  });

  it('should be return true if is expired', () => {
    Date.now = () => 2001;
    expect(cacheEntry.isExpired()).toBe(true);
  });

  it('should be return false if is not expired', () => {
    Date.now = () => 1500;
    expect(cacheEntry.isExpired()).toBe(false);
  });

  it('should return value', () => {
    expect(cacheEntry.getValue()).toBe(123);
  });

  it('should be return object for serialization', () => {
    expect(cacheEntry.serialize().value).toBe(123);
    expect(cacheEntry.serialize().ttl).toBe(1000);
  });
});
