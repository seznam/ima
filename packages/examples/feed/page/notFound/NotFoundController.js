import AbstractController from 'app/page/AbstractController';

/**
 * @class NotFoundController
 * @extends app.page.AbstractController
 * @namespace app.page.notFound
 * @module app
 * @submodule app.page
 */
export default class NotFoundController extends AbstractController {

	static get $dependencies() {
		return [];
	}

	/**
	 * @method constructor
	 * @constructor
	 */
	constructor() {
		super();

		this.status = 404;
	}

	/**
	 * Load all needed data.
	 *
	 * @method load
	 * @return {{status: number}} object of promise
	 */
	load() {
		return {
			status: this.status
		};
	}
}
