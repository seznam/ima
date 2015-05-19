import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core.Page');

/**
 * Page manager for controller.
 *
 * @class Manager
 * @implements Core.Interface.PageManager
 * @namespace Core.Page
 * @module Core
 * @submodule Core.Page
 */
class Manager extends ns.Core.Interface.PageManager {

	/**
	 * @method constructor
	 * @constructor
	 * @param {Core.Page.Factory} pageFactory
	 * @param {Core.Interface.PageRender} pageRender
	 * @param {Core.Interface.PageStateManager} stateManager
	 * @param {Core.Interface.Window} window
	 */
	constructor(pageFactory, pageRender, stateManager, window) {
		super();

		/**
		 * @property _pageFactory
		 * @private
		 * @type {Core.Page.Factory}
		 * @default pageFactory
		 */
		this._pageFactory = pageFactory;

		/**
		 * @property _pageRender
		 * @private
		 * @type {Core.Abstract.PageRender}
		 * @default pageRender
		 */
		this._pageRender = pageRender;

		/**
		 * @property _stateManager
		 * @private
		 * @type {Core.Interface.PageStateManager}
		 * @default stateManager
		 */
		this._stateManager = stateManager;

		/**
		 * @property _window
		 * @private
		 * @type {Core.Interface.Window}
		 * @default window
		 */
		this._window = window;

		/**
		 * @property _activeController
		 * @private
		 * @type {Core.Abstract.Controller}
		 * @default null
		 */
		this._activeController = null;
	}

	/**
	 * Manager controller with params.
	 *
	 * @method run
	 * @param {string} controller
	 * @param {string} view
	 * @param {Object<string, string>=} [params={}] The route parameters.
	 * @return {Promise}
	 */
	manage(controller, view, params = {}) {
		var controllerInstance = this._pageFactory.createController(controller);
		var decoratedController = this._pageFactory.decorateController(controllerInstance);
		var viewInstance = this._pageFactory.createView(view);

		this._destroyActiveController();
		this._initController(controllerInstance, params);

		return this._pageRender.mount(decoratedController, viewInstance);
	}

	/**
	 * Initialization manager.
	 *
	 * @method init
	 */
	init() {
		this._activeController = null;
		this._stateManager.onChange = (newState) => this._onChangeStateHandler(newState);
	}

	/**
	 * Initializes the provided controller using the provided parameters.
	 *
	 * @method _initController
	 * @private
	 * @param {Core.Abstract.Controller} controller The controller to initialize.
	 * @param {Object<string, *>=} params Parameters to use to initialize
	 *        the controller.
	 */
	_initController(controller, params) {
		controller.setRouteParams(params);
		controller.setStateManager(this._stateManager);
		controller.init();
		this._activeController = controller;
	}

	/**
	 * Destroy active controller.
	 *
	 * @method _destroyActiveController
	 * @private
	 */
	_destroyActiveController() {
		if (this._activeController) {
			this._activeController.destroy();
			this._activeController.setStateManager(null);
			this._pageRender.unmount();
			this._activeController = null;
		}
	}

	/**
	 * On change handler for state.
	 *
	 * @method _onChangeStateHandler
	 * @private
	 */
	_onChangeStateHandler(state) {
		if (this._activeController) {
			this._pageRender.setState(state);
		}
	}


}

ns.Core.Page.Manager = Manager;
