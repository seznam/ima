import ns from 'ima/namespace';
import AbstractPageController from 'app/page/AbstractPageController';

ns.namespace('app.page.error');

/**
 * @class ErrorController
 * @extends app.page.AbstractPageController
 * @namespace app.page.error
 * @module app
 * @submodule app.page
 */
export default class ErrorController extends AbstractPageController {

	static get $dependencies() {
		return [];
	}

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
