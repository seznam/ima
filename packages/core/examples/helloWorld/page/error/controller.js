import ns from 'imajs/client/core/namespace.js';

ns.namespace('App.Page.Error');

/**
 * @class Controller
 * @extends App.Base.Controller
 * @namespace App.Page.Error
 * @module App
 * @submodule App.Page
 */
class Controller extends ns.App.Base.Controller {

	/**
	 * @method constructor
	 * @constructor
	 */
	constructor() {
		super();

		this._status = 500;
	}

	/**
	 * Load all needed data.
	 *
	 * @method load
	 * @return {Object} object of promise
	 */
	load() {
		return {
			status: this._status,
			error: this.params
		};
	}
}

ns.App.Page.Error.Controller = Controller;