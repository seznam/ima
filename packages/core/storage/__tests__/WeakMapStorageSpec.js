import WeakMapStorage from 'storage/WeakMapStorage';

describe('ima.storage.WeakMapStorage', () => {

	let map;

	beforeEach(() => {
		map = new WeakMapStorage({
			entryTtl: 100
		});

		map.set('a', { num: 1 });
	});

	afterEach(() => {
		map.clear();
	});

	it("should reject primitive values", () => {
		expect(() => {
			map.set("b", "some string");
		}).toThrow();
	});

	it("should allow retrieving existing entries", () => {
		expect(map.get("a")).toEqual({ num: 1 });
	});

	it("should return undefined for non-existing entries", () => {
		expect(map.get("something")).toBeUndefined();
	});

	it("should allow storing new values", () => {
		map.set("foo", { string: "bar" });

		expect(map.get("foo")).toEqual({ string: "bar" });
	});

	it("should allow over-writing existing values", () => {
		map.set("a", { num2: 42 });

		expect(map.get("a")).toEqual({ num2: 42 });
	});

	it("should allow deleting existing values", () => {
		map.delete("a");

		expect(map.get("a")).toBeUndefined();
	});

	it("should allow clearing itself of all entries", () => {
		map.clear();

		expect(map.get("a")).toBeUndefined();
	});

	it("should discard expired entries", () => {
		expect(map.size()).toBe(1);

		jasmine.clock().install();
		jasmine.clock().mockDate(new Date());
		jasmine.clock().tick(101);

		expect(map.size()).toBe(0);
	});

});
