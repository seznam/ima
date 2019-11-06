import AbstractController from 'app/page/AbstractController';

export default class ErrorController extends AbstractController {
  static get $dependencies() {
    return [];
  }

  constructor() {
    super();

    this.status = 500;
  }

  /**
   * Load all needed data.
   *
   * @return {{status: number}}
   */
  load() {
    return {
      status: this.status
    };
  }
}
