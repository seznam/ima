import { AbstractPageController } from 'app/page/AbstractPageController';

export class NotFoundController extends AbstractPageController {
  status = 404;

  static get $dependencies() {
    return [];
  }

  load() {
    return {
      status: this.status,
    };
  }
}
