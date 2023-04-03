import { Dependencies } from '@ima/core';
import { AbstractPageController } from 'app/page/AbstractPageController';

export class NotFoundController extends AbstractPageController {
  static $dependencies: Dependencies = [];

  constructor() {
    super();

    this.status = 404;
  }

  load() {
    return {
      status: this.status,
    };
  }
}
