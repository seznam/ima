import ns from 'imajs/client/core/namespace';
import BaseController from 'app/base/controller';

ns.namespace('App.Page.NotFound');

/**
 * @class Controller
 * @extends App.Base.Controller
 * @namespace App.Page.NotFound
 * @module App
 * @submodule App.Page
 */
export default class Controller extends BaseController {

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
