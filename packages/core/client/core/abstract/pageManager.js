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
	 * Initializes the page manager.
	 *
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
		 * @property _managedPage
		 * @type {Object<string, *>}
		 */
		this._managedPage = {};
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method init
	 */
	init() {
		this._clearManagedPageValue();
		this._stateManager.onChange = (newState) => {
			this._onChangeStateHandler(newState);
		};
	}

	/**
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
			return this._updateController(params);
		}

		var controllerInstance;
		controllerInstance = this._pageFactory.createController(controller);
		var decoratedController = this._pageFactory.decorateController(
			controllerInstance
		);
		var viewInstance = this._pageFactory.createView(view);

		this._deactivateController();
		this._destroyController();

		this._storeManagedPageValue(
			controller,
			view,
			options,
			params,
			controllerInstance,
			decoratedController,
			viewInstance
		);

		this._initController(params);

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
	 * @abstract
	 * @inheritDoc
	 * @override
	 * @method scrollTo
	 * @param {number} [x=0]
	 * @param {number} [y=0]
	 */
	scrollTo(x = 0, y = 0) {
		throw new IMAError('The scrollTo() method is abstract and must be ' +
				'overridden.');
	}

	/**
	 * @protected
	 * @method _storeManagedPageValue
	 * @param {(string|function)} controller
	 * @param {(string|function)} view
	 * @param {{onlyUpdate: boolean}} options
	 * @param {Object<string, string>} params The route parameters.
	 * @param {Core.Abstract.Controller} controllerInstance
	 * @param {Core.Decorator.Controller} decoratedController
	 * @param {Vendor.React.Component} viewInstance
	 */
	_storeManagedPageValue(controller, view, options, params,
			controllerInstance, decoratedController, viewInstance) {
		this._managedPage = {
			controller,
			controllerInstance,
			decoratedController,
			view,
			viewInstance,
			options,
			params,
			state: {
				activated: false
			}
		};
	}

	/**
	 * Clear value from managed page.
	 *
	 * @protected
	 * @method _clearManagedPageValue
	 */
	_clearManagedPageValue() {
		this._managedPage = {
			controller: null,
			controllerInstance: null,
			decoratedController: null,
			view: null,
			viewInstance: null,
			options: null,
			params: null,
			state: {
				activated: false
			}
		};
	}

	/**
	 * Initializes managed instance of controller with the provided parameters.
	 *
	 * @protected
	 * @method _initController
	 * @param {Object<string, *>=} params Parameters to use to initialize
	 *        the controller.
	 */
	_initController(params) {
		var controller = this._managedPage.controllerInstance;

		controller.setRouteParams(params);
		controller.setStateManager(this._stateManager);
		controller.init();
	}

	/**
	 * Activate managed instance of controller.
	 *
	 * @protected
	 * @method _activateController
	 */
	_activateController() {
		var controller = this._managedPage.controllerInstance;
		var isNotActivated = !this._managedPage.state.activated;

		if (controller && isNotActivated) {
			controller.activate();
			this._managedPage.state.activated = true;
		}
	}

	/**
	 * Update current page controller.
	 *
	 * @protected
	 * @method _updateController
	 * @param {Object<string, *>=} params Parameters to use to update
	 *        the controller.
	 * @return {Promise}
	 */
	_updateController(params) {
		var controller = this._managedPage.decoratedController;
		var lastRouteParams = controller.getRouteParams();

		this._managedPage.params = params;
		controller.setRouteParams(params);

		return (
			this._pageRender
				.update(controller, lastRouteParams)
				.then((response) => {
					this._postManage(this._managedPage.options);

					return response;
				})
		);
	}

	/**
	 * Deactivate last managed instance of controller only If controller
	 * was activated.
	 *
	 * @protected
	 * @method _deactivateController
	 */
	_deactivateController() {
		var controller = this._managedPage.controllerInstance;
		var isActivated = this._managedPage.state.activated;

		if (controller && isActivated) {
			controller.deactivate();
		}
	}

	/**
	 * Destroy last managed instance of controller.
	 *
	 * @protected
	 * @method _destroyController
	 */
	_destroyController() {
		var controller = this._managedPage.controllerInstance;

		if (controller) {
			controller.destroy();
			controller.setStateManager(null);
			this._stateManager.clear();
			this._pageRender.unmount();
			this._clearManagedPageValue();
		}
	}

	/**
	 * On change event handler set state to view.
	 *
	 * @private
	 * @method _onChangeStateHandler
	 * @param {Object<string, *>} state
	 */
	_onChangeStateHandler(state) {
		var controller = this._managedPage.controllerInstance;

		if (controller) {
			this._pageRender.setState(state);
		}
	}

	/**
	 * Return true if manager has to update last managed controller and view.
	 *
	 * @protected
	 * @method _hasOnlyUpdate
	 * @param {string|function} controller
	 * @param {string|function} view
	 * @param {{onlyUpdate: (boolean|function), autoScroll: boolean}} options
	 * @return {boolean}
	 */
	_hasOnlyUpdate(controller, view, options) {
		if (options.onlyUpdate instanceof Function) {
			return options.onlyUpdate(
				this._managedPage.controller,
				this._managedPage.view
			);
		}

		return options.onlyUpdate &&
			this._managedPage.controller === controller &&
			this._managedPage.view === view;
	}

	/**
	 * Make defined instruction as scroll for current page options before than
	 * change page.
	 *
	 * @protected
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
	 * @protected
	 * @method _postManage
	 * @param {{onlyUpdate: boolean, autoScroll: boolean}} options
	 */
	_postManage(options) {}

}

ns.Core.Abstract.PageManager = PageManager;
