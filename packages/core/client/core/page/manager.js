import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core.PageManager');

/**
 * Page manager for controller.
 *
 * @class Controller
 * @namespace Core.PageManager
 * @module Core
 * @submodule Core.PageManager
 */
class Controller {

	/**
	 * @method constructor
	 * @constructor
	 */
	constructor() {

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
	 * Run controller.
	 *
	 * @method run
	 * @param {Core.Abstract.Controller} controller The page controller that
	 *        should have its view rendered.
	 * @param {Object<string, string>=} [params={}] The route parameters.
	 */
	run(controller, params = {}) {
		if (!controller) {
			throw new CoreError(`Core.PageManager.Controller.run(): The ` +
			`controller parameter is required`);
		}

		this._deinitActiveController();
		this._initController(controller);

		this._pageRender.render(controller);
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
		controller.setParams(params);
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

ns.Core.PageManager.Controller = Controller;