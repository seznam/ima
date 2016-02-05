import ns from 'imajs/client/core/namespace';

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
	 */
	constructor() {
		super();

		this.status = 404;
	}

	/**
	 * @method load
	 * @return {Object}
	 */
	load() {
		return {
			status: this.status
		};
	}
}

ns.App.Page.NotFound.Controller = Controller;
