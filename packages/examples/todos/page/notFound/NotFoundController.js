import AbstractController from '../AbstractController';

/**
 * Controller for the "not found" error page.
 */
export default class NotFoundController extends AbstractController {
  static get $dependencies() {
    return [];
  }

  /**
   * Initializes the controller.
   */
  constructor() {
    super();

    this.status = 404;
  }

  /**
   * Loads the page state.
   *
   * @return {{status: number}}
   */
  load() {
    return {
      status: this.status
    };
  }
}
