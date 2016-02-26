import ns from 'ima/namespace';
import BaseController from 'app/base/controller';

ns.namespace('App.Page.Error');

/**
 * @class Controller
 * @extends App.Base.Controller
 * @namespace App.Page.Error
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
