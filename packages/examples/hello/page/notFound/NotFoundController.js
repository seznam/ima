import ns from 'ima/namespace';
import AbstractPageController from 'app/page/AbstractPageController';

ns.namespace('app.page.notFound');

/**
 * @class NotFoundController
 * @extends app.page.AbstractPageController
 * @namespace app.page.notFound
 * @module app
 * @submodule app.page
 */
export default class NotFoundController extends AbstractPageController {

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
	 * @method load
	 * @return {Object}
	 */
	load() {
		return {
			status: this.status
		};
	}
}

ns.app.page.notFound.NotFoundController = NotFoundController;
