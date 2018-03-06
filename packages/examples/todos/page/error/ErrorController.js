import AbstractController from '../AbstractController';

/**
 * The error page's controller.
 */
export default class ErrorController extends AbstractController {
  static get $dependencies() {
    return [];
  }

  /**
   * Initializes the constructor.
   */
  constructor() {
    super();

    this.status = 500;
  }

  /**
   * Loads the page state.
   *
   * @return {{status: number, error: Object<string, string>}}
   */
  load() {
    return {
      status: this.status,
      error: this.params
    };
  }
}
