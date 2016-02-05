import ns from 'imajs/client/core/namespace';

ns.namespace('App.Base');

/**
 * Base controller for App.
 *
 * @class Controller
 * @extends Core.Abstract.Controller
 * @namespace App.Base
 * @module App
 * @submodule App.Base
 */
class Controller extends ns.Core.Abstract.Controller {
	/**
	 * Initializes the base controller.
	 *
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
	setMetaParams(resolvedPromises, seo, router, dictionary, setting) {

		var title = dictionary.get('home.seoTitle');
		var description = dictionary.get('home.seoDescription');
		var image = router.getDomain() + setting.$Static.image + setting.Images.fbShare;

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
