import ns from 'imajs/client/core/namespace.js';

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
	 * @param {Object} resolvedPromises
	 * @param {Core.Interface.Seo} seo
	 * @param {Core.Interface.Router} router
	 * @param {Core.Interface.Dictionary} dictionary
	 * @param {Object} setting
	 */
	setSeoParams(resolvedPromises, seo, router, dictionary, setting) {
		var title = resolvedPromises.message;
		var description = 'IMA.js is isomorphic javascript application framework.';
		var image = router.getDomain() + setting.$Static.image + 'imajs-share.png';

		var url = router.getUrl();

		seo.setTitle(title);

		seo.setMetaName('description', description);
		seo.setMetaName('keywords', 'IMA.js, isomorphic application, javascript');

		seo.setMetaName('twitter:title', title);
		seo.setMetaName('twitter:description', description);
		seo.setMetaName('twitter:card', 'summary');
		seo.setMetaName('twitter:image', image);
		seo.setMetaName('twitter:url', url);

		seo.setMetaProperty('og:title', title);
		seo.setMetaProperty('og:description', description);
		seo.setMetaProperty('og:type', 'website');
		seo.setMetaProperty('og:image', image);
		seo.setMetaProperty('og:url', url);
	}
}

ns.App.Base.Controller = Controller;