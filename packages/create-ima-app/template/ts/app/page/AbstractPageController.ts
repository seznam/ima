import { AbstractController, MetaManager, Router } from '@ima/core';

import IMAjsShareImg from 'app/public/imajs-share.png';

/**
 * Basic page controller.
 */
export class AbstractPageController extends AbstractController {
  setMetaParams(_: unknown, metaManager: MetaManager, router: Router) {
    const title = 'IMA.js';
    const description =
      'IMA.js is isomorphic javascript application framework.';

    const url = router.getUrl();
    const domain = router.getDomain();
    const image = `${domain}/${IMAjsShareImg}`;

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
