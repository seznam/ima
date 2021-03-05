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
   *        and {@code locals} object as second argument. This can be used to pass data
   *        between middlewares.
   */
  constructor(middleware) {
    if (typeof middleware !== 'function') {
      throw new GenericError(
        `The middleware must be a function, '${typeof pathExpression}' was given.`
      );
    }

    /**
     * Middleware function accepting {@code routeParams} as a first argument, which can be
     * mutated and {@code locals} object as second argument. This can be used to pass data
     * between middlewares.
     *
     * @type {function(Object<string, string>, function())}
     */
    this._middleware = middleware;
  }

  /**
   * Passes provided params to router middleware and runs it.
   *
   * @param {Object<string, (number|string)>=} params The route parameter values.
   * @param {object} locals Object used to pass data between middlewares.
   * @return {Promise<void>} Middleware function.
   */
  async run(params, locals) {
    return this._middleware(params, locals);
  }
}
