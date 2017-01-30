jest.mock('page/renderer/PageRendererFactory');

import Helper from 'ima-helpers';
import ReactDOM from 'react-dom';
import Controller from 'controller/Controller';
import AbstractDocumentView from 'page/AbstractDocumentView';
import AbstractPageRenderer from 'page/renderer/AbstractPageRenderer';
import BlankManagedRootView from 'page/renderer/BlankManagedRootView';
import RendererFactory from 'page/renderer/PageRendererFactory';
import ViewAdapter from 'page/renderer/ViewAdapter';

describe('ima.page.renderer.AbstractPageRenderer', function() {

	let pageRenderer = null;
	let rendererFactory = null;
	let settings = {
		$Page: {
			$Render: {
				scripts: [],
				documentView: 'app.component.document.DocumentView'
			}
		}
	};

	let reactiveComponentView = {
		state: {
			key1: 1,
			key2: 'string'
		},
		setState: function() {},
		replaceState: function() {}
	};

	let controller = new Controller();
	let view = function() {};

	let routeOptions = {
		onlyUpdate: false,
		autoScroll: false,
		allowSPA: false,
		documentView: null
	};

	beforeEach(function() {
		rendererFactory = new RendererFactory();
		pageRenderer = new AbstractPageRenderer(rendererFactory, Helper, ReactDOM, settings);

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
			let state = { state: 'state' };

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
			let utils = { router: 'router' };

			spyOn(rendererFactory, 'getUtils')
				.and
				.returnValue(utils);

			expect(pageRenderer._generateViewProps(view)).toEqual({ '$Utils': utils, view: view, state: {} });
		});
	});

	describe('_getWrappedPageView method', function() {

		let utils = { $Utils: 'utils' };
		let state = { state: 'state', $pageView: view };
		let propsView = { view: view };
		let props = Object.assign({}, state, utils, propsView);
		let wrapedPageViewElement = { wrapElementView: 'wrapedPageViewElement' };
		let managedRootView = function() {};

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
			let routeOptionsWithManagedRouteView = Object.assign({}, routeOptions, { managedRootView: BlankManagedRootView });
			pageRenderer._getWrappedPageView(controller, view, routeOptionsWithManagedRouteView);

			expect(rendererFactory.getManagedRootView).toHaveBeenCalledWith(BlankManagedRootView);
		});

		it('should call wrapView with default ViewAdapter', function() {
			pageRenderer._getWrappedPageView(controller, view, routeOptions);

			expect(rendererFactory.wrapView).toHaveBeenCalledWith(ViewAdapter, props);
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
			let routeOptionsWithDocumentView = Object.assign({}, routeOptions, { documentView: AbstractDocumentView });
			pageRenderer._getDocumentView(routeOptionsWithDocumentView);

			expect(rendererFactory.getDocumentView).toHaveBeenCalledWith(AbstractDocumentView);
		});

	});

});
