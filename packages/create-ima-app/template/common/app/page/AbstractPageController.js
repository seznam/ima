import { AbstractController } from '@ima/core';
import IMAjsShareImg from 'app/public/imajs-share.png';

/**
 * Basic page controller.
 */
export class AbstractPageController extends AbstractController {
  /**
   * Set seo params.
   *
   * @param {Object<string, *>} loadedResources
   * @param {MetaManager} metaManager
   * @param {Router} router
   * @param {Dictionary} dictionary
   * @param {Object<string, *>} settings
   */
  setMetaParams(loadedResources, metaManager, router) {
    let title = 'IMA.js';
    let description;
    description = 'IMA.js is isomorphic javascript application framework.';

    let url = router.getUrl();
    let domain = router.getDomain();
    let image = `${domain}/${IMAjsShareImg}`;

    metaManager.setTitle(title);
    metaManager
      .setMetaName('description', description)
      .setMetaName('keywords', 'IMA.js, isomorphic application, javascript');
    metaManager
      .setMetaName('twitter:title', title)
      .setMetaName('twitter:description', description)
      .setMetaName('twitter:card', 'summary')
      .setMetaName('twitter:image', image)
      .setMetaName('twitter:url', url);
    metaManager
      .setMetaProperty('og:title', title)
      .setMetaProperty('og:description', description)
      .setMetaProperty('og:type', 'website')
      .setMetaProperty('og:image', image)
      .setMetaProperty('og:url', url);
  }
}
