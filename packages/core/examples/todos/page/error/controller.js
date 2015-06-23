import ns from 'imajs/client/core/namespace.js';

ns.namespace('App.Page.Error');

class Controller extends ns.App.Base.Controller {
	constructor() {
		super();

		this._status = 500;
	}

	load() {
		return {
			status: this._status,
			error: this.params
		};
	}
}

ns.App.Page.Error.Controller = Controller;
