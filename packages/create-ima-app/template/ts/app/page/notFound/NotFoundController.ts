import { Dependencies } from '@ima/core';
import { AbstractPageController } from 'app/page/AbstractPageController';

type NotFoundControllerState = {
  status: number;
};

export class NotFoundController extends AbstractPageController<NotFoundControllerState> {
  status = 404;

  static $dependencies: Dependencies = [];

  load() {
    return {
      status: this.status,
    };
  }
}
