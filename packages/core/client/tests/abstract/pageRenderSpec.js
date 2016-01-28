describe('Core.Abstract.PageRender', function() {

	var pageRender = null;
	var renderFactory = oc.get('$PageRenderFactory');
	var $Helper = ns.Vendor.$Helper;
	var ReactDOM = oc.get('$ReactDOM');
	var settings = oc.get('$Settings');

	var reactiveComponentView = {
		setState: function() {},
		replaceState: function() {}
	};

	beforeEach(function() {
		pageRender = oc.create('Core.Abstract.PageRender', [renderFactory, $Helper, ReactDOM, settings]);

		pageRender._reactiveView = reactiveComponentView;
	});

	it('should be throw error for mounting component', function() {
		expect(function() {
			pageRender.mount();
		}).toThrow();
	});

	it('should be throw error for updating component', function() {
		expect(function() {
			pageRender.update();
		}).toThrow();
	});

	it('should be throw error for unmounting component', function() {
		expect(function() {
			pageRender.unmount();
		}).toThrow();
	});

	describe('setState method', function() {

		it('should be set new state to reactive component view', function() {
			var state = { state: 'state' };

			spyOn(reactiveComponentView, 'setState')
				.and
				.stub();

			pageRender.setState(state);

			expect(reactiveComponentView.setState).toHaveBeenCalledWith(state);
		});

	});

	describe('_generateViewProps method', function() {

		it('should be set $Utils to state', function() {
			var utils = { router: 'router' };

			spyOn(renderFactory, 'getUtils')
				.and
				.returnValue(utils);

			expect(pageRender._generateViewProps()).toEqual({$Utils: utils});
		});
	});

	/*it('should be wrap each key to promise', function() {
		var param1 = 'param1'
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
	});*/

});
