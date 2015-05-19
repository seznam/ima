describe('Core.Storage.SessionMap', function() {
	var sessionMap;
	beforeEach(function() {
		sessionMap = oc.create('$SessionMapStorage');
		sessionMap.init();
		sessionMap.clear();

	});
	afterEach(function() {
		sessionMap.clear();
	});

	it('should set and get items', function() {
		sessionMap.set('item1', 1);
		expect(sessionMap.get('item1')).toEqual(1);
		sessionMap.set('item2', 'test');
		expect(sessionMap.get('item2')).toEqual('test');
		sessionMap.set('item3', false);
		expect(sessionMap.get('item3')).toEqual(false);
		var obj = {testedProp: 'testedValue'};
		sessionMap.set('item4', obj);
		expect(sessionMap.get('item4')).toEqual(obj);
		var arr = [0, 'val', true, {}];
		sessionMap.set('item5', arr);
		expect(sessionMap.get('item5')).toEqual(arr);
	});

	it ('should should have (not) an item', function() {
		expect(sessionMap.has('item1')).toBeFalsy();
		sessionMap.set('item1', 1);
		expect(sessionMap.has('item1')).toBeTruthy();
	});

	it('should clear all items', function() {
		sessionMap
			.set('item1', 1)
			.set('item2', 'test')
			.set('item3', false)
			.clear();

		expect(sessionMap.has('item1')).toBeFalsy();
		expect(sessionMap.has('item2')).toBeFalsy();
		expect(sessionMap.has('item3')).toBeFalsy();
	});

	it('should delete selected items only', function() {
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

	it('should return keys', function() {
		sessionMap
			.set('item1', 1)
			.set('item2', 'test')
			.set('item3', false);

		var index = 0;
		for (var key of sessionMap.keys()) {
			switch (index++) {
				case 0:
					expect(key).toEqual('item1');
					break;
				case 1:
					expect(key).toEqual('item2');
					break;
				default:
					expect(key).toEqual('item3');
					break;
			}
		}
	});
});