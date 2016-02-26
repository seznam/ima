import ns from 'ima/namespace';
import BaseController from 'app/base/BaseController';

ns.namespace('app.page.notFound');

/**
 * @class NotFoundController
 * @extends app.base.BaseController
 * @namespace app.page.notFound
 * @module app
 * @submodule app.page
 */
export default class NotFoundController extends BaseController {

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
