import AbstractController from '../AbstractController';

/**
 * The error page's controller.
 * 
 * @class ErrorController
 * @extends AbstractController
 * @namespace app.page.error
 * @module app
 * @submodule app.page
 */
export default class ErrorController extends AbstractController {
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
