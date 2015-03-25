import ns from 'core/namespace/ns.js';

ns.namespace('App.Page.Home');

/**
 * @class Controller
 * @extends Core.Abstract.Controller
 * @namespace App.Page.Home
 * @module App
 * @submodule App.Page
 */
class Controller extends ns.Core.Abstract.Controller {

	/**
	 * @method constructor
	 * @constructor
	 * @param {App.Page.Home.View} view
	 * @param {Core.Interface.Router} router
	 */
	constructor(view, router) {
		super(view);

		/**
		 * @property _router
		 * @private
		 * @type {Core.Interface.Router}
		 * @default router
		 */
		this._router = router;

	}

	/**
	 * Load all needed data.
	 *
	 * @method load
	 * @return {Object} object of promise
	 */
	load() {
		return {
			message: 'This is IMA.js!'
		};
	}

	/**
	 * Set seo params.
	 *
	 * @method setSeoParams
	 * @param {Object} resolvedPromises
	 * @param {Object} setting
	 */
	setSeoParams(resolvedPromises, setting) {
		var title = 'IMA.js example - Hello world';
		var description = resolvedPromises.message;
		var keywords = 'IMA.js';
		var ogType = 'website';

		this._seo.set('title', title);
		this._seo.set('description', description);
		this._seo.set('keywords', keywords);

		this._seo.set('og:title', title);
		this._seo.set('og:description', description);
		this._seo.set('og:type', ogType);
		this._seo.set('og:image', setting.$Static.image + 'imajs-share.png');
		this._seo.set('og:url', this._router.link('home', {}));
	}

}

ns.App.Page.Home.Controller = Controller;