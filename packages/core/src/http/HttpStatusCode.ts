/**
 * HTTP status code constants, representing the HTTP status codes recognized
 * and processed by this proxy.
 *
 * @enum {number}
 * @const
 * @see http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
 */
export const HttpStatusCode = Object.freeze({
  OK: 200,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TIMEOUT: 408,
  SERVER_ERROR: 500,
});
