import SessionStorage from 'storage/SessionStorage';
import Window from 'window/Window';

describe('ima.storage.SessionStorage', () => {
	let session;
	let window;
	let sessionStorage = {
		_storage: new Map(),
		setItem: (key, value) => sessionStorage._storage.set(key, value),
		getItem: key => sessionStorage._storage.get(key),
		removeItem: key => sessionStorage._storage.delete(key),
		clear: () => sessionStorage._storage.clear()
	};

	beforeEach(() => {
		window = new Window();

		spyOn(window, 'getWindow').and.returnValue({ sessionStorage });

		session = new SessionStorage(window);

		session.init();
		session.clear();
	});

	afterEach(() => {
		session.clear();
	});

	it('should set and get items', () => {
		session.set('item1', 1);
		expect(session.get('item1')).toEqual(1);

		session.set('item2', 'test');
		expect(session.get('item2')).toEqual('test');

		session.set('item3', false);
		expect(session.get('item3')).toEqual(false);

		let obj = { testedProp: 'testedValue' };
		session.set('item4', obj);
		expect(session.get('item4')).toEqual(obj);

		let arr = [0, 'val', true, {}];
		session.set('item5', arr);
		expect(session.get('item5')).toEqual(arr);
	});

	it('should should have (not) an item', () => {
		expect(session.has('item1')).toBeFalsy();
		session.set('item1', 1);
		expect(session.has('item1')).toBeTruthy();
	});

	it('should clear all items', () => {
		session
			.set('item1', 1)
			.set('item2', 'test')
			.set('item3', false)
			.clear();

		expect(session.has('item1')).toBeFalsy();
		expect(session.has('item2')).toBeFalsy();
		expect(session.has('item3')).toBeFalsy();
	});

	it('should delete selected items only', () => {
		session
			.set('item1', 1)
			.set('item2', 'test')
			.set('item3', false)
			.delete('item1')
			.delete('item3');

		expect(session.has('item1')).toBeFalsy();
		expect(session.has('item2')).toBeTruthy();
		expect(session.has('item3')).toBeFalsy();
	});
});
