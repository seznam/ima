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
	 * @param {Core.Interface.PageRender} pageRender
	 * @param {Core.Interface.Window} window
	 */
	constructor(pageRender, window) {
		super();

		/**
		 * @property _pageRender
		 * @type {Core.Abstract.PageRender}
		 * @default pageRender
		 */
		this._pageRender = pageRender;

		/**
		 * @property _window
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
	 * @param {Core.Abstract.Controller} controller The page controller that
	 *        should have its view rendered.
	 * @param {Object<string, string>=} [params={}] The route parameters.
	 * @return {Promise}
	 */
	manage(controller, params = {}) {
		if (!controller) {
			throw new CoreError(`Core.PageManager.Controller.manage(): The ` +
			`controller parameter is required`);
		}

		this._deinitActiveController();
		this._initController(controller, params);

		return this._pageRender.render(controller);
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
		controller.init();
		this._activeController = controller;
	}

	/**
	 * Deinitializes active controller.
	 *
	 * @method _deinitActiveController
	 * @private
	 */
	_deinitActiveController() {
		if (this._activeController) {
			this._activeController.deinit();
			this._activeController = null;
		}
	}


}

ns.Core.Page.Manager = Manager;