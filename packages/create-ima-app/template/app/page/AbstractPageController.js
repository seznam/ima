import { AbstractController } from '@ima/core';

import IMAjsShareImg from 'app/public/imajs-share.png';

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
  setMetaParams(loadedResources, metaManager, router) {
    let title = 'IMA.js';
    let description;
    description = 'IMA.js is isomorphic javascript application framework.';

    let url = router.getUrl();
    let domain = router.getDomain();
    let image = `${domain}/${IMAjsShareImg}`;

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
