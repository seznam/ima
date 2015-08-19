import ns from 'imajs/client/core/namespace';

ns.namespace('Core.Abstract');

/**
 * Page manager for controller.
 *
 * @class PageManager
 * @implements Core.Interface.PageManager
 * @namespace Core.Abstract
 * @module Core
 * @submodule Core.Abstract
 */
export default class PageManager extends ns.Core.Interface.PageManager {

	/**
	 * @method constructor
	 * @constructor
	 * @param {Core.Page.Factory} pageFactory
	 * @param {Core.Interface.PageRender} pageRender
	 * @param {Core.Interface.PageStateManager} stateManager
	 */
	constructor(pageFactory, pageRender, stateManager) {
		super();

		/**
		 * @protected
		 * @property _pageFactory
		 * @type {Core.Page.Factory}
		 * @default pageFactory
		 */
		this._pageFactory = pageFactory;

		/**
		 * @protected
		 * @property _pageRender
		 * @type {Core.Abstract.PageRender}
		 * @default pageRender
		 */
		this._pageRender = pageRender;

		/**
		 * @protected
		 * @property _stateManager
		 * @type {Core.Interface.PageStateManager}
		 * @default stateManager
		 */
		this._stateManager = stateManager;

		/**
		 * @protected
		 * @property _lastManagedPage
		 * @type {Object<string, *>}
		 */
		this._lastManagedPage = {};
	}

	/**
	 * Initialization manager.
	 *
	 * @inheritDoc
	 * @override
	 * @method init
	 */
	init() {
		this._clearLastManagedPage();
		this._stateManager.onChange = (newState) => this._onChangeStateHandler(newState);
	}

	/**
	 * Manager controller with params.
	 *
	 * @inheritDoc
	 * @override
	 * @method manage
	 * @param {(string|function)} controller
	 * @param {(string|function)} view
	 * @param {{onlyUpdate: (boolean|function), autoScroll: boolean}} options
	 * @param {Object<string, string>=} [params={}] The route parameters.
	 * @return {Promise<Object<string, ?(number|string)>>}
	 */
	manage(controller, view, options, params = {}) {
		this._preManage(options);

		if (this._hasOnlyUpdate(controller, view, options)) {
			return this._updateController(this._lastManagedPage.decoratedController, params);
		}

		var controllerInstance = this._pageFactory.createController(controller);
		var decoratedController = this._pageFactory.decorateController(controllerInstance);
		var viewInstance = this._pageFactory.createView(view);

		this._destroyController(this._lastManagedPage.controllerInstance);
		this._initController(controllerInstance, params);
		this._storeLastManagedPage(controller, view, options, params, controllerInstance,
			decoratedController, viewInstance);

		return (
			this._pageRender
				.mount(decoratedController, viewInstance)
				.then((response) => {
					this._postManage(options);

					return response;
				})
		);
	}

	/**
	 * Scroll page to defined vertical and horizontal values.
	 *
	 * Scrolling is async.
	 *
	 * @abstract
	 * @inheritDoc
	 * @override
	 * @method scrollTo
	 * @param {number} [x=0] x is the pixel along the horizontal axis of the document
	 * @param {number} [y=0] y is the pixel along the vertical axis of the document
	 */
	scrollTo(x = 0, y = 0) {
		throw new IMAError('The scrollTo() method is abstract and must be overridden.');
	}

	/**
	 * Store value from last managed page for next managing process.
	 *
	 * @protected
	 * @method _storeLastManagedPage
	 * @param {(string|function)} controller
	 * @param {(string|function)} view
	 * @param {{onlyUpdate: boolean}} options
	 * @param {Object<string, string>} params The route parameters.
	 * @param {Core.Abstract.Controller} controllerInstance
	 * @param {Core.Decorator.Controller} decoratedController
	 * @param {Vendor.React.Component} viewInstance
	 */
	_storeLastManagedPage(controller, view, options, params, controllerInstance, decoratedController, viewInstance) {
		this._lastManagedPage = {
			controller,
			controllerInstance,
			decoratedController,
			view,
			viewInstance,
			options,
			params
		};
	}

	/**
	 * Clear value from last managed page.
	 *
	 * @protected
	 * @method _clearLastManagedPage
	 */
	_clearLastManagedPage() {
		this._lastManagedPage = {
			controller: null,
			controllerInstance: null,
			decoratedController: null,
			view: null,
			viewInstance: null,
			options: null,
			params: null
		};
	}

	/**
	 * Initializes the provided controller using the provided parameters.
	 *
	 * @private
	 * @method _initController
	 * @param {Core.Abstract.Controller} controller The controller to initialize.
	 * @param {Object<string, *>=} params Parameters to use to initialize
	 *        the controller.
	 */
	_initController(controller, params) {
		controller.setRouteParams(params);
		controller.setStateManager(this._stateManager);
		controller.init();
	}

	/**
	 * Update current page controller.
	 *
	 * @private
	 * @method _updateController
	 * @param {Core.Decorator.Controller} controller The controller to update.
	 * @param {Object<string, *>=} params Parameters to use to update
	 *        the controller.
	 * @return {Promise}
	 */
	_updateController(controller, params) {
		var lastRouteParams = controller.getRouteParams();

		this._lastManagedPage.params = params;
		controller.setRouteParams(params);

		return (
			this._pageRender
				.update(controller, lastRouteParams)
				.then((response) => {
					this._postManage(this._lastManagedPage.options);

					return response;
				})
		);
	}

	/**
	 * Destroy current page controller.
	 *
	 * @private
	 * @method _destroyController
	 * @param {Core.Abstract.Controller} controller The controller to deinitialize.
	 */
	_destroyController(controller) {
		if (controller) {
			controller.destroy();
			controller.setStateManager(null);
			this._pageRender.unmount();
			this._clearLastManagedPage();
		}
	}

	/**
	 * On change handler for state.
	 *
	 * @private
	 * @method _onChangeStateHandler
	 */
	_onChangeStateHandler(state) {
		if (this._lastManagedPage.controllerInstance) {
			this._pageRender.setState(state);
		}
	}

	/**
	 * Return true if manager has to update last managed controller and view.
	 *
	 * @private
	 * @method _hasOnlyUpdate
	 * @param {string|function} controller
	 * @param {string|function} view
	 * @param {{onlyUpdate: (boolean|function), autoScroll: boolean}} options
	 * @return {boolean}
	 */
	_hasOnlyUpdate(controller, view, options) {
		if (options.onlyUpdate instanceof Function) {
			return options.onlyUpdate(
				this._lastManagedPage.controller,
				this._lastManagedPage.view
			);
		}

		return options.onlyUpdate &&
			this._lastManagedPage.controller === controller &&
			this._lastManagedPage.view === view;
	}

	/**
	 * Make defined instruction as scroll for current page options before than
	 * change page.
	 *
	 * @private
	 * @method _preManage
	 * @param {{onlyUpdate: boolean, autoScroll: boolean}} options
	 */
	_preManage(options) {
		if (options.autoScroll) {
			this.scrollTo();
		}
	}

	/**
	 * Make defined instruction for current page options after that
	 * changed page.
	 *
	 * @private
	 * @method _postManage
	 * @param {{onlyUpdate: boolean, autoScroll: boolean}} options
	 */
	_postManage(options) {}

}

ns.Core.Abstract.PageManager = PageManager;
