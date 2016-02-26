import ns from 'ima/namespace';
import BaseController from 'app/base/BaseController';

ns.namespace('app.page.notFound');

/**
 * @class Controller
 * @extends app.base.BaseController
 * @namespace app.page.notFound
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
		this.status = 404;
	}

	/**
	 * Load all needed data.
	 *
	 * @method load
	 * @return {Object} object of promise
	 * */
	load() {
		return {
			status: this.status
		};
	}
}

ns.app.page.notFound.Controller = Controller;
