import ns from 'imajs/client/core/namespace';

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

		this.status = 500;
	}

	/**
	 * @method load
	 * @return {Object}
	 */
	load() {
		return {
			status: this.status,
			error: this.params
		};
	}
}

ns.App.Page.Error.Controller = Controller;
