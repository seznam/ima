import ns from 'imajs/client/core/namespace';

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
	 * */
	constructor() {
		super();
		this.status = 500;
	}

	/**
	 * Load all needed data.
	 *
	 * @method load
	 * */
	load() {
		return {
			status: this.status
		};
	}
}

ns.App.Page.Error.Controller = Controller;
