import { AbstractPageController } from 'app/page/AbstractPageController';

export class ErrorController extends AbstractPageController {
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
}
