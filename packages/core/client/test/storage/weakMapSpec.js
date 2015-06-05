xdescribe('Core.Storage.WeakMap', function () {

	var map;

	beforeEach(function () {
		map = oc.create('Core.Storage.WeakMap', [{
			entryTtl: 100,
			maxEntries: 3,
			gcInterval: 75,
			gcEntryCountTreshold: 2
		}]);
		map.set("a", 1);
	});

	afterEach(function () {
		map.clear();
	});

	it("should allow retrieving existing entries", function () {
		expect(map.get("a")).toBe(1);
	});

	it("should return undefined for non-existing entries", function () {
		expect(map.get("something")).toBeUndefined();
	});

	it("should allow storing new values", function () {
		map.set("foo", "bar");
		expect(map.get("foo")).toBe("bar");
	});

	it("should allow over-writing existing values", function () {
		map.set("a", 42);
		expect(map.get("a")).toBe(42);
	});

	it("should allow deleting existing values", function () {
		map.delete("a");
		expect(map.get("a")).toBeUndefined();
	});

	it("should allow clearing itself of all entries", function () {
		map.clear();
		expect(map.get("a")).toBeUndefined();
	});

	it("should not start garbage collector before there are enough values",
		function (done) {
			delay(200).then(function () {
				expect(map.get("a")).toBe(1);

				map.set("b", 2);

				return delay(200);
			}).then(function () {
				expect(map.get("a")).toBe(1);
				expect(map.get("b")).toBe(2);

				done();
			});
		});

	// TODO: Should be updated/corrected.
	it("should start garbage collector once there are enough values",
		function (done) {
			delay(50).then(function () {
				map
					.set("b", 2)
					.set("c", 3);

				return delay(100);
			}).then(function () {
				expect(map.get("a")).toBeUndefined();
				expect(map.get("b")).toBe(2);
				expect(map.get("c")).toBe(3);

				return delay(100);
			}).then(function () {
				expect(map.get("b")).toBeUndefined();
				expect(map.get("c")).toBeUndefined();

				done();
			});
		});

	it("should stop garbage collector once the storage is empty",
		function (done) {
			delay(50).then(function () {
				map
					.set("b", 2)
					.set("c", 3);

				return delay(90);
			}).then(function () {
				expect(map.get("a")).toBeUndefined();

				map
					.delete("b")
					.delete("c");

				map.set("x", 42);

				return delay(200);
			}).then(function () {
				expect(map.get("x")).toBe(42);

				done();
			});
		});

	// TODO: Should be updated/corrected.
	it("should use garbage collector to dispose the oldest overflowing entries",
		function (done) {
			delay(1).then(function () {
				map.set("b", 2);

				return delay(1);
			}).then(function () {
				map.set("c", 3);

				return delay(1);
			}).then(function () {
				map.set("d", 4);

				return delay(1);
			}).then(function () {
				expect(map.get("a")).toBe(1); // gc's first run must be delayed

				map.set("e", 5);

				return delay(80);
			}).then(function () {
				expect(map.get("a")).toBeUndefined();
				expect(map.get("b")).toBeUndefined();
				expect(map.get("c")).toBe(3);
				expect(map.get("d")).toBe(4);
				expect(map.get("e")).toBe(5);
				expect(Array.from(map.keys()).sort()).toEqual(["c", "d", "e"]);

				done();
			});
		});

	function delay(timeout) {
		return new Promise(function (resolve) {
			setTimeout(resolve, timeout);
		});
	}

});