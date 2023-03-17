/**
 * HTTP status code constants, representing the HTTP status codes recognized
 * and processed by this proxy.
 */
export enum RouteNames {
  /**
   * The internal route name used for the "not found" error page (the 4XX
   * HTTP status code error page).
   */
  NOT_FOUND = 'notFound',

  /**
   * The internal route name used for the error page (the 5XX HTTP status
   * code error page).
   */
  ERROR = 'error',
}
