import ns from 'ima/namespace';
import AbstractController from 'ima/controller/AbstractController';

ns.namespace('app.base');

export default class Controller extends AbstractController {
	setMetaParams(loadedResources, metaManager, router, dictionary, settings) {
		metaManager.setTitle(dictionary.get('home.title'));
	}
}

ns.app.base.Controller = Controller;
