import ns from '../namespace';

ns.namespace('ima.http');

/**
 * HTTP status code constants, representing the HTTP status codes recognized
 * and processed by this proxy.
 *
 * @enum {number}
 * @const
 * @see http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
 */
const StatusCode = Object.freeze({
  /**
	 * OK
	 *
	 * @type {number}
	 */
  OK: 200,

  /**
	 * No content
	 *
	 * @type {number}
	 */
  NO_CONTENT: 203,

  /**
	 * Bad request
	 *
	 * @type {number}
	 */
  BAD_REQUEST: 400,

  /**
	 * Unauthorized
	 *
	 * @type {number}
	 */
  UNAUTHORIZED: 401,

  /**
	 * Forbidden
	 *
	 * @type {number}
	 */
  FORBIDDEN: 403,

  /**
	 * Not found
	 *
	 * @type {number}
	 */
  NOT_FOUND: 404,

  /**
	 * Request timeout
	 *
	 * @type {number}
	 */
  TIMEOUT: 408,

  /**
	 * Internal Server Error
	 *
	 * @type {number}
	 */
  SERVER_ERROR: 500
});

export default StatusCode;

ns.ima.http.StatusCode = StatusCode;
