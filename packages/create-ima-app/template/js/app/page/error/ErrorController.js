import { AbstractController } from '@ima/core';

export class ErrorController extends AbstractController {
  static get $dependencies() {
    return [];
  }

  constructor() {
    super();

    this.status = 500;
  }

  load() {
    return {
      status: this.status,
      error: this.params.error,
    };
  }

  setMetaParams(loadedResources, metaManager) {
    metaManager.setTitle(`Error ${this.status} - IMA.js`);
    metaManager.setMetaName('description', 'Server error');
    metaManager.setMetaName('robots', 'noindex, nofollow');
  }
}
