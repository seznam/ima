import ns from 'ima/namespace';
import BaseController from 'app/base/Controller';

ns.namespace('app.page.notFound');

export default class Controller extends BaseController {
	constructor() {
		super();

		this.status = 404;
	}

	load() {
		return {
			status: this.status
		};
	}
}

ns.app.page.notFound.Controller = Controller;
