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
	 * @param {Vendor.Rsvp.Promise} promise
	 * */
	constructor(view, promise) {
		super(view);

		/**
		 * Promise Vendor
		 *
		 * @property _promise
		 * @private
		 * @type {Vendor.Rsvp.Promise}
		 * @default promise
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
			message: this._promise.resolve('This is IMA.js!')
		};
	}

}

ns.App.Page.Home.Controller = Controller;