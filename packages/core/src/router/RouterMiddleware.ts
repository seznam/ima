import GenericError from '../error/GenericError';

/**
 * Utility for representing and running router middleware.
 */
export default class RouterMiddleware {
  protected _middleware: (
    params: { [key: string]: string | number },
    locals: object
  ) => unknown;
  /**
   * Initializes the middleware
   *
   * @param {function(Object<string, string>, object)} middleware Middleware
   *        function accepting routeParams as a first argument, which can be mutated
   *        and `locals` object as second argument. This can be used to pass data
   *        between middlewares.
   */
  constructor(
    middleware: (
      params: { [key: string]: string | number },
      locals: object
    ) => unknown
  ) {
    if (typeof middleware !== 'function') {
      throw new GenericError(
        `The middleware must be a function, '${typeof middleware}' was given.`
      );
    }

    /**
     * Middleware function accepting `routeParams` as a first argument, which can be
     * mutated and `locals` object as second argument. This can be used to pass data
     * between middlewares.
     *
     * @type {function(Object<string, string>, object)}
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
  async run(params: { [key: string]: number | string }, locals: object) {
    return this._middleware(params, locals);
  }
}
