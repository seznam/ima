import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core.Http');

/**
 * Middleware proxy between {@codelink Core.Interface.Http} implementations and
 * the {@codelink Vendor.SuperAgent}, providing a Promise-oriented API for
 * sending the requests.
 *
 * @class Proxy
 * @namespace Core.Http
 * @module Core
 * @submodule Core.Http
 */
export default class Proxy {

	/**
	 * @method constructor
	 * @constructor
	 * @param {Vendor.SuperAgent} superAgent SuperAgent instance to use for
	 *        sending the HTTP requests.
	 * @param {Object} HTTP_STATUS_CODE
	 * @param {Core.Http.Transformer} transformer Transform apply rules to request url.
	 * @param {Core.Interface.Window} window Helper for manipulating the global
	 *        object ({@code window}) regardless of the client/server-side
	 *        environment.
	 */
	constructor(superAgent, HTTP_STATUS_CODE, transformer, window) {
		/**
		 * SuperAgent instance to use for sending the HTTP requests, providing
		 * uniform API across both the client-side and the server-side
		 * environments.
		 *
		 * @property _superAgent
		 * @private
		 * @type {Vendor.SuperAgent}
		 */
		this._superAgent = superAgent;

		/**
		 * HTTP status code constants.
		 *
		 * @property HTTP_STATUS_CODE
		 * @const
		 * @type {Object}
		 */
		this.HTTP_STATUS_CODE = HTTP_STATUS_CODE;

		/**
		 * @property _transformer
		 * @private
		 * @type {Core.Http.Transformer}
		 */
		this._transformer = transformer;

		/**
		 * Helper for manipulating the global object ({@code window}) regardless of
		 * the client/server-side environment.
		 *
		 * @property _window
		 * @private
		 * @type {Core.Interface.Window}
		 */
		this._window = window;

		/**
		 * The default HTTP headers to include with the HTTP requests, unless
		 * overridden.
		 *
		 * @property _defaultHeaders
		 * @private
		 * @type {Map<string, string>}
		 */
		this._defaultHeaders = new Map();
	}

	/**
	 * Executes an HTTP request to the specified URL using the specified HTTP
	 * method, carrying the provided data.
	 *
	 * @method request
	 * @private
	 * @param {string} method The HTTP method to use.
	 * @param {string} url The URL to which the request should be made.
	 * @param {Object<string, (boolean|number|string|Date)>} data The data to
	 *        send to the server. The data will be included as query parameters
	 *        if the request method is set to {@code GET}, and as request body
	 *        for any other request method.
	 * @param {Object<string, *>} options The options used to
	 *        create the request.
	 * @return {Promise<Vendor.SuperAgent.Response>} A promise that resolves to
	 *         the server response. The promise rejects on failure with an error
	 *         and request descriptor object instead of an {@codelink Error}
	 *         instance.
	 */
	request(method, url, data, options) {
		return (
			new Promise((resolve, reject) => {
				var params = this._composeRequestParams(method, url, data, options);

				if (method === 'delete') {
					method = 'del';
				}
				var request = this._superAgent[method](params.transformedUrl);

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
	 * Sets the specified default HTTP header. The header will be sent with all
	 * subsequent HTTP requests unless reconfigured using this method, overridden
	 * by the request options, or cleared by the {@codelink clearDefaultHeaders}
	 * method.
	 *
	 * @method setDefaultHeader
	 * @param {string} header The header name.
	 * @param {string} value The header value.
	 */
	setDefaultHeader(header, value) {
		this._defaultHeaders.set(header, value);
	}


	/**
	 * Clears all defaults headers sent with all requests.
	 *
	 * @method clearDefaultHeaders
	 */
	clearDefaultHeaders() {
		this._defaultHeaders.clear();
	}

	/**
	 * Constructs and returns an object that describes a failed HTTP requets,
	 * providing information about both the failure reported by the server and
	 * how the request has been sent to the server.
	 *
	 * @method getErrorParams
	 * @param {string} method The HTTP method used to make the request.
	 * @param {string} url The URL to which the request has been made.
	 * @param {Object<string, (boolean|number|string|Date)>} data The data sent
	 *        with the request.
	 * @param {Object<string, *>} options The options used to
	 *        create the request.
	 * @param {number} status The HTTP response status code send by the server.
	 * @return {Object<string, *>} An object containing both the details of the
	 *         error and the request that lead to it.
	 */
	getErrorParams(method, url, data, options, status) {
		var params = this._composeRequestParams(method, url, data, options);
		var error = {status};

		switch (status) {
			case this.HTTP_STATUS_CODE.TIMEOUT:
				error.errorName = 'Timeout';
				break;
			case this.HTTP_STATUS_CODE.BAD_REQUEST:
				error.errorName = 'Bad Request';
				break;
			case this.HTTP_STATUS_CODE.UNAUTHORIZED:
				error.errorName = 'Unauthorized';
				break;
			case this.HTTP_STATUS_CODE.FORBIDDEN:
				error.errorName = 'Forbidden';
				break;
			case this.HTTP_STATUS_CODE.NOT_FOUND:
				error.errorName = 'Not Found';
				break;
			case this.HTTP_STATUS_CODE.SERVER_ERROR:
				error.errorName = 'Internal Server Error';
				break;
			default:
				error.errorName = 'Unknown';
				break;
		}

		return Object.assign(error, params);
	}

	/**
	 * Returns {@code true} if the cookies have to be processed manually by
	 * setting the {@code Cookie} HTTP header on requests and parsing the
	 * {@code Set-Cookie} HTTP response header.
	 *
	 * The result of this method depends on the current application environment,
	 * the client-side usually handles cookie processing automatically, leading
	 * this method returning {@code false}.
	 *
	 * At the client-side, the method tests whether the client has cookies
	 * enabled (which results in cookies being automatically processed by the
	 * browser), and returns {@code true} or {@code false} accordingly.
	 *
	 * @method haveToSetCookiesManually
	 * @return {boolean} {@code true} if the cookies are not processed
	 *         automatically by the environment and have to be handled manually
	 *         by parsing response headers and setting request headers.
	 */
	haveToSetCookiesManually() {
		return !this._window.isCookieEnabled();
	}

	/**
	 * Send the provided request to the server. The method then executes either
	 * the provided promise resolution or rejection callback depending on the
	 * request outcome.
	 *
	 * @method _sendRequest
	 * @private
	 * @chainable
	 * @param {Vendor.SuperAgent.Request} request The request to send.
	 * @param {function(Vendor.SuperAgent.Response)} resolve Promise resolution
	 *        callback to call if the request completes successfuly.
	 * @param {function(Object<string, *>)} reject Promise rejection callback to
	 *        call if the request fails with an error.
	 * @param {{method: string, url: string, data: Object<string, (boolean|number|string|Date)>,
	 *        options: Object<string, *>} params An object representing the complete
	 *        request parameters used to create and send the HTTP request.
	 * @return {Core.Http.Proxy} This instance.
	 */
	_sendRequest(request, resolve, reject, params) {
		request.end((error, response) => {

			if (error) {
				this._handleError(error, reject, params);
			} else {
				this._handleResponse(response, resolve, reject, params);
			}

		});

		return this;
	}

	/**
	 * Processes a finished HTTP request. The method determines whether the
	 * request has been completed successfuly and resolves or rejects the promise
	 * representing the request using the provided resolution and rejection
	 * callbacks accordingly.
	 *
	 * @method _handleResponse
	 * @private
	 * @param {Vendor.SuperAgent.Response} response The response object
	 *        representing the server response.
	 * @param {function(Vendor.SuperAgent.Response)} resolve Promise resolution
	 *        callback to call if the request has been completed successfuly.
	 * @param {function(Object<string, *>)} reject Promise rejection callback to
	 *        call if the request failed with an error.
	 * @param {{method: string, url: string, data: Object<string, (boolean|number|string|Date)>,
	 *        options: Object<string, *>} params An object representing the complete
	 *        request parameters used to create and send the HTTP request.
	 */
	_handleResponse(response, resolve, reject, params) {
		if (response.error) {
			var errorParams = this.getErrorParams(params.method, params.url,
				params.data, params.options, response.status);

			reject(errorParams);
		} else {
			params.status = this.HTTP_STATUS_CODE.OK;
			response.params = params;

			resolve(response);
		}
	}

	/**
	 * Processes an error encountered during an HTTP request. The method
	 * processes the error, constructs an object describing the request and the
	 * error, and passes the created object to the provided promise rejection
	 * callback to reject the promise representing the said HTTP request.
	 *
	 * @method _handleError
	 * @private
	 * @param {Vendor.SuperAgent.Error} error The encountered error. The paramter
	 *        is actually an {@codelink Error} instance augmented with fields
	 *        providing additional details (timeout, HTTP status code, etc.).
	 * @param {function(Object<string, *>)} reject Promise rejection callback to
	 *        call.
	 * @param {{method: string, url: string, data: Object<string, (boolean|number|string|Date)>,
	 *        options: Object<string, *>} params An object representing the complete
	 *        request parameters used to create and send the HTTP request.
	 */
	_handleError(error, reject, params) {
		var errorParams = {};

		if (error.timeout === params.options.timeout) {
			errorParams = this.getErrorParams(params.method, params.url, params.data,
				params.options, this.HTTP_STATUS_CODE.TIMEOUT);
		} else {

			if (error.crossDomain) {
				errorParams = this.getErrorParams(params.method, params.url,
					params.data, params.options, this.HTTP_STATUS_CODE.FORBIDDEN);
			} else {
				errorParams = this.getErrorParams(params.method, params.url,
					params.data, params.options, error.status || this.HTTP_STATUS_CODE.SERVER_ERROR);
			}

		}

		reject(errorParams);
	}

	/**
	 * Applies the specified options on the provided request as HTTP headers.
	 *
	 * @method _setHeaders
	 * @private
	 * @chainable
	 * @param {Vendor.SuperAgent.Request} request The request on which the HTTP
	 *        headers should be set.
	 * @param {Object<string, *>} options The options used to
	 *        create the request.
	 * @return {Core.Http.Proxy} This instance.
	 */
	_setHeaders(request, options) {
		for (var [headerName, headerValue] of this._defaultHeaders) {
			request.set(headerName, headerValue);
		}

		for (var headerName of Object.keys(options.headers)) {
			request.set(headerName, options.headers[headerName]);
		}

		if (this.haveToSetCookiesManually()) {
			request.set('Cookie', options.cookie);
		}

		return this;
	}

	/**
	 * Composes an object representing the HTTP request parameters from the
	 * provided arguments.
	 *
	 * @method _composeRequestParams
	 * @private
	 * @param {string} method The HTTP method to use.
	 * @param {string} url The URL to which the request should be sent.
	 * @param {Object<string, (boolean|number|string|Date)>} data The data to
	 *        send with the request.
	 * @param {Object<string, *>} options The options used to
	 *        create the request.
	 * @return {{method: string, url: string, data: Object<string, (boolean|number|string|Date)>,
	 *         options: {headers: Object<string, string>, cookie: string}}}
	 *         An object representing the complete request parameters used to
	 *         create and send the HTTP request.
	 */
	_composeRequestParams(method, url, data, options) {
		return {
			method,
			url,
			transformedUrl: this._transformer.transform(url),
			data,
			options
		};
	}
}

ns.Core.Http.Proxy = Proxy;
