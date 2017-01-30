import CacheEntry from 'cache/CacheEntry';

describe('ima.cache.CacheEntry', () => {

	let cacheEntry = null;

	beforeEach(() => {
		cacheEntry = new CacheEntry(123, 1000);
		jasmine.clock().install();
	});

	afterEach(() => {
		jasmine.clock().uninstall();
	});

	it('should be return true if is expired', () => {
		jasmine.clock().mockDate(new Date());

		jasmine.clock().tick(500);
		expect(cacheEntry.isExpired()).toBe(false);

		jasmine.clock().tick(1001);
		expect(cacheEntry.isExpired()).toBe(true);
	});

	it('should return value', () => {
		expect(cacheEntry.getValue()).toEqual(123);
	});

	it('should be return object for serialization', () => {
		expect(cacheEntry.serialize().value).toEqual(123);
		expect(cacheEntry.serialize().ttl).toEqual(1000);
	});
});
