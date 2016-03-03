import ns from 'ima/namespace';

ns.namespace('ima.router');

/**
 * HTTP status code constants, representing the HTTP status codes recognized
 * and processed by this proxy.
 *
 * @enum
 * @property RouteNames
 * @see http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
 */
const RouteNames = Object.freeze({
	/**
	 * The internal route name used for the "not found" error page (the 4XX
	 * HTTP status code error page).
	 *
	 * @const
	 * @property RouteNames.NOT_FOUND
	 * @type {string}
	 */
	NOT_FOUND: 'notFound',

	/**
	 * The internal route name used for the error page (the 5XX HTTP status
	 * code error page).
	 *
	 * @const
	 * @property RouteNames.ERROR
	 * @type {string}
	 */
	ERROR: 'error'
});

export default RouteNames;

ns.ima.router.RouteNames = RouteNames;
