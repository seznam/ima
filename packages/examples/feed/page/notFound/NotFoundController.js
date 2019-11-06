import AbstractController from 'app/page/AbstractController';

export default class NotFoundController extends AbstractController {
  static get $dependencies() {
    return [];
  }

  constructor() {
    super();

    this.status = 404;
  }

  /**
   * Load all needed data.
   *
   * @return {{status: number}} Resources to load.
   */
  load() {
    return {
      status: this.status
    };
  }
}
