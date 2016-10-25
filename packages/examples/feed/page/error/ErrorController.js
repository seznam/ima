import AbstractController from 'app/page/AbstractController';

/**
 * @class ErrorController
 * @extends app.page.AbstractController
 * @namespace app.page.error
 * @module app
 * @submodule app.page
 */
export default class ErrorController extends AbstractController {

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
	 * Load all needed data.
	 *
	 * @method load
	 */
	load() {
		return {
			status: this.status
		};
	}
}
