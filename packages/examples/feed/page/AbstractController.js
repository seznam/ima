import AbstractIMAController from 'ima/controller/AbstractController';
import Dictionary from 'ima/dictionary/Dictionary';
import MetaManager from 'ima/meta/MetaManager';
import Router from 'ima/router/Router';

/**
 * Base controller for app.
 */
export default class AbstractController extends AbstractIMAController {

	/**
	 * Set meta params.
	 *
	 * @param {Object<string, *>} resolvedPromises
	 * @param {MetaManager} metaManager
	 * @param {Router} router
	 * @param {Dictionary} dictionary
	 * @param {Object<string, *>} setting
	 */
	setMetaParams(resolvedPromises, metaManager, router, dictionary, setting) {
		let title = dictionary.get('home.seoTitle');
		let description = dictionary.get('home.seoDescription');
		let domain = router.getDomain();
		let fbShareImage = setting.Images.fbShare;
		let image = `${domain}${setting.$Static.image}${fbShareImage}`;

		let url = router.getUrl();

		metaManager.setTitle(title);

		metaManager.setMetaName('description', description);
		metaManager.setMetaName(
			'keywords',
			'IMA.js, isomorphic application, javascript'
		);

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
