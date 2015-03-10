import ns from 'core/namespace/ns.js';

ns.namespace('App.Page.NotFound');

/**
 * @class Controller
 * @extends Core.Abstract.Controller
 * @namespace App.Page.NotFound
 * @module App
 * @submodule App.Page
 * */
class Controller extends ns.Core.Abstract.Controller {

	/**
	 * @method constructor
	 * @constructor
	 * @param {App.Page.NotFound.View} view
	 * @param {Vendor.Rsvp.Promise} promise
	 * */
	constructor(view, promise) {
		super(view);
		this._status = 404;

		/**
		 * Promise Vendor
		 *
		 * @property _promise
		 * @type {Vendor.Rsvp.Promise}
		 */
		this._promise = promise;
	}

	/**
	 * Load all needed data.
	 *
	 * @method load
	 * @return {Object} object of promise
	 * */
	load() {
		return {
			status: this._promise.resolve(this._status)
		};
	}
}

ns.App.Page.NotFound.Controller = Controller;