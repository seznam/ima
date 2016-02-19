import ns from 'ima/core/namespace';

ns.namespace('Core.Router');

/**
 * HTTP status code constants, representing the HTTP status codes recognized
 * and processed by this proxy.
 *
 * @const
 * @see http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
 */
const ROUTE_NAMES = Object.freeze({
	/**
	 * The internal route name used for the "not found" error page (the 4XX
	 * HTTP status code error page).
	 *
	 * @const
	 * @property NOT_FOUND
	 * @type {string}
	 */
	NOT_FOUND: 'notFound',

	/**
	 * The internal route name used for the error page (the 5XX HTTP status
	 * code error page).
	 *
	 * @const
	 * @property ERROR
	 * @type {string}
	 */
	ERROR: 'error'
});

export default ROUTE_NAMES;

ns.Core.Router.ROUTE_NAMES = ROUTE_NAMES;
