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
	 */
	constructor(view, Promise) {
		super(view);

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