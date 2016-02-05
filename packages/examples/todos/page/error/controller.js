import ns from 'imajs/client/core/namespace';

ns.namespace('App.Page.Error');

class Controller extends ns.App.Base.Controller {
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

ns.App.Page.Error.Controller = Controller;
