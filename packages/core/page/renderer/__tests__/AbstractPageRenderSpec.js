describe('ima.page.renderer.AbstractPageRenderer', function() {

	var pageRenderer = null;
	var rendererFactory = oc.get('$PageRendererFactory');
	var $Helper = oc.get('$Helper');
	var ReactDOM = oc.get('$ReactDOM');
	var settings = oc.get('$Settings');

	var reactiveComponentView = {
		state: {
			key1: 1,
			key2: 'string'
		},
		setState: function() {},
		replaceState: function() {}
	};

	var controller = new ns.ima.controller.Controller();
	var view = function() {};

	var routeOptions = {
		onlyUpdate: false,
		autoScroll: false,
		allowSPA: false,
		documentView: null
	};

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

	describe('clearState method', function() {

		it('should be set clear state to reactevie component view', function() {
			spyOn(reactiveComponentView, 'setState')
				.and
				.stub();

			pageRenderer.clearState();

			expect(reactiveComponentView.setState)
				.toHaveBeenCalledWith({
					key1: undefined,
					key2: undefined
				});
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

	describe('_getWrappedPageView method', function() {

		var utils = { $Utils: 'utils' };
		var state = { state: 'state', $pageView: view };
		var propsView = { view: view };
		var props = Object.assign({}, state, utils, propsView);
		var wrapedPageViewElement = { wrapElementView: 'wrapedPageViewElement' };
		var managedRootView = function() {};

		beforeEach(function() {
			spyOn(pageRenderer, '_generateViewProps')
				.and
				.returnValue(props);
			spyOn(controller, 'getState')
				.and
				.returnValue(state);
			spyOn(rendererFactory, 'wrapView')
				.and
				.returnValue(wrapedPageViewElement);
			spyOn(rendererFactory, 'getManagedRootView')
				.and
				.returnValue(managedRootView);
		});

		it('should generate view props from controller state', function() {
			pageRenderer._getWrappedPageView(controller, view, routeOptions);

			expect(pageRenderer._generateViewProps).toHaveBeenCalledWith(managedRootView, state);
		});

		it('should return React Component for managedRootView from route options managedRootView property', function() {
			var routeOptionsWithManagedRouteView = Object.assign({}, routeOptions, { managedRootView: ns.ima.page.renderer.BlankManagedRootView });
			pageRenderer._getWrappedPageView(controller, view, routeOptionsWithManagedRouteView);

			expect(rendererFactory.getManagedRootView).toHaveBeenCalledWith(ns.ima.page.renderer.BlankManagedRootView);
		});

		it('should call wrapView with default ViewAdapter', function() {
			pageRenderer._getWrappedPageView(controller, view, routeOptions);

			expect(rendererFactory.wrapView).toHaveBeenCalledWith(ns.ima.page.renderer.ViewAdapter, props);
		});
	});

	describe('_getDocumentView method', function() {

		beforeEach(function() {
			spyOn(rendererFactory, 'getDocumentView')
				.and
				.stub();
		});

		it('should return default document view which is set in settings.$Page.$Render.documentView', function() {
			pageRenderer._getDocumentView(routeOptions);

			expect(rendererFactory.getDocumentView).toHaveBeenCalledWith(settings.$Page.$Render.documentView);
		});

		it('should return document view which is defined in routeOptions.documentView', function() {
			var routeOptionsWithDocumentView = Object.assign({}, routeOptions, { documentView: ns.ima.page.AbstractDocumentView });
			pageRenderer._getDocumentView(routeOptionsWithDocumentView);

			expect(rendererFactory.getDocumentView).toHaveBeenCalledWith(ns.ima.page.AbstractDocumentView);
		});

	});

});
