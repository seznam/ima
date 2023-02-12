import { GenericError } from '../error/GenericError';

export type MiddleWareFunction = (
  params: { [key: string]: string | number },
  locals: Record<string, unknown>
) => unknown;

/**
 * Utility for representing and running router middleware.
 */
export class RouterMiddleware {
  protected _middleware: MiddleWareFunction;
  /**
   * Initializes the middleware
   *
   * @param middleware Middleware
   *        function accepting routeParams as a first argument, which can be mutated
   *        and `locals` object as second argument. This can be used to pass data
   *        between middlewares.
   */
  constructor(middleware: MiddleWareFunction) {
    if (typeof middleware !== 'function') {
      throw new GenericError(
        `The middleware must be a function, '${typeof middleware}' was given.`
      );
    }

    /**
     * Middleware function accepting `routeParams` as a first argument, which can be
     * mutated and `locals` object as second argument. This can be used to pass data
     * between middlewares.
     */
    this._middleware = middleware;
  }

  /**
   * Passes provided params to router middleware and runs it.
   *
   * @param params The route parameter values.
   * @param locals Object used to pass data between middlewares.
   * @return Middleware function.
   */
  async run(
    params: { [key: string]: number | string },
    locals: Record<string, unknown>
  ) {
    return this._middleware(params, locals);
  }
}
