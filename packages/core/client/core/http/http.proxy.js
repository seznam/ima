import ns from 'core/namespace/ns.js';

ns.namespace('Core.Http');

/**
 * Proxy for SuperAgent.
 *
 * @class Proxy
 * @namespace Core.Http
 * @module Core
 * @submodule Core.Http
 */
class Proxy {

	/**
	 * @method constructor
	 * @constructor
	 * @param {Vendor.SuperAgent} superAgent
	 * @param {Promise} promise
	 */
	constructor(superAgent, promise) {

		/**
		 * @property _superAgent
		 * @private
		 * @type {Vendor.SuperAgent}
		 * @default superAgent
		 */
		this._superAgent = superAgent;

		/**
		 * @property _promise
		 * @type {Promise}
		 * @default promise
		 */
		this.promise = promise;

		/**
		 * @property _constantHeaders
		 * @private
		 * @type {Map}
		 * @default new Map()
		 */
		this._constantHeaders = new Map();

		/**
		 * @property HTTP_TIMEOUT
		 * @const
		 * @type {Number}
		 * @default 408
		 */
		this.HTTP_TIMEOUT = 408;

		/**
		 * @property HTTP_UNAUTHORIZED
		 * @const
		 * @type {Number}
		 * @default 401
		 */
		this.HTTP_UNAUTHORIZED = 401;

		/**
		 * @property HTTP_FORBIDDEN
		 * @const
		 * @type {Number}
		 * @default 403
		 */
		this.HTTP_FORBIDDEN = 403;

		/**
		 * @property HTTP_SERVER_ERROR
		 * @const
		 * @type {Number}
		 * @default 500
		 */
		this.HTTP_SERVER_ERROR = 500;

		/**
		 * @property HTTP_OK
		 * @const
		 * @type {Number}
		 * @default 200
		 */
		this.HTTP_OK = 200;
	}

	/**
	 * Make request for server.
	 *
	 * @method request
	 * @private
	 * @param {String} method
	 * @param {String} url
	 * @param {Object} data
	 * @param {Object} options - keys {timeout, ttl, repeatRequest, language, cookie, accept}
	 * @return {Promise}
	 */
	request(method, url, data, options) {
		return (
			new this.promise((resolve, reject) => {

				var params = this._getParams(method, url, data, options);

				var request = this._superAgent[method](url);

				if (method === 'get') {
					request.query(data);
				} else {
					request.send(data);
				}

				request.timeout(options.timeout);

				this
					._setHeaders(request, options)
					._sendRequest(request, resolve, reject, params);
			})
		);
	}

	/**
	 * Set constant header to all request.
	 *
	 * @method setConstantHeader
	 * @param {String} header
	 * @param {String} value
	 */
	setConstantHeader(header, value) {
		this._constantHeaders.set(header, value);
	}


	/**
	 * Clear constant header to all request.
	 *
	 * @method clearConstantHeader
	 */
	clearConstantHeader() {
		this._constantHeaders.clear();
	}

	/**
	 * Request error handler.
	 *
	 * @method _requestErrorHandler
	 * @private
	 * @param {Object} error
	 * @param {Function} reject
	 * @param {Object} params
	 */
	_requestErrorHandler(error, reject, params) {
		var errorParams = {};

		if (error.timeout === params.options.timeout) {
			errorParams = this.getErrorParams(params.method, params.url, params.data, params.options, this.HTTP_TIMEOUT);
		} else {

			if (error.crossDomain) {
				errorParams = this.getErrorParams(params.method, params.url, params.data, params.options, this.HTTP_FORBIDDEN);
			} else {
				errorParams = this.getErrorParams(params.method, params.url, params.data, params.options, this.HTTP_SERVER_ERROR);
			}

		}

		reject(errorParams);
	}

	/**
	 * Request respond handler
	 *
	 * @method _requestRespondHandler
	 * @private
	 * @param {Object} respond
	 * @param {Function} resolve
	 * @param {Function} reject
	 * @param {Object} params
	 */
	_requestRespondHandler(respond, resolve, reject, params) {
		if (respond.error) {
			var errorParams = this.getErrorParams(params.method, params.url, params.data, params.options, respond.status);
			reject(errorParams);
		} else {
			params.status = this.HTTP_OK;
			respond.params = params;
			resolve(respond);
		}
	}

	/**
	 * Get params for error.
	 *
	 * @method getErrorParams
	 * @param {String} method
	 * @param {String} url
	 * @param {Object} data
	 * @param {Object} options
	 * @param {Number} status
	 * @param {Object} {method, url, data, options, status, errorName}
	 */
	getErrorParams(method, url, data, options, status) {
		var params = this._getParams(method, url, data, options);

		var error = {status};

		switch(status) {
			case this.HTTP_TIMEOUT:
				error.errorName = 'Timeout';
				break;
			case this.HTTP_UNAUTHORIZED:
				error.errorName = 'Unauthorized';
				break;
			case this.HTTP_FORBIDDEN:
				error.errorName = 'Forbidden';
				break;
			case this.HTTP_SERVER_ERROR:
				error.errorName = 'Internal Server Error';
				break;
			default:
				error.errorName = 'Unknown';
				break;
		}

		return Object.assign(error, params);
	}


	/**
	 * Send request to server.
	 *
	 * @method _sendRequest
	 * @private
	 * @chainable
	 * @param {Vendor.SuperAgent.Request} request
	 * @param {Function} resolve
	 * @param {Function} reject
	 * @param {Object} params
	 * @return {this}
	 */
	_sendRequest(request, resolve, reject, params) {
		request.end((error, respond) => {

			if (error) {
				this._requestErrorHandler(error, reject, params)
			} else {
				this._requestRespondHandler(respond, resolve, reject, params);
			}

		});

		return this;
	}

	/**
	 * Set headers to request.
	 *
	 * @method _setHeaders
	 * @private
	 * @chainable
	 * @param {Vendor.SuperAgent.Request} request
	 * @param {Object} options
	 * @return {this}
	 */
	_setHeaders(request, options) {
		request.set('Accept', options.accept);
		request.set('Accept-Language', options.language);

		if (this.haveSetCookieManually()) {
			request.set('Cookie', options.cookie);
		}

		for (var [headerName, headerValue] of this._constantHeaders) {
			request.set(headerName, headerValue);
		}

		return this;
	}

	/**
	 * Have set cookie manually.
	 *
	 * @method haveSetCookieManually
	 * @return {Boolean}
	 */
	haveSetCookieManually() {
		return typeof window === 'undefined' || window === null;
	}

	/**
	 * Get params to request.
	 *
	 * @method _getParams
	 * @private
	 * @param {String} method
	 * @param {String} url
	 * @param {Object} data
	 * @param {Object} options
	 */
	_getParams(method, url, data, options) {
		return {method, url, data, options};
	}
}

ns.Core.Http.Proxy = Proxy;