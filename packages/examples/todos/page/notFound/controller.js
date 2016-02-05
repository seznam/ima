import ns from 'imajs/client/core/namespace';

ns.namespace('App.Page.NotFound');

class Controller extends ns.App.Base.Controller {
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

ns.App.Page.NotFound.Controller = Controller;
