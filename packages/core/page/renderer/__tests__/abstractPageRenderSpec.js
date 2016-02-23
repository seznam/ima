describe('ima.page.renderer.AbstractPageRenderer', function() {

	var pageRenderer = null;
	var rendererFactory = oc.get('$PageRendererFactory');
	var $Helper = oc.get('$Helper');
	var ReactDOM = oc.get('$ReactDOM');
	var settings = oc.get('$Settings');

	var reactiveComponentView = {
		setState: function() {},
		replaceState: function() {}
	};

	var view = function() {};

	beforeEach(function() {
		pageRenderer = oc.create('ima.page.renderer.AbstractPageRenderer', [rendererFactory, $Helper, ReactDOM, settings]);

		pageRenderer._reactiveView = reactiveComponentView;
	});

	it('should be throw error for mounting component', function() {
		expect(function() {
			pageRenderer.mount();
		}).toThrow();
	});

	it('should be throw error for updating component', function() {
		expect(function() {
			pageRenderer.update();
		}).toThrow();
	});

	it('should be throw error for unmounting component', function() {
		expect(function() {
			pageRenderer.unmount();
		}).toThrow();
	});

	describe('setState method', function() {

		it('should be set new state to reactive component view', function() {
			var state = { state: 'state' };

			spyOn(reactiveComponentView, 'setState')
				.and
				.stub();

			pageRenderer.setState(state);

			expect(reactiveComponentView.setState).toHaveBeenCalledWith(state);
		});

	});

	describe('_generateViewProps method', function() {

		it('should be set $Utils to props', function() {
			var utils = { router: 'router' };

			spyOn(rendererFactory, 'getUtils')
				.and
				.returnValue(utils);

			expect(pageRenderer._generateViewProps(view)).toEqual({ '$Utils': utils, view: view, state: {} });
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

		pageRenderer._wrapEachKeyToPromise(dataMap);

		expect(Promise.resolve).toHaveBeenCalledWith(param1);
		expect(Promise.resolve.calls.count()).toEqual(1);
	});*/

});
