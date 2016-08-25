import AbstractController from '../AbstractController';

/**
 * Controller for the "not found" error page.
 *
 * @class NotFoundController
 * @extends AbstractController
 * @namespace app.page.notFound
 * @module app
 * @submodule app.page
 */
export default class NotFoundController extends AbstractController {
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
