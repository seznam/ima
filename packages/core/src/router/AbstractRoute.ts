/* eslint-disable @typescript-eslint/no-unused-vars */

import { RoutePathExpression } from './DynamicRoute';
import { RouteFactoryOptions } from './Router';
import { Controller, IController } from '../controller/Controller';
import { GenericError } from '../error/GenericError';

export type RouteParams = Record<string, string>;

/**
 * Regular expression used to match and remove the starting and trailing
 * forward slashes from a path expression or a URL path.
 *
 * @const
 * @type {RegExp}
 */
export const LOOSE_SLASHES_REGEXP = /^\/|\/$/g;

/**
 * Utility for representing and manipulating a single route in the router's
 * configuration.
 */
export abstract class AbstractRoute<T extends string | RoutePathExpression> {
  /**
   * The unique name of this route, identifying it among the rest of the
   * routes in the application.
   */
  protected _name: string;
  /**
   * Path expression used in route matching, to generate valid path with
   * provided params and parsing params from current path.
   */
  protected _pathExpression: T;
  /**
   * The full name of Object Container alias identifying the controller
   * associated with this route.
   */
  protected _controller: {
    resolved: boolean;
    isAsync: boolean;
    controller: string | typeof Controller | (() => IController);
    cached: null | unknown;
  };
  /**
   * The full name or Object Container alias identifying the view class
   * associated with this route.
   */
  protected _view: {
    resolved: boolean;
    isAsync: boolean;
    view: string | unknown | (() => unknown);
    cached: null | unknown;
  };

  /**
   * The route additional options.
   */
  protected _options: RouteFactoryOptions;

  /**
   * Initializes the route.
   *
   * @param name The unique name of this route, identifying it among
   *        the rest of the routes in the application.
   * @param pathExpression Path expression used in route matching, to generate
   *        valid path with provided params and parsing params from current path.
   * @param controller The full name of Object Container alias
   *        identifying the controller associated with this route.
   * @param view The full name or Object Container alias identifying
   *        the view class associated with this route.
   * @param options The route additional options.
   */
  constructor(
    name: string,
    pathExpression: T,
    controller: string | typeof Controller | (() => IController),
    view: string | unknown | (() => unknown),
    options?: Partial<RouteFactoryOptions>
  ) {
    this._name = name;
    this._pathExpression = pathExpression;
    this._controller = {
      resolved: !this.isAsync(controller),
      isAsync: this.isAsync(controller),
      controller: controller,
      cached: null,
    };
    this._view = {
      resolved: !this.isAsync(view),
      isAsync: this.isAsync(view),
      view: view,
      cached: null,
    };

    /**
     * Init options with defaults.
     */
    this._options = {
      ...{
        autoScroll: true,
        documentView: null,
        managedRootView: null,
        onlyUpdate: false,
        viewAdapter: null,
        middlewares: [],
      },
      ...options,
    };
  }

  /**
   * Returns the unique identifying name of this route.
   *
   * @return The name of the route, identifying it.
   */
  getName() {
    return this._name;
  }

  /**
   * Checks if given argument is an async handler.
   */
  isAsync(module: string | unknown | (() => unknown)) {
    return module?.constructor.name === 'AsyncFunction';
  }

  /**
   * Returns Controller class/alias/constant associated with this route.
   * Internally caches async calls for dynamically imported controllers,
   * meaning that once they're loaded, you get the same promise for
   * subsequent calls.
   *
   * @return The Controller class/alias/constant.
   */
  getController() {
    if (!this._controller.cached) {
      this._controller.cached = this._controller.isAsync
        ? (
            this._controller.controller as () => Promise<
              Record<string, unknown>
            >
          )().then(module => {
            this._controller.resolved = true;

            return module.default ?? module;
          })
        : this._controller.controller;
    }

    return this._controller.cached;
  }

  /**
   * Returns true for resolved controller. This is always true
   * for sync route views.
   */
  isControllerResolved() {
    return this._controller.resolved;
  }

  /**
   * Returns true if controller is an async handler.
   */
  isControllerAsync() {
    return this._controller.isAsync;
  }

  /**
   * Returns View class/alias/constant associated with this route.
   * Internally caches async calls for dynamically imported views,
   * meaning that once they're loaded, you get the same promise for
   * subsequent calls.
   *
   * @return The View class/alias/constant.
   */
  getView() {
    if (!this._view.cached) {
      this._view.cached = this._view.isAsync
        ? (this._view.view as () => Promise<Record<string, unknown>>)().then(
            module => {
              this._view.resolved = true;

              return module.default ?? module;
            }
          )
        : this._view.view;
    }

    return this._view.cached;
  }

  /**
   * Returns true for resolved view. This is always true
   * for sync route views.
   */
  isViewResolved() {
    return this._view.resolved;
  }

  /**
   * Returns true if view is an async handler.
   */
  isViewAsync() {
    return this._view.isAsync;
  }

  /**
   * Return route additional options.
   */
  getOptions() {
    return this._options;
  }

  /**
   * Path expression used in route matching, to generate valid path with
   * provided params and parsing params from current path.
   *
   * @return The path expression.
   */
  getPathExpression() {
    return this._pathExpression;
  }

  /**
   * Trims the trailing forward slash from the provided URL path.
   *
   * @param path The path to trim.
   * @return Trimmed path.
   */
  getTrimmedPath(path: string) {
    return `/${path.replace(LOOSE_SLASHES_REGEXP, '')}`;
  }

  /**
   * Preloads dynamically imported view and controller.
   *
   * @return Promise.All resolving to [view, controller] tuple.
   */
  async preload() {
    return Promise.all([this.getController(), this.getView()]);
  }

  /**
   * Creates the URL and query parts of a URL by substituting the route's
   * parameter placeholders by the provided parameter value.
   *
   * The extraneous parameters that do not match any of the route's
   * placeholders will be appended as the query string.
   *
   * @param params The route
   *        parameter values.
   * @return Path and, if necessary, query parts of the URL
   *         representing this route with its parameters replaced by the
   *         provided parameter values.
   */
  toPath(params: RouteParams): string {
    throw new GenericError(
      'The ima.core.router.AbstractRoute.toPath method is abstract ' +
        'and must be overridden',
      { params }
    );
  }

  /**
   * Tests whether the provided URL path matches this route. The provided
   * path may contain the query.
   *
   * @param path The URL path.
   * @return `true` if the provided path matches this route.
   */
  matches(path: string): boolean {
    throw new GenericError(
      'The ima.core.router.AbstractRoute.matches method is abstract ' +
        'and must be overridden',
      { path }
    );
  }

  /**
   * Extracts the parameter values from the provided path. The method
   * extracts both the in-path parameters and parses the query, allowing the
   * query parameters to override the in-path parameters.
   *
   * The method returns an empty hash object if the path does not match this
   * route.
   *
   * @param path Currently routed path.
   * @param url Currently routed URL.
   * @return Map of parameter names to parameter
   *         values.
   */
  extractParameters(path: string, url: string): RouteParams {
    throw new GenericError(
      'The ima.core.router.AbstractRoute.extractParameters method is abstract ' +
        'and must be overridden',
      { path, url }
    );
  }
}
