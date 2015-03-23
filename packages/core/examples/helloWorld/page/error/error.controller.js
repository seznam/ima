import ns from 'core/namespace/ns.js';

ns.namespace('App.Page.Error');

/**
 * @class Controller
 * @extends Core.Abstract.Controller
 * @namespace App.Page.Error
 * @module App
 * @submodule App.Page
 */
class Controller extends ns.Core.Abstract.Controller {

	/**
	 * @method constructor
	 * @constructor
	 * @param {App.Page.Error.View} view
	 * @param {Vendor.Rsvp.Promise} Promise
	 */
	constructor(view, Promise) {
		super(view);
		this._status = 500;

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
	 */
	load() {
		return {
			status: this._Promise.resolve(this._status),
			error: this._Promise.resolve(this.params)
		};
	}
}

ns.App.Page.Error.Controller = Controller;