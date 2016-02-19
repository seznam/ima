describe('Ima.Cache.Entry', function() {

	var cacheData = null;
	beforeEach(function() {
		cacheData = oc.create('Ima.Cache.Entry', [123, 1000]);
		jasmine.clock().install();
	});

	afterEach(function() {
		jasmine.clock().uninstall();
	});

	it('should be return true if is expired', function() {
		jasmine.clock().mockDate(new Date());

		jasmine.clock().tick(500);
		expect(cacheData.isExpired()).toBe(false);

		jasmine.clock().tick(1001);
		expect(cacheData.isExpired()).toBe(true);
	});

	it('should return value', function() {
		expect(cacheData.getValue()).toEqual(123);
	});

	it('should be return object for serialization', function() {
		expect(cacheData.serialize().value).toEqual(123);
		expect(cacheData.serialize().ttl).toEqual(1000);
	});
});
