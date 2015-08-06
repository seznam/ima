import ns from 'imajs/client/core/namespace.js';

ns.namespace('App.Page.NotFound');

/**
 * @class Controller
 * @extends Core.Abstract.Controller
 * @namespace App.Page.NotFound
 * @module App
 * @submodule App.Page
 * */
class Controller extends ns.App.Base.Controller {

	/**
	 * @method constructor
	 * @constructor
	 * */
	constructor() {
		super();
		this._status = 404;
	}

	/**
	 * Load all needed data.
	 *
	 * @method load
	 * @return {Object} object of promise
	 * */
	load() {
		return {
			status: this._status
		};
	}
}

ns.App.Page.NotFound.Controller = Controller;
