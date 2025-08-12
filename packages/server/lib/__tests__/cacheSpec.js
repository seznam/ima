import { beforeEach, describe, expect, it, vi } from 'vitest';

const CacheFactory = require('../cache.js');

describe('Cache', () => {
  describe('set method', () => {
    let cache = null;
    let page = {
      content: 'some html',
    };

    beforeEach(() => {
      cache = CacheFactory({
        environment: {
          $Server: {
            cache: {
              enabled: true,
              cacheKeyGenerator: null,
              entryTtl: 60 * 60 * 1000, // milliseconds
              unusedEntryTtl: 15 * 60 * 1000,
              maxEntries: 1, // milliseconds
            },
          },
        },
      });

      vi.spyOn(cache, '_keyGenerator').mockReturnValue('key');
    });

    it('should set page to cache', () => {
      expect(cache.set({}, page)).toBe(true);
    });

    it('should not set page to cache for exceed maximum entries limit', () => {
      expect(cache.set({}, page)).toBe(true);
      expect(cache.set({}, page)).toBe(false);
    });

    it('should get page from cache', () => {
      expect(cache.set({}, page)).toBe(true);

      expect(cache.get({})).toEqual(page);
    });
  });
});
