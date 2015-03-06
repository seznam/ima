describe('Core.Cache.Data', function() {

	var cacheData = null;
	beforeEach(function() {
		cacheData = ns.oc.create('Core.Cache.Data', 123, 1000);
		jasmine.clock().install();
	});

	afterEach(function() {
		jasmine.clock().uninstall();
	});

	it('should be return true if is live', function() {
		jasmine.clock().mockDate(new Date());

		jasmine.clock().tick(500);
		expect(cacheData.isLive()).toBe(true);

		jasmine.clock().tick(1001);
		expect(cacheData.isLive()).toBe(false);
	});

	it('should be return value', function() {
		expect(cacheData.getValue()).toEqual(123);
	});

	it('should be return object for serialization', function() {
		expect(cacheData.getData().value).toEqual(123);
		expect(cacheData.getData().TTL).toEqual(1000);
	});
});