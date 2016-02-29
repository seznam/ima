import ns from 'ima/namespace';
import BaseController from 'app/base/Controller';

ns.namespace('app.page.error');

export default class Controller extends BaseController {
	constructor() {
		super();

		this.status = 500;
	}

	load() {
		return {
			status: this.status,
			error: this.params
		};
	}
}

ns.app.page.error.Controller = Controller;
