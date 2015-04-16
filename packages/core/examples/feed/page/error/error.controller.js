import ns from 'imajs/client/core/namespace.js';

ns.namespace('App.Page.Error');

/**
 * @class Controller
 * @extends Core.Abstract.Controller
 * @namespace App.Page.Error
 * @module App
 * @submodule App.Page
 * */
class Controller extends ns.App.Base.Controller {

	/**
	 * @method constructor
	 * @constructor
	 * @param {App.Page.Error.View} view
	 * @param {Vendor.Rsvp.Promise} promise
	 * */
	constructor(view, promise) {
		super(view);
		this._status = 500;

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

ns.App.Page.Error.Controller = Controller;