/* @if client **
export default class ServerRouter {};
/* @else */
import AbstractRouter from './AbstractRouter';
import Request from './Request';
import Response from './Response';
import RouteFactory from './RouteFactory';
import Dispatcher from '../event/Dispatcher';
import PageManager from '../page/manager/PageManager';
import { RouteOptions } from '..';

/**
 * The server-side implementation of the {@link Router} interface.
 */
export default class ServerRouter extends AbstractRouter {
  #request: Request;
  #response: Response;

  static get $dependencies() {
    return [PageManager, RouteFactory, Dispatcher, Request, Response];
  }

  /**
   * Initializes the router.
   *
   * @param pageManager The current page manager.
   * @param factory The router factory used to create routes.
   * @param dispatcher Dispatcher fires events to app.
   * @param request The current HTTP request.
   * @param response The current HTTP response.
   */
  constructor(
    pageManager: PageManager,
    factory: RouteFactory,
    dispatcher: Dispatcher,
    request: Request,
    response: Response
  ) {
    super(pageManager, factory, dispatcher);

    this.#request = request;
    this.#response = response;
  }

  /**
   * @inheritDoc
   */
  getPath() {
    return this._extractRoutePath(this.#request.getPath());
  }

  /**
   * @inheritDoc
   */
  listen() {
    return this;
  }

  /**
   * @inheritDoc
   */
  unlisten() {
    return this;
  }

  /**
   * @inheritDoc
   */
  redirect(url = '/', options?: Partial<RouteOptions>) {
    this.#response.redirect(url, { httpStatus: 302, ...options });
  }
}
// @endif
