import ns from 'ima/namespace';
import BaseController from 'app/base/BaseController';

ns.namespace('app.page.error');

/**
 * @class Controller
 * @extends app.base.BaseController
 * @namespace app.page.error
 * @module app
 * @submodule app.page
 * */
class Controller extends BaseController {

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

ns.app.page.error.Controller = Controller;
