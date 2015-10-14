import ns from 'imajs/client/core/namespace';

ns.namespace('App.Base');

/**
 * Base controller.
 *
 * @class Controller
 * @extends Core.Abstract.Controller
 * @namespace App.Base
 * @module App
 * @submodule App.Base
 */
class Controller extends ns.Core.Abstract.Controller {

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
	 * @param {Core.Interface.MetaManager} metaManager
	 * @param {Core.Interface.Router} router
	 * @param {Core.Interface.Dictionary} dictionary
	 * @param {Object} settings
	 */
	setMetaParams(loadedResources, metaManager, router, dictionary, settings) {
		var title = 'IMA.js';
		var description = 'IMA.js is isomorphic javascript application framework.';
		var image = router.getDomain() + settings.$Static.image + '/imajs-share.png';

		var url = router.getUrl();

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

ns.App.Base.Controller = Controller;
