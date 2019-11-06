import AbstractPageController from 'app/page/AbstractPageController';

/**
 * @class ErrorController
 * @extends app.page.AbstractPageController
 * @namespace app.page.error
 * @module app
 * @submodule app.page
 */
export default class ErrorController extends AbstractPageController {
  static get $dependencies() {
    return [];
  }

  constructor() {
    super();

    this.status = 500;
  }

  /**
   * @return {Object}
   */
  load() {
    return {
      status: this.status,
      error: this.params
    };
  }
}
