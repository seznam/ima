import { AbstractPageController } from 'app/page/AbstractPageController';

export class NotFoundController extends AbstractPageController {
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
}
