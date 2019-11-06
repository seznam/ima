import AbstractController from 'ima/controller/AbstractController';
//import Dictionary from 'ima/dictionary/Dictionary';
//import MetaManager from 'ima/meta/MetaManager';
//import Router from 'ima/router/Router';

/**
 * Basic page controller.
 */
export default class AbstractPageController extends AbstractController {
  /**
   * Set seo params.
   *
   * @param {Object<string, *>} loadedResources
   * @param {MetaManager} metaManager
   * @param {Router} router
   * @param {Dictionary} dictionary
   * @param {Object<string, *>} settings
   */
  setMetaParams(loadedResources, metaManager, router, dictionary, settings) {
    let title = 'IMA.js';
    let description;
    description = 'IMA.js is isomorphic javascript application framework.';
    let domain = router.getDomain();
    let image = `${domain}${settings.$Static.image}/imajs-share.png`;

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
