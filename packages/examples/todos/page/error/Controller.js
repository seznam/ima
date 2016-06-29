import ns from 'ima/namespace';
import BaseController from 'app/base/Controller';

ns.namespace('app.page.error');

/**
 * The error page's controller.
 * 
 * @class Controller
 * @extends app.base.BaseController
 * @namespace app.page.error
 * @module app
 * @submodule app.page
 */
export default class Controller extends BaseController {
	/**
	 * Initializes the constructor.
	 * 
	 * @constructor
	 * @method constructor
	 */
	constructor() {
		super();

		this.status = 500;
	}

	/**
	 * Loads the page state.
	 * 
	 * @method load
	 * @return {{status: number, error: Object<string, string>}}
	 */
	load() {
		return {
			status: this.status,
			error: this.params
		};
	}
}

ns.app.page.error.Controller = Controller;
