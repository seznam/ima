import {
  AbstractController,
  Dependencies,
  Dictionary,
  LoadedResources,
  MetaManager,
  Router,
  Settings,
} from '@ima/core';

export type NotFoundControllerState = {
  status: number;
};

export class NotFoundController extends AbstractController<NotFoundControllerState> {
  status = 404;

  static $dependencies: Dependencies = [];

  load() {
    return {
      status: this.status,
    };
  }

  setMetaParams(
    loadedResources: LoadedResources<NotFoundControllerState>,
    metaManager: MetaManager,
    router: Router,
    dictionary: Dictionary,
    settings: Settings
  ): void {
    metaManager.setTitle(`Error ${this.status} - IMA.js`);
    metaManager.setMetaName('description', 'Not Found');
    metaManager.setMetaName('robots', 'noindex, nofollow');
  }
}
