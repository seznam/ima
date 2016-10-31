import ns from '../namespace';
import HttpAgent from './HttpAgent';
import HttpStatusCode from './StatusCode';
import UrlTransformer from './UrlTransformer';
import Window from '../window/Window';

ns.namespace('ima.http');

/**
 * Middleware proxy between {@linkcode HttpAgent} implementations and the
 * {@linkcode Vendor.SuperAgent}, providing a Promise-oriented API for sending
 * the requests.
 */
export default class HttpProxy {

	/**
	 * Initializes the HTTP proxy.
	 *
	 * @param {vendor.SuperAgent} superAgent SuperAgent instance to use for
	 *        sending the HTTP requests.
	 * @param {UrlTransformer} transformer Transformer of URLs to which the
	 *        requests are made.
	 * @param {Window} window Helper for manipulating the global object
	 *        ({@code window}) regardless of the client/server-side
	 *        environment.
	 */
	constructor(superAgent, transformer, window) {
		/**
		 * SuperAgent instance to use for sending the HTTP requests, providing
		 * uniform API across both the client-side and the server-side
		 * environments.
		 *
		 * @type {vendor.SuperAgent}
		 */
		this._superAgent = superAgent;

		/**
		 * Transformer of URLs to which the requests are made.
		 *
		 * @type {UrlTransformer}
		 */
		this._transformer = transformer;

		/**
		 * Helper for manipulating the global object ({@code window})
		 * regardless of the client/server-side environment.
		 *
		 * @type {Window}
		 */
		this._window = window;

		/**
		 * The default HTTP headers to include with the HTTP requests, unless
		 * overridden.
		 *
		 * @type {Map<string, string>}
		 */
		this._defaultHeaders = new Map();
	}

	/**
	 * Executes an HTTP request to the specified URL using the specified HTTP
	 * method, carrying the provided data.
	 *
	 * @param {string} method The HTTP method to use.
	 * @param {string} url The URL to which the request should be made.
	 * @param {Object<string, (boolean|number|string|Date)>} data The data to
	 *        send to the server. The data will be included as query parameters
	 *        if the request method is set to {@code GET}, and as request body
	 *        for any other request method.
	 * @param {{
	 *          timeout: number=,
	 *          ttl: number=,
	 *          repeatRequest: number=,
	 *          headers: Object<string, string>=,
	 *          cache: boolean=,
	 *          withCredentials: boolean
	 *        }=} options Optional request options. The {@code timeout}
	 *        specifies the request timeout in milliseconds, the {@code ttl}
	 *        specified how long the request may be cached in milliseconds, the
	 *        {@code repeatRequest} specifies the maximum number of tries to
	 *        repeat the request if the request fails, The {@code headers} set
	 *        request headers. The {@code cache} can be used to bypass the
	 *        cache of pending and finished HTTP requests. The
	 *        {@code withCredentials} that indicates whether requests should be
	 *        made using credentials such as cookies or authorization headers.
	 * @return {Promise<Vendor.SuperAgent.Response>} A promise that resolves to
	 *         the server response. The promise rejects on failure with an
	 *         error and request descriptor object instead of an
	 *         {@codelink Error} instance.
	 */
	request(method, url, data, options) {
		return (
			new Promise((resolve, reject) => {
				let params = this._composeRequestParams(
					method,
					url,
					data,
					options
				);

				if (method === 'delete') {
					method = 'del';
				}
				let request = this._superAgent[method](params.transformedUrl);

				if (method === 'get') {
					request.query(data);
				} else {
					request.send(data);
				}

				request.timeout(options.timeout);

				this
					._setHeaders(request, options)
					._setCredentials(request, options)
					._sendRequest(request, resolve, reject, params);
			})
		);
	}

	/**
	 * Sets the specified default HTTP header. The header will be sent with all
	 * subsequent HTTP requests unless reconfigured using this method,
	 * overridden by the request options, or cleared by the
	 * {@codelink clearDefaultHeaders} method.
	 *
	 * @param {string} header The header name.
	 * @param {string} value The header value.
	 */
	setDefaultHeader(header, value) {
		this._defaultHeaders.set(header, value);
	}


	/**
	 * Clears all defaults headers sent with all requests.
	 */
	clearDefaultHeaders() {
		this._defaultHeaders.clear();
	}

	/**
	 * Constructs and returns an object that describes a failed HTTP requests,
	 * providing information about both the failure reported by the server and
	 * how the request has been sent to the server.
	 *
	 * @param {string} method The HTTP method used to make the request.
	 * @param {string} url The URL to which the request has been made.
	 * @param {Object<string, (boolean|number|string|Date)>} data The data sent
	 *        with the request.
	 * @param {{timeout: number=, ttl: number=, repeatRequest: number=,
	 *        headers: Object<string, string>=, cache: boolean=,
	 *        withCredentials: boolean}=} options
	 *        Optional request options. The {@code timeout} specifies the
	 *        request timeout in milliseconds, the {@code ttl} specified how
	 *        long the request may be cached in milliseconds, the
	 *        {@code repeatRequest} specifies the maximum number of tries to
	 *        repeat the request if the request fails, The {@code headers} set
	 *        request headers. The {@code cache} can be used to bypass the
	 *        cache of pending and finished HTTP requests. The
	 *        {@code withCredentials} that indicates whether requests should be
	 *        made using credentials such as cookies or authorization headers.
	 * @param {number} status The HTTP response status code send by the server.
	 * @param {object} body The body of HTTP error response (detailed information)
	 * @return {Object<string, *>} An object containing both the details of the
	 *         error and the request that lead to it.
	 */
	getErrorParams(method, url, data, options, status, body) {
		let params = this._composeRequestParams(method, url, data, options);

		if (typeof body === 'undefined') {
			body = {};
		}

		let error = { status, body };

		switch (status) {
			case HttpStatusCode.TIMEOUT:
				error.errorName = 'Timeout';
				break;
			case HttpStatusCode.BAD_REQUEST:
				error.errorName = 'Bad Request';
				break;
			case HttpStatusCode.UNAUTHORIZED:
				error.errorName = 'Unauthorized';
				break;
			case HttpStatusCode.FORBIDDEN:
				error.errorName = 'Forbidden';
				break;
			case HttpStatusCode.NOT_FOUND:
				error.errorName = 'Not Found';
				break;
			case HttpStatusCode.SERVER_ERROR:
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
	 * The result of this method depends on the current application
	 * environment, the client-side usually handles cookie processing
	 * automatically, leading this method returning {@code false}.
	 *
	 * At the client-side, the method tests whether the client has cookies
	 * enabled (which results in cookies being automatically processed by the
	 * browser), and returns {@code true} or {@code false} accordingly.
	 *
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
	 * @param {Vendor.SuperAgent.Request} request The request to send.
	 * @param {function(Vendor.SuperAgent.Response)} resolve Promise resolution
	 *        callback to call if the request completes successfully.
	 * @param {function(Object<string, *>)} reject Promise rejection callback
	 *        to call if the request fails with an error.
	 * @param {{method: string, url: string, data: Object<string, (boolean|number|string|Date)>, options: Object<string, *>}} params
	 *        An object representing the complete request parameters used to
	 *        create and send the HTTP request.
	 * @return {HttpProxy} This instance.
	 */
	_sendRequest(request, resolve, reject, params) {
		request.end((error, response) => {
			if (error) {
				this._handleError(error, response, reject, params);
			} else {
				this._handleResponse(response, resolve, reject, params);
			}
		});

		return this;
	}

	/**
	 * Processes a finished HTTP request. The method determines whether the
	 * request has been completed successfuly and resolves or rejects the
	 * promise representing the request using the provided resolution and
	 * rejection callbacks accordingly.
	 *
	 * @param {Vendor.SuperAgent.Response} response The response object
	 *        representing the server response.
	 * @param {function(Vendor.SuperAgent.Response)} resolve Promise resolution
	 *        callback to call if the request has been completed successfuly.
	 * @param {function(Object<string, *>)} reject Promise rejection callback
	 *        to call if the request failed with an error.
	 * @param {{
	 *          method: string,
	 *          url: string,
	 *          data: Object<string, (boolean|number|string|Date)>,
	 *          options: Object<string, *>
	 *        }} params An object representing the complete request parameters
	 *        used to create and send the HTTP request.
	 */
	_handleResponse(response, resolve, reject, params) {
		if (response.error) {
			if (! 'body' in response) {
				response.body = {}
			}

			var errorParams = this.getErrorParams(
				params.method,
				params.url,
				params.data,
				params.options,
				response.status,
				response.body
			);

			reject(errorParams);
		} else {
			params.status = HttpStatusCode.OK;
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
	 * @param {Vendor.SuperAgent.Error} error The encountered error. The
	 *        parameter is actually an {@codelink Error} instance augmented
	 *        with fields providing additional details (timeout, HTTP status
	 *        code, etc.).
	 * @param {function(Object<string, *>)} reject Promise rejection callback
	 *        to call.
	 * @param {{
	 *          method: string,
	 *          url: string,
	 *          data: Object<string, (boolean|number|string|Date)>,
	 *          options: Object<string, *>
	 *        }} params An object representing the complete request parameters
	 *        used to create and send the HTTP request.
	 */
	_handleError(error, response, reject, params) {
		if (typeof response === 'undefined') {
			response = {}
		}

		if (!('body' in response)) {
			response.body = {}
		}

		let statusCode = 0;

		if (error.timeout === params.options.timeout) {
			statusCode = HttpStatusCode.TIMEOUT;
		} else {
			if (error.crossDomain) {
				statusCode = HttpStatusCode.FORBIDDEN;
			} else {
				statusCode = error.status || HttpStatusCode.SERVER_ERROR;
			}
		}

		let errorParams = this.getErrorParams(
			params.method,
			params.url,
			params.data,
			params.options,
			statusCode,
			response.body
		);

		reject(errorParams);
	}

	/**
	 * Applies the specified options on the provided request as HTTP headers.
	 *
	 * @param {Vendor.SuperAgent.Request} request The request on which the HTTP
	 *        headers should be set.
	 * @param {{
	 *          timeout: number=,
	 *          ttl: number=,
	 *          repeatRequest: number=,
	 *          headers: Object<string, string>=,
	 *          cache: boolean=,
	 *          withCredentials: boolean
	 *        }=} options Optional request options. The {@code timeout}
	 *        specifies the request timeout in milliseconds, the {@code ttl}
	 *        specified how long the request may be cached in milliseconds, the
	 *        {@code repeatRequest} specifies the maximum number of tries to
	 *        repeat the request if the request fails, The {@code headers} set
	 *        request headers. The {@code cache} can be used to bypass the
	 *        cache of pending and finished HTTP requests. The
	 *        {@code withCredentials} that indicates whether requests should be
	 *        made using credentials such as cookies or authorization headers.
	 * @return {HttpProxy} This instance.
	 */
	_setHeaders(request, options) {
		for (let [headerName, headerValue] of this._defaultHeaders) {
			request.set(headerName, headerValue);
		}

		for (let headerName of Object.keys(options.headers)) {
			request.set(headerName, options.headers[headerName]);
		}

		if (this.haveToSetCookiesManually()) {
			request.set('Cookie', options.cookie);
		}

		return this;
	}

	/**
	 * Whether options withCredentials is set to true that indicates whether or
	 * not cross-site Access-Control requests should be made using credentials
	 * such as cookies or authorization headers.
	 *
	 * @param {Vendor.SuperAgent.Request} request The request on which the HTTP
	 *        headers should be set.
	 * @param {{
	 *          timeout: number=,
	 *          ttl: number=,
	 *          repeatRequest: number=,
	 *          headers: Object<string, string>=,
	 *          cache: boolean=,
	 *          withCredentials: boolean
	 *        }=} options Optional request options. The {@code timeout}
	 *        specifies the request timeout in milliseconds, the {@code ttl}
	 *        specified how long the request may be cached in milliseconds, the
	 *        {@code repeatRequest} specifies the maximum number of tries to
	 *        repeat the request if the request fails, The {@code headers} set
	 *        request headers. The {@code cache} can be used to bypass the
	 *        cache of pending and finished HTTP requests. The
	 *        {@code withCredentials} that indicates whether requests should be
	 *        made using credentials such as cookies or authorization headers.
	 * @return {HttpProxy} This instance.
	 */
	_setCredentials(request, options) {
		if (options.withCredentials && request.withCredentials) {
			request.withCredentials();
		}

		return this;
	}

	/**
	 * Composes an object representing the HTTP request parameters from the
	 * provided arguments.
	 *
	 * @param {string} method The HTTP method to use.
	 * @param {string} url The URL to which the request should be sent.
	 * @param {Object<string, (boolean|number|string|Date)>} data The data to
	 *        send with the request.
	 * @param {{
	 *          timeout: number=,
	 *          ttl: number=,
	 *          repeatRequest: number=,
	 *          headers: Object<string, string>=,
	 *          cache: boolean=,
	 *          withCredentials: boolean
	 *        }=} options Optional request options. The {@code timeout}
	 *        specifies the request timeout in milliseconds, the {@code ttl}
	 *        specified how long the request may be cached in milliseconds, the
	 *        {@code repeatRequest} specifies the maximum number of tries to
	 *        repeat the request if the request fails, The {@code headers} set
	 *        request headers. The {@code cache} can be used to bypass the
	 *        cache of pending and finished HTTP requests. The
	 *        {@code withCredentials} that indicates whether requests should be
	 *        made using credentials such as cookies or authorization headers.
	 * @return {{
	 *           method: string,
	 *           url: string,
	 *           transformedUrl:  string,
	 *           data: Object<string, (boolean|number|string|Date)>,
	 *           options: {
	 *             headers: Object<string, string>,
	 *             cookie: string
	 *           }
	 *         }} An object representing the complete request parameters used
	 *         to create and send the HTTP request.
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

ns.ima.http.SuperAgentProxy = HttpProxy;
