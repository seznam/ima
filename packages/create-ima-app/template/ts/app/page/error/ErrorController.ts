import { Dependencies, GenericError } from '@ima/core';

import { AbstractPageController } from '../AbstractPageController';

type ErrorControllerState = {
  status: number;
  error: GenericError;
};

type ErrorControllerRouteParams = {
  error: GenericError;
};

export class ErrorController extends AbstractPageController<
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
}
