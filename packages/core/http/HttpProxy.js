import HttpAgent from './HttpAgent';
import HttpStatusCode from './StatusCode';
import UrlTransformer from './UrlTransformer';
import GenericError from '../error/GenericError';
import Window from '../window/Window';

/**
 * An object representing the complete request parameters used to create and
 * send the HTTP request.
 * @typedef {Object} ProxyRequestParams
 * @property {string} method The HTTP method.
 * @property {string} url The original URL to which to make the request.
 * @property {string} transformedUrl The actual URL to which to make the
 *           request, created by applying the URL transformer to the original
 *           URL.
 * @property {Object<string, (boolean|number|string|Date)>} data The request
 *           data, sent as query or body.
 * @property {AgentRequestOptions} options The high-level request options
 *           provided by the HTTP agent.
 */

/**
 * Middleware proxy between {@linkcode HttpAgent} implementations and the
 * fetch API, providing a Promise-oriented API for sending the requests.
 */
export default class HttpProxy {

	/**
	 * Initializes the HTTP proxy.
	 *
	 * @param {UrlTransformer} transformer Transformer of URLs to which the
	 *        requests are made.
	 * @param {Window} window Helper for manipulating the global object
	 *        ({@code window}) regardless of the client/server-side
	 *        environment.
	 */
	constructor(transformer, window) {
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
	 * @param {AgentRequestOptions=} options Optional request options.
	 * @return {Promise<AgentResponse>} A promise that resolves to the server
	 *         response.
	 */
	request(method, url, data, options) {
		const requestParams = this._composeRequestParams(
			method,
			url,
			data,
			options
		);

		return new Promise((resolve, reject) => {
			const requestTimeoutId = setTimeout(() => {
				reject(new GenericError(
					'The HTTP request timed out',
					{status: HttpStatusCode.TIMEOUT}
				));
			}, options.timeout);

			const fetch = this._getFetchApi();
			fetch(
				this._composeRequestUrl(url, method === 'get' ? {} : data),
				this._composeFetchParameters(method, data, options)
			).then((response) => {
				clearTimeout(requestTimeoutId);
				return response.json().then(body => [response, body]);
			}).then(([response, responseBody]) => this._processResponse(
				requestParams,
				response,
				responseBody
			)).then(resolve, reject);
		}).catch((fetchError) => {
			throw this._processError(fetchError, requestParams);
		});
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
	 * Constructs and returns an object that describes a failed HTTP request,
	 * providing information about both the failure reported by the server and
	 * how the request has been sent to the server.
	 *
	 * @param {string} method The HTTP method used to make the request.
	 * @param {string} url The URL to which the request has been made.
	 * @param {Object<string, (boolean|number|string|Date)>} data The data sent
	 *        with the request.
	 * @param {AgentRequestOptions} options Optional request options.
	 * @param {number} status The HTTP response status code send by the server.
	 * @param {object} body The body of HTTP error response (detailed information)
	 * @param {Error} cause The low-level cause error.
	 * @return {Object<string, *>} An object containing both the details of the
	 *         error and the request that lead to it.
	 */
	getErrorParams(method, url, data, options, status, body, cause) {
		let params = this._composeRequestParams(method, url, data, options);

		if (typeof body === 'undefined') {
			body = {};
		}

		let error = { status, body, cause };

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
	 * Processes the response received from the server.
	 *
	 * @param {AgentRequestOptions} requestParams The request options provided
	 *        by the HTTP agent.
	 * @param {Response} response The fetch API response object representing
	 *        the server's response.
	 * @param {*} responseBody The server's response body.
	 * @return {AgentResponse} The server's response along with all related
	 *         metadata.
	 */
	_processResponse(requestParams, response, responseBody) {
		if (response.ok) {
			return {
				status: response.status,
				body: responseBody,
				params: requestParams,
				headers: this._headersToPlainObject(response.headers),
				cached: false
			};
		} else {
			throw new GenericError('The request failed', {
				status: response.status,
				body: responseBody
			});
		}
	}

	/**
	 * Converts the provided <code>Headers</code> object to a plain object.
	 *
	 * @param {Headers} headers The headers to convert.
	 * @return {Object<string, string>} Converted headers.
	 */
	_headersToPlainObject(headers) {
		const plainHeaders = {};
		for (const [key, value] of headers.entries()) {
			plainHeaders[key] = value;
		}
		return plainHeaders;
	}

	/**
	 * Processes the provided fetch API or internal error and creates an error
	 * to expose to the calling API.
	 *
	 * @param {Error} fetchError The internal error to process.
	 * @param {ProxyRequestParams} requestParams The parameters that were used
	 *        to create the request.
	 * @return {GenericError} The error to provide to the calling API.
	 */
	_processError(fetchError, requestParams) {
		const errorParams = fetchError instanceof GenericError ?
			fetchError.getParams()
			:
			{};
		return this._createError(
			fetchError,
			requestParams,
			errorParams.status || HttpStatusCode.SERVER_ERROR,
			errorParams.body || null
		);
	}

	/**
	 * Creates an error that represents a failed HTTP request.
	 *
	 * @param {Error} cause The error's message.
	 * @param {ProxyRequestParams} requestParams The parameters that were used
	 *        to create the request.
	 * @param {number} status Server's response HTTP status code.
	 * @param {*} responseBody The body of the server's response, if any.
	 * @return {GenericError} The error representing a failed HTTP request.
	 */
	_createError(cause, requestParams, status, responseBody = null) {
		return new GenericError(
			cause.message,
			this.getErrorParams(
				requestParams.method,
				requestParams.url,
				requestParams.data,
				requestParams.options,
				status,
				responseBody,
				cause
			)
		);
	}

	/**
	 * Return the implementation of the fetch API to use, depending on the
	 * method being used at the server (polyfill) or client (native/polyfill)
	 * side.
	 *
	 * @return {function((string|Request), Object=): Promise<Response>} The
	 *         implementation of the fetch API to use.
	 */
	_getFetchApi() {
		return this._window.isClient() ?
			this._window.getWindow().fetch
		:
			require('node-fetch');
	}

	/**
	 * Composes an object representing the HTTP request parameters from the
	 * provided arguments.
	 *
	 * @param {string} method The HTTP method to use.
	 * @param {string} url The URL to which the request should be sent.
	 * @param {Object<string, (boolean|number|string|Date)>} data The data to
	 *        send with the request.
	 * @param {AgentRequestOptions} options Optional request options.
	 * @return {ProxyRequestParams} An object representing the complete request
	 *         parameters used to create and send the HTTP request.
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

	/**
	 * Generates the second argument for the <code>fetch</code> function.
	 *
	 * @param {string } method The HTTP method to use.
	 * @param {Object<string, (boolean|number|string|Date)>} data The data to
	 *        send in the request.
	 * @param {AgentRequestOptions} options The options provided by the HTTP
	 *        agent.
	 * @return {Object} The argument for the second parameter of the
	 *         <code>fetch</code> function.
	 */
	_composeFetchParameters(method, data, options) {
		return {
			method,
			headers: options.headers,
			body: method !== 'get' ? JSON.stringify(data) : null,
			credentials: options.withCredentials ? 'include' : 'same-origin',
			redirect: 'follow'
		};
	}

	/**
	 * Transforms the provided URL using the current URL transformer and adds
	 * the provided data to the URL's query string.
	 *
	 * @param {string} url The URL to prepare for use with the fetch API.
	 * @param {Object<string, (boolean|number|string|Date)>} data Data to
	 *        attach to the query string.
	 * @return {string} The transformed URL with the provided data attached to
	 *         its query string.
	 */
	_composeRequestUrl(url, data) {
		const transformedUrl = this._transformer.transform(url);
		const queryString = Object.keys(data).map(
			key => [key, data[key]].map(encodeURIComponent).join('=')
		).join('&');

		return (
			transformedUrl +
			(transformedUrl.includes('?') ? '&' : '?') +
			queryString
		);
	}
}
