import { Dependencies } from '@ima/core';
import { AbstractPageController } from 'app/page/AbstractPageController';

export class ErrorController extends AbstractPageController {
  static $dependencies: Dependencies = [];

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
}
