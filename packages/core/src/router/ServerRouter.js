import AbstractRouter from './AbstractRouter';
import Request from './Request';
import Response from './Response';
import RouteFactory from './RouteFactory';
import Dispatcher from '../event/Dispatcher';
import PageManager from '../page/manager/PageManager';

// @server-side class ServerRouter extends __VARIABLE__ {__CLEAR__}\nexports.default = ServerRouter;

/**
 * The server-side implementation of the {@codelink Router} interface.
 */
export default class ServerRouter extends AbstractRouter {
  //#if _SERVER
  static get $dependencies() {
    return [PageManager, RouteFactory, Dispatcher, Request, Response];
  }

  /**
   * Initializes the router.
   *
   * @param {PageManager} pageManager The current page manager.
   * @param {RouteFactory} factory The router factory used to create routes.
   * @param {Dispatcher} dispatcher Dispatcher fires events to app.
   * @param {Request} request The current HTTP request.
   * @param {Response} response The current HTTP response.
   */
  constructor(pageManager, factory, dispatcher, request, response) {
    super(pageManager, factory, dispatcher);

    /**
     * The current HTTP request.
     *
     * @type {Request}
     */
    this._request = request;

    /**
     * The current HTTP response.
     *
     * @type {Response}
     */
    this._response = response;
  }

  /**
   * @inheritdoc
   */
  getPath() {
    return this._extractRoutePath(this._request.getPath());
  }

  /**
   * @inheritdoc
   */
  listen() {
    return this;
  }

  /**
   * @inheritdoc
   */
  redirect(url = '/', options = {}) {
    this._response.redirect(url, options.httpStatus || 302);
  }
  //#endif
}
