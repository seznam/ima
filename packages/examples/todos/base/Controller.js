import ns from 'ima/namespace';
import AbstractController from 'ima/controller/AbstractController';

ns.namespace('app.base');

/**
 * Base controller, providing elementary configuration of the meta manager.
 *
 * @class Controller
 * @extends ima.controller.AbstractController
 * @namespace app.base
 * @module BaseController
 * @submodule app.base
 */
export default class Controller extends AbstractController {
	/**
	 * Sets the SEO meta information to the provided meta manager.
	 *
	 * @method setSeoParams
	 * @param {Object<string, *>} loadedResources The resources that were
	 *        loaded using the controller's {@code load()} method.
	 * @param {ima.meta.MetaManager} metaManager The IMA meta manager, used to
	 *        manage the meta information related to SEO.
	 * @param {ima.router.Router} router The IMA router.
	 * @param {ima.dictionary.Dictionary} dictionary The IMA dictionary,
	 *        providing localized phrases.
	 * @param {Object<string, *>} settings The application's configuration for
	 *        the current environment.
	 */
	setMetaParams(loadedResources, metaManager, router, dictionary, settings) {
		metaManager.setTitle(dictionary.get('home.title'));
	}
}

ns.app.base.Controller = Controller;
