import ns from 'imajs/client/core/namespace';

ns.namespace('App.Base');

class Controller extends ns.Core.Abstract.Controller {
	constructor() {
		super();
	}

	setMetaParams(loadedResources, metaManager, router, dictionary, settings) {
		metaManager.setTitle(dictionary.get('app.title'));
	}
}

ns.App.Base.Controller = Controller;
