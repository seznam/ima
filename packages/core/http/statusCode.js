import ns from 'ima/namespace';

ns.namespace('ima.http');

/**
 * HTTP status code constants, representing the HTTP status codes recognized
 * and processed by this proxy.
 *
 * @const
 * @see http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
 */
const STATUS_CODE = Object.freeze({

	/**
	 * OK
	 *
	 * @property HTTP_STATUS_CODE.OK
	 * @type {number}
	 */
	OK: 200,

	/**
	 * Bad request
	 *
	 * @property HTTP_STATUS_CODE.BAD_REQUEST
	 * @type {number}
	 */
	BAD_REQUEST: 400,

	/**
	 * Unauthorized
	 *
	 * @property HTTP_STATUS_CODE.UNAUTHORIZED
	 * @type {number}
	 */
	UNAUTHORIZED: 401,

	/**
	 * Forbidden
	 *
	 * @property HTTP_STATUS_CODE.FORBIDDEN
	 * @type {number}
	 */
	FORBIDDEN: 403,

	/**
	 * Not found
	 *
	 * @property HTTP_STATUS_CODE.NOT_FOUND
	 * @type {number}
	 */
	NOT_FOUND: 404,

	/**
	 * Request timeout
	 *
	 * @property HTTP_STATUS_CODE.TIMEOUT
	 * @type {number}
	 */
	TIMEOUT: 408,

	/**
	 * Internal Server Error
	 *
	 * @property HTTP_STATUS_CODE.SERVER_ERROR
	 * @type {number}
	 */
	SERVER_ERROR: 500
});

export default STATUS_CODE;

ns.ima.http.STATUS_CODE = STATUS_CODE;
