import MapStorage from 'storage/MapStorage';
import SessionMapStorage from 'storage/SessionMapStorage';

describe('ima.storage.SessionMapStorage', () => {

	let sessionMap;
	let mapStorage = null;
	let sessionStorage = null;

	beforeEach(() => {
		mapStorage = new MapStorage();
		sessionStorage = new MapStorage();
		sessionMap = new SessionMapStorage(mapStorage, sessionStorage);

		sessionMap.init();
		sessionMap.clear();

	});

	afterEach(() => {
		sessionMap.clear();
	});

	it('should set and get items', () => {
		sessionMap.set('item1', 1);
		expect(sessionMap.get('item1')).toEqual(1);

		sessionMap.set('item2', 'test');
		expect(sessionMap.get('item2')).toEqual('test');

		sessionMap.set('item3', false);
		expect(sessionMap.get('item3')).toEqual(false);

		let obj = { testedProp: 'testedValue' };
		sessionMap.set('item4', obj);
		expect(sessionMap.get('item4')).toEqual(obj);

		let arr = [0, 'val', true, {}];
		sessionMap.set('item5', arr);
		expect(sessionMap.get('item5')).toEqual(arr);
	});

	it('should set promise value only to map storage', () => {
		spyOn(sessionStorage, 'set')
			.and
			.stub();

		sessionMap.set('promise', Promise.resolve(1));

		expect(sessionStorage.set).not.toHaveBeenCalled();
	});

	it('should should have (not) an item', () => {
		expect(sessionMap.has('item1')).toBeFalsy();
		sessionMap.set('item1', 1);
		expect(sessionMap.has('item1')).toBeTruthy();
	});

	it('should clear all items', () => {
		sessionMap
			.set('item1', 1)
			.set('item2', 'test')
			.set('item3', false)
			.clear();

		expect(sessionMap.has('item1')).toBeFalsy();
		expect(sessionMap.has('item2')).toBeFalsy();
		expect(sessionMap.has('item3')).toBeFalsy();
	});

	it('should delete selected items only', () => {
		sessionMap
			.set('item1', 1)
			.set('item2', 'test')
			.set('item3', false)
			.delete('item1')
			.delete('item3');

		expect(sessionMap.has('item1')).toBeFalsy();
		expect(sessionMap.has('item2')).toBeTruthy();
		expect(sessionMap.has('item3')).toBeFalsy();
	});

	it('should return keys', () => {
		sessionMap
			.set('item1', 1)
			.set('item2', 'test')
			.set('item3', false);

		let index = 0;
		let iterator = sessionMap.keys();
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
