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
  protected _controller: string | typeof Controller | (() => IController);
  /**
   * The full name or Object Container alias identifying the view class
   * associated with this route.
   */
  protected _view: string | unknown | (() => unknown);
  /**
   * The route additional options.
   */
  protected _options: RouteFactoryOptions;
  protected _cachedController: unknown;
  protected _cachedView: unknown;

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
    this._controller = controller;
    this._view = view;

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
   * Returns Controller class/alias/constant associated with this route.
   * Internally caches async calls for dynamically imported controllers,
   * meaning that once they're loaded, you get the same promise for
   * subsequent calls.
   *
   * @return The Controller class/alias/constant.
   */
  getController() {
    if (!this._cachedController) {
      this._cachedController = this._getAsyncModule(this._controller);
    }

    return this._cachedController;
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
    if (!this._cachedView) {
      this._cachedView = this._getAsyncModule(this._view);
    }

    return this._cachedView;
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

  /**
   * Helper method to pre-process view and controller which can be
   * async functions in order to support dynamic async routing.
   *
   * @param module The module class/alias/constant.
   * @return Module, or promise resolving to the actual view or controller
   *  constructor function/class.
   */
  _getAsyncModule(module: string | unknown | (() => unknown)) {
    return module?.constructor.name === 'AsyncFunction'
      ? (module as () => Promise<Record<string, unknown>>)().then(
          module => module.default ?? module
        )
      : module;
  }
}
