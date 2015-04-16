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
	 * Manage controller with params
	 *
	 * @method manage
	 * @param {Core.Abstract.Controller} controller
	 * @param {Object<string, *>=} params Parameters to use to initialize
	 *        the controller.
	 * @return {Promise}
	 */
	manage(controller, params = {}) {}
}

ns.Core.Interface.PageManager = PageManager;