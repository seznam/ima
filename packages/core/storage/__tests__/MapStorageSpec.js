import MapStorage from 'storage/MapStorage';

describe('ima.storage.Map', () => {

	let map;

	beforeEach(() => {
		map = new MapStorage();

		map.init();
		map.clear();
	});

	afterEach(() => {
		map.clear();
	});

	it('should set and get items', () => {

		map.set('item1', 1);
		expect(map.get('item1')).toEqual(1);

		map.set('item2', 'test');
		expect(map.get('item2')).toEqual('test');

		map.set('item3', false);
		expect(map.get('item3')).toEqual(false);

		let obj = { testedProp: 'testedValue' };
		map.set('item4', obj);
		expect(map.get('item4')).toEqual(obj);

		let arr = [0, 'val', true, {}];
		map.set('item5', arr);
		expect(map.get('item5')).toEqual(arr);
	});

	it('should should have (not) an item', () => {
		expect(map.has('item1')).toBeFalsy();
		map.set('item1', 1);
		expect(map.has('item1')).toBeTruthy();
	});

	it('should clear all items', () => {
		map
			.set('item1', 1)
			.set('item2', 'test')
			.set('item3', false)
			.clear();

		expect(map.has('item1')).toBeFalsy();
		expect(map.has('item2')).toBeFalsy();
		expect(map.has('item3')).toBeFalsy();
	});

	it('should delete selected items only', () => {
		map
			.set('item1', 1)
			.set('item2', 'test')
			.set('item3', false)
			.delete('item1')
			.delete('item3');

		expect(map.has('item1')).toBeFalsy();
		expect(map.has('item2')).toBeTruthy();
		expect(map.has('item3')).toBeFalsy();
	});

	it('should return keys', () => {
		map
			.set('item1', 1)
			.set('item2', 'test')
			.set('item3', false);

		let index = 0;
		let iterator = map.keys();
		let item = iterator.next();

		do {
			switch (index++) {
				case 0:
					expect(item.value).toEqual('item1');
					break;
				case 1:
					expect(item.value).toEqual('item2');
					break;
				default:
					expect(item.value).toEqual('item3');
					break;
			}
			item = iterator.next();

		} while (item.done !== true);

	});
});
