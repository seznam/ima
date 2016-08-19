import ns from 'ima/namespace';
import AbstractController from 'ima/controller/AbstractController';

ns.namespace('app.base');

/**
 * Base controller.
 *
 * @class Controller
 * @extends ima.controller.AbstractController
 * @namespace app.base
 * @module BaseController
 * @submodule app.base
 */
export default class BaseController extends AbstractController {

	/**
	 * Initializes the controller.
	 *
	 * @constructor
	 * @method constructor
	 */
	constructor() {
		super();
	}

	/**
	 * Set seo params.
	 *
	 * @method setSeoParams
	 * @param {Object} loadedResources
	 * @param {ima.meta.MetaManager} metaManager
	 * @param {ima.router.Router} router
	 * @param {ima.dictionary.Dictionary} dictionary
	 * @param {Object} settings
	 */
	setMetaParams(loadedResources, metaManager, router, dictionary, settings) {
		let title = 'IMA.js';
		let description = 'IMA.js is isomorphic javascript application framework.';
		let image = router.getDomain() + settings.$Static.image + '/imajs-share.png';

		let url = router.getUrl();

		metaManager.setTitle(title);

		metaManager.setMetaName('description', description);
		metaManager.setMetaName('keywords', 'IMA.js, isomorphic application, javascript');

		metaManager.setMetaName('twitter:title', title);
		metaManager.setMetaName('twitter:description', description);
		metaManager.setMetaName('twitter:card', 'summary');
		metaManager.setMetaName('twitter:image', image);
		metaManager.setMetaName('twitter:url', url);

		metaManager.setMetaProperty('og:title', title);
		metaManager.setMetaProperty('og:description', description);
		metaManager.setMetaProperty('og:type', 'website');
		metaManager.setMetaProperty('og:image', image);
		metaManager.setMetaProperty('og:url', url);
	}
}

ns.app.base.BaseController = BaseController;
