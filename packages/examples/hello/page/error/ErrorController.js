import ns from 'ima/namespace';
import BaseController from 'app/base/BaseController';

ns.namespace('app.page.error');

/**
 * @class ErrorController
 * @extends app.base.BaseController
 * @namespace app.page.error
 * @module app
 * @submodule app.page
 */
export default class ErrorController extends BaseController {
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

ns.app.page.error.ErrorController = ErrorController;
