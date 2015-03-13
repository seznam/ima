import ns from 'core/namespace/ns.js';

ns.namespace('App.Page.Home');

/**
 * @class Controller
 * @extends Core.Abstract.Controller
 * @namespace App.Page.Home
 * @module App
 * @submodule App.Page
 * */
class Controller extends ns.Core.Abstract.Controller {

	/**
	 * @method constructor
	 * @constructor
	 * @param {App.Page.Home.View} view
	 * @param {Vendor.Rsvp.Promise} Promise
	 * */
	constructor(view, Promise) {
		super(view);

		/**
		 * Promise Vendor
		 *
		 * @property _Promise
		 * @private
		 * @type {Vendor.Rsvp.Promise}
		 * @default Promise
		 */
		this._Promise = Promise;
	}

	/**
	 * Load all needed data.
	 *
	 * @method load
	 * @return {Object} object of promise
	 * */
	load() {
		return {
			message: this._Promise.resolve('This is IMA.js!')
		};
	}

	/**
	 * Set seo params.
	 *
	 * @method setSeoParams
	 * @param {Object} resolvedPromises
	 * */
	setSeoParams(resolvedPromises) {
		this._seo.set('title', resolvedPromises.message);
	}

}

ns.App.Page.Home.Controller = Controller;