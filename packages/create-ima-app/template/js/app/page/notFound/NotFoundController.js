import { AbstractController } from '@ima/core';

export class NotFoundController extends AbstractController {
  static get $dependencies() {
    return [];
  }

  constructor() {
    super();

    this.status = 404;
  }

  load() {
    return {
      status: this.status,
    };
  }

  setMetaParams(loadedResources, metaManager) {
    metaManager.setTitle(`Error ${this.status} - IMA.js`);
    metaManager.setMetaName('description', 'Not Found');
    metaManager.setMetaName('robots', 'noindex, nofollow');
  }
}
