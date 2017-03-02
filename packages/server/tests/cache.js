'use strict';

const CacheFactory = require('../lib/cache.js');

describe('Cache', () => {

	describe('set method', () => {

		let cache = null;
		let request = {};
		let page = {
			content: 'some html'
		};

		beforeEach(() => {
			cache = CacheFactory({
				$Server: {
					cache: {
						enabled: true,
						cacheKeyGenerator: null,
						entryTtl: 60 * 60 * 1000, // milliseconds
						unusedEntryTtl: 15 * 60 * 1000,
						maxEntries: 1 // milliseconds
					}
				}
			});

			spyOn(cache, '_keyGenerator')
				.and
				.returnValue('key');
		});

		it('should be set page to cache', () => {
			expect(cache.set({}, page)).toEqual(true);
		});

		it('should be not set page to cache for exceed maximum entries limit', () => {
			expect(cache.set({}, page)).toEqual(true);
			expect(cache.set({}, page)).toEqual(false);
		})

	});

});
