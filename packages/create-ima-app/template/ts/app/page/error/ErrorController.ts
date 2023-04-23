import {
  AbstractController,
  Dependencies,
  Dictionary,
  GenericError,
  LoadedResources,
  MetaManager,
  Router,
  Settings,
} from '@ima/core';

export type ErrorControllerState = {
  status: number;
  error: GenericError;
};

export type ErrorControllerRouteParams = {
  error: GenericError;
};

export class ErrorController extends AbstractController<
  ErrorControllerState,
  ErrorControllerRouteParams
> {
  status = 500;

  static $dependencies: Dependencies = [];

  load(): ErrorControllerState {
    return {
      status: this.status,
      error: this.params.error,
    };
  }

  setMetaParams(
    loadedResources: LoadedResources<ErrorControllerState>,
    metaManager: MetaManager,
    router: Router,
    dictionary: Dictionary,
    settings: Settings
  ): void {
    metaManager.setTitle(`Error ${this.status} - IMA.js`);
    metaManager.setMetaName('description', 'Server error');
    metaManager.setMetaName('robots', 'noindex, nofollow');
  }
}
