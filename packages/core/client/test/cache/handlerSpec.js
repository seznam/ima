describe('Core.Cache.Handler', function() {

	var cache = null;
	var cacheStorage = null;
	var cacheFactory = null;
	beforeEach(function() {
		cacheStorage = oc.create('$MapStorage');
		cacheFactory = oc.create('$CacheFactory');
		cache = oc.create('Core.Cache.Handler', [cacheStorage, cacheFactory, {enabled: true, ttl: 1000}]);
		cache.set('aaa', 123);
		jasmine.clock().install();
	});

	afterEach(function() {
		jasmine.clock().uninstall();
	});

	it('should be store value for key', function() {
		jasmine.clock().mockDate(new Date());
		cache.set('bbb', 456);
		cache.set('ccc', 321, 2000);

		jasmine.clock().tick(1001);

		expect(cache.has('aaa')).toBe(false);
		expect(cache.has('bbb')).toBe(false);
		expect(cache.has('ccc')).toBe(true);
	});

	it('should be return false for undefined cacheEntry', function() {
		spyOn(cacheStorage, 'has')
			.and
			.returnValue(true);

		expect(cache.has('bbb')).toBe(false);
	});

	it('should be return cached value for exist key', function() {
		expect(cache.get('aaa')).toEqual(123);
	});

	it('should be return null for not exist key', function() {
		expect(cache.get('bbb')).toEqual(null);
	});

	it('should be cleared cache', function() {
		cache.clear();

		expect(cache.has('aaa')).toBe(false);
	});

	it('should be cache disabled', function() {
		cache.disable();

		expect(cache.has('aaa')).toBe(false);
	});

	it('should be serialize and deserialize', function() {
		var serialization = cache.serialize();
		cache.clear();
		cache.deserialize(serialization);

		expect(cache.has('aaa')).toBe(false);
	});

	it('should be throw error for serialize if value is instance of Promise', function() {
		cache.set('promise', Promise.resolve('promise'));

		expect(function() {
			cache.serialize();
		}).toThrow();
	});
});