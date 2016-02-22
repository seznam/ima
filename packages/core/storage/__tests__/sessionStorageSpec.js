describe('Ima.Storage.SessionStorage', function() {
	var session;

	beforeEach(function() {
		session = oc.create('Ima.Storage.SessionStorage');
		session.init();
		session.clear();
	});

	afterEach(function() {
		session.clear();
	});

	it('should set and get items', function() {
		session.set('item1', 1);
		expect(session.get('item1')).toEqual(1);
		session.set('item2', 'test');
		expect(session.get('item2')).toEqual('test');
		session.set('item3', false);
		expect(session.get('item3')).toEqual(false);
		var obj = {testedProp: 'testedValue'};
		session.set('item4', obj);
		expect(session.get('item4')).toEqual(obj);
		var arr = [0, 'val', true, {}];
		session.set('item5', arr);
		expect(session.get('item5')).toEqual(arr);
	});

	it ('should should have (not) an item', function() {
		expect(session.has('item1')).toBeFalsy();
		session.set('item1', 1);
		expect(session.has('item1')).toBeTruthy();
	});

	it('should clear all items', function() {
		session
			.set('item1', 1)
			.set('item2', 'test')
			.set('item3', false)
			.clear();

		expect(session.has('item1')).toBeFalsy();
		expect(session.has('item2')).toBeFalsy();
		expect(session.has('item3')).toBeFalsy();
	});

	it('should delete selected items only', function() {
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
