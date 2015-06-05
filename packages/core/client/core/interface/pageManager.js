import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core.Interface');

/**
 * The page manager is a utility for managing rendered controller.
 *
 * @interface PageManager
 * @namespace Core.Interface
 * @module Core
 * @submodule Core.Interface
 */
class PageManager {

	/**
	 * Initialization manager.
	 *
	 * @method init
	 */
	init() {}

	/**
	 * Manage controller with params.
	 *
	 * @method manage
	 * @param {string|function} controller
	 * @param {string|function} view
	 * @param {{onlyUpdate: boolean}} options
	 * @param {Object<string, *>=} params Parameters to use to initialize
	 *        the controller.
	 * @return {Promise}
	 */
	manage(controller, view, options, params = {}) {}
}

ns.Core.Interface.PageManager = PageManager;
