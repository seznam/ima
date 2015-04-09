import ns from 'core/namespace/ns.js';

ns.namespace('App.Page.NotFound');

/**
 * @class Controller
 * @extends App.Base.Controller
 * @namespace App.Page.NotFound
 * @module App
 * @submodule App.Page
 */
class Controller extends ns.App.Base.Controller {

	/**
	 * @method constructor
	 * @constructor
	 * @param {App.Page.NotFound.View} view
	 */
	constructor(view) {
		super(view);

		this._status = 404;
	}

	/**
	 * Load all needed data.
	 *
	 * @method load
	 * @return {Object} object of promise
	 */
	load() {
		return {
			status: this._status
		};
	}
}

ns.App.Page.NotFound.Controller = Controller;