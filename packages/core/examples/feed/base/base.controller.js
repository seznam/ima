import ns from 'core/namespace/ns.js';

ns.namespace('App.Base');

/**
 * Base controller for App.
 *
 * @class Controller
 * @extends Core.Abstract.Controller
 * @namespace App.Base
 * @module App
 * @submodule App.Base
 */
class Controller extends ns.Core.Abstract.Controller {
	/**
	 * Initializes the base controller.
	 *
	 * @method constructor
	 * @param {*} view The React component representing the current view.
	 * @param {Core.Dictionary.Handler} dictionary The dictionary provider.
	 */
	constructor(view, dictionary) {
		super(view);

		/**
		 * @property _dictionary
		 * @protected
		 * @type {Core.Dictionary.Handler}
		 */
		this._dictionary = dictionary;
	}

	/**
	 * Set SEO params.
	 *
	 * @method setSeoParams
	 */
	setSeoParams() {
		this._seo.set('title', this._dictionary.get('home.seoTitle'));
		this._seo.set('description', this._dictionary.get('home.seoDescription'));
		this._seo.set('type', 'website');
		this._seo.set('image', this._dictionary.get('home.seoImage'));
		this._seo.set('url', this._dictionary.get('home.seoUrl'));
	}
}

ns.App.Base.Controller = Controller;