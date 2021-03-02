import GenericError from '../error/GenericError';

/**
 * Utility for representing and running router middleware.
 */
export default class RouterMiddleware {
  /**
   * Initializes the middleware
   *
   * @param {function(Object<string, string>, function())} middleware Middleware
   *        function accepting routeParams as a first argument, which can be mutated
   *        and {@code skip} callback allowing it skip all additional following
   *        middlewares.
   */
  constructor(middleware) {
    if (typeof middleware !== 'function') {
      throw new GenericError(
        `The middleware must be a function, '${typeof pathExpression}' was given.`
      );
    }

    /**
     * Middleware function accepting routeParams as a first argument, which can be
     * mutated and {@code skip} callback allowing it skip all additional following
     * middlewares.
     *
     * @type {function(Object<string, string>, function())}
     */
    this._middleware = middleware;
  }

  /**
   * Passes provided params to router middleware and runs it.
   *
   * @param {Object<string, (number|string)>=} [params={}] The route
   *        parameter values.
   * @param {function} skipCallback When called, it passes handling to
   *        next middleware in line. Otherwise it skips to route handler.
   * @return {Promise<void>} Middleware function.
   */
  async run(params, skipCallback) {
    return this._middleware(params, skipCallback);
  }
}
