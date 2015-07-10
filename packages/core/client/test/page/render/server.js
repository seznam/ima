describe('Core.Page.Render.Server', function() {

	var param1 = 'param1';
	var param2 = 'param2';
	var params = {
		param1: param1,
		param2: Promise.resolve(param2)
	};

	var controller = ns.Core.Interface.Controller;
	var view = function (){};

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
		spyOn(Promise, 'resolve')
			.and
			.callThrough();

		pageRender._wrapEachKeyToPromise(params);

		expect(Promise.resolve).toHaveBeenCalledWith(param1);
		expect(Promise.resolve.calls.count()).toEqual(1);
	 });

	describe('update method', function() {

		it('should call mount method', function() {
			spyOn(pageRender, 'mount')
				.and
				.stub();

			pageRender.update(controller, params);

			expect(pageRender.mount).toHaveBeenCalledWith(controller, params);
		});

	});

});
