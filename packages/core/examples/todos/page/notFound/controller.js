import ns from 'imajs/client/core/namespace.js';

ns.namespace('App.Page.NotFound');

class Controller extends ns.App.Base.Controller {
	constructor() {
		super();

		this._status = 404;
	}

	load() {
		return {
			status: this._status
		};
	}
}

ns.App.Page.NotFound.Controller = Controller;
