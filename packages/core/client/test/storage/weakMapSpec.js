xdescribe('Core.Storage.WeakMap', function () {

	var map;

	beforeEach(function () {
		map = oc.create('Core.Storage.WeakMap', [{
			entryTtl: 100
		}]);
		map.set("a", { num: 1 });
	});

	afterEach(function () {
		map.clear();
	});

	it("should reject primitive values", function () {
		expect(function () {
			map.set("b", "some string");
		}).toThrow();
	});

	it("should allow retrieving existing entries", function () {
		expect(map.get("a")).toEqual({ num: 1 });
	});

	it("should return undefined for non-existing entries", function () {
		expect(map.get("something")).toBeUndefined();
	});

	it("should allow storing new values", function () {
		map.set("foo", { string: "bar" });
		expect(map.get("foo")).toEqual({ string: "bar" });
	});

	it("should allow over-writing existing values", function () {
		map.set("a", { num2: 42 });
		expect(map.get("a")).toBe({ num2: 42 });
	});

	it("should allow deleting existing values", function () {
		map.delete("a");
		expect(map.get("a")).toBeUndefined();
	});

	it("should allow clearing itself of all entries", function () {
		map.clear();
		expect(map.get("a")).toBeUndefined();
	});

	it("should discard expired entries", function () {
		expect(map.size()).toBe(1);

		jasmine.clock().mockDate(new Date());
		jasmine.clock().tick(101);
		expect(map.size()).toBe(0);
	});

});