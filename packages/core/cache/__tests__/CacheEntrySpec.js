import CacheEntry from 'cache/CacheEntry';

describe('ima.cache.CacheEntry', () => {
	let cacheEntry = null;

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
		expect(cacheEntry.getValue()).toEqual(123);
	});

	it('should be return object for serialization', () => {
		expect(cacheEntry.serialize().value).toEqual(123);
		expect(cacheEntry.serialize().ttl).toEqual(1000);
	});
});
