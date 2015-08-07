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
export default class PageManager {

	/**
	 * Initialization manager.
	 *
	 * @method init
	 */
	init() {}

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
	manage(controller, view, options, params = {}) {}

	/**
	 * Scroll page to defined vertical and horizontal values.
	 *
	 * @method scrollTo
	 * @param {number} [x=0] x is the pixel along the horizontal axis of the document
	 * @param {number} [y=0] y is the pixel along the vertical axis of the document
	 */
	scrollTo(x = 0, y = 0) {}
}

ns.Core.Interface.PageManager = PageManager;
