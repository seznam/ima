import BaseController from 'app/base/Controller';

/**
 * Controller for the "not found" error page.
 *
 * @class Controller
 * @extends app.base.BaseController
 * @namespace app.page.notFound
 * @module app
 * @submodule app.page
 */
export default class Controller extends BaseController {
	/**
	 * Initializes the controller.
	 *
	 * @constructor
	 * @method constructor
	 */
	constructor() {
		super();

		this.status = 404;
	}

	/**
	 * Loads the page state.
	 *
	 * @method laod
	 * @return {{status: number}}
	 */
	load() {
		return {
			status: this.status
		};
	}
}
