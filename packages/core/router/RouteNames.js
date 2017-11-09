/**
 * HTTP status code constants, representing the HTTP status codes recognized
 * and processed by this proxy.
 *
 * @enum {string}
 * @see http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
 */
const RouteNames = Object.freeze({
  /**
	 * The internal route name used for the "not found" error page (the 4XX
	 * HTTP status code error page).
	 *
	 * @const
	 * @type {string}
	 */
  NOT_FOUND: 'notFound',

  /**
	 * The internal route name used for the error page (the 5XX HTTP status
	 * code error page).
	 *
	 * @const
	 * @type {string}
	 */
  ERROR: 'error'
});

export default RouteNames;
