import { AbstractPageController } from 'app/page/AbstractPageController';

export class ErrorController extends AbstractPageController {
  status = 500;

  static get $dependencies() {
    return [];
  }

  load() {
    return {
      status: this.status,
      error: this.params.error,
    };
  }
}
