describe('Core.Page.Render.Server', function() {

	var pageRender = null;
	var $Helper = ns.Vendor.$Helper;
	var React = oc.get('$React');
	var settings = oc.get('$Settings');
	var response = oc.get('$Response');
	var cache = oc.get('$Cache');

	beforeEach(function() {
		pageRender = oc.create('Core.Page.Render.Server', [$Helper, React, settings, response, cache]);
	});

	it('should be wrap each key to promise', function() {
		 var param1 = 'param1';
		 var dataMap = {
			 param1: param1,
			 param2: Promise.resolve('param2')
		 };

		spyOn(Promise, 'resolve')
			.and
			.callThrough();

		pageRender._wrapEachKeyToPromise(dataMap);

		expect(Promise.resolve).toHaveBeenCalledWith(param1);
		expect(Promise.resolve.calls.count()).toEqual(1);
	 });
});
