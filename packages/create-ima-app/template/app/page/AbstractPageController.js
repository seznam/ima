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

    metaManager.setMetaName('description', { value: description });
    metaManager.setMetaName('keywords', {
      value: 'IMA.js, isomorphic application, javascript',
    });

    metaManager.setMetaName('twitter:title', { value: title });
    metaManager.setMetaName('twitter:description', { value: description });
    metaManager.setMetaName('twitter:card', { value: 'summary' });
    metaManager.setMetaName('twitter:image', { value: image });
    metaManager.setMetaName('twitter:url', { value: url });

    metaManager.setMetaProperty('og:title', { value: title });
    metaManager.setMetaProperty('og:description', { value: description });
    metaManager.setMetaProperty('og:type', { value: 'website' });
    metaManager.setMetaProperty('og:image', { value: image });
    metaManager.setMetaProperty('og:url', { value: url });
  }
}
