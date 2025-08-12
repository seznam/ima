import { beforeEach, describe, expect, it, vi } from 'vitest';

const CacheFactory = require('../lib/cache.js');

describe('cache', () => {
  describe('set method', () => {
    let cache = null;
    let page = {
      content: 'some html',
    };

    beforeEach(() => {
      cache = CacheFactory({
        $Server: {
          cache: {
            enabled: true,
            cacheKeyGenerator: null,
            entryTtl: 60 * 60 * 1000, // milliseconds
            unusedEntryTtl: 15 * 60 * 1000,
            maxEntries: 1, // milliseconds
          },
        },
      });

      vi.spyOn(cache, '_keyGenerator').mockReturnValue('key');
    });

    it('should be set page to cache', () => {
      expect(cache.set({}, page)).toBeTruthy();
    });

    it('should be not set page to cache for exceed maximum entries limit', () => {
      expect(cache.set({}, page)).toBeTruthy();
      expect(cache.set({}, page)).toBeFalsy();
    });
  });
});
