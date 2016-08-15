import ns from '../namespace';

ns.namespace('ima.http');

/**
 * The {@codelink HttpAgent} defines unifying API for sending HTTP requests at
 * both client-side and server-side.
 *
 * @interface HttpAgent
 * @namespace ima.http
 * @module ima
 * @submodule ima.http
 */
export default class HttpAgent {
	/**
	 * Sends an HTTP GET request to the specified URL, sending the provided
	 * data as query parameters.
	 *
	 * @method get
	 * @param {string} url The URL to which the request should be made.
	 * @param {Object<string, (boolean|number|string)>} data The data to send
	 *        to the server as query parameters.
	 * @param {{timeout: number=, ttl: number=, repeatRequest: number=,
	 *        headers: Object<string, string>=, cache: boolean=,
	 *        withCredentials: boolean}=} options
	 *        Optional request options. The {@code timeout} specifies the
	 *        request timeout in milliseconds, the {@code ttl} specified how
	 *        long the request may be cached in milliseconds, the
	 *        {@code repeatRequest} specifies the maximum number of tries to
	 *        repeat the request if the request fails. The {@code headers}
	 *        field sets the additional request headers (the keys are
	 *        case-insensitive header names, the values are header values). The
	 *        {@code cache} flag enables caching the HTTP request (enabled by
	 *        default, also applies to requests in progress). The
	 *        {@code withCredentials} flag indicates whether the request should
	 *        be made using credentials such as cookies or authorization
	 *        headers.
	 * @return {Promise<{
	 *             status: number,
	 *             body: *,
	 *             params: {
	 *                 method: string,
	 *                 url: string,
	 *                 transformedUrl: string,
	 *                 data: Object<string, (boolean|number|string)>
	 *             },
	 *             headers: Object<string, string>,
	 *             cached: boolean
	 *         }>}
	 *         A promise that resolves to the response. The response body will
	 *         be parsed according to the {@code Content-Type} response
	 *         header's value.
	 */
	get(url, data, options = {}) {}

	/**
	 * Sends an HTTP POST request to the specified URL, sending the provided
	 * data as the request body. If an object is provided as the request data,
	 * the data will be JSON-encoded. Sending other primitive non-string values
	 * as the request body is not supported.
	 *
	 * @method post
	 * @param {string} url The URL to which the request should be made.
	 * @param {(string|Object<string, *>)} data The data to send to the server
	 *        as the request body.
	 * @param {{timeout: number=, ttl: number=, repeatRequest: number=,
	 *        headers: Object<string, string>=, cache: boolean=,
	 *        withCredentials: boolean}=} options
	 *        Optional request options. The {@code timeout} specifies the
	 *        request timeout in milliseconds, the {@code ttl} specified how
	 *        long the request may be cached in milliseconds, the
	 *        {@code repeatRequest} specifies the maximum number of tries to
	 *        repeat the request if the request fails. The {@code headers}
	 *        field sets the additional request headers (the keys are
	 *        case-insensitive header names, the values are header values). The
	 *        {@code cache} flag enables caching the HTTP request (enabled by
	 *        default, also applies to requests in progress). The
	 *        {@code withCredentials} flag indicates whether the request should
	 *        be made using credentials such as cookies or authorization
	 *        headers.
	 * @return {Promise<{
	 *             status: number,
	 *             body: *,
	 *             params: {
	 *                 method: string,
	 *                 url: string,
	 *                 transformedUrl: string,
	 *                 data: Object<string, (boolean|number|string)>
	 *             },
	 *             headers: Object<string, string>,
	 *             cached: boolean
	 *         }>}
	 *         A promise that resolves to the response. The response body will
	 *         be parsed according to the {@code Content-Type} response
	 *         header's value.
	 */
	post(url, data, options = {}) {}

	/**
	 * Sends an HTTP PUT request to the specified URL, sending the provided
	 * data as the request body. If an object is provided as the request data,
	 * the data will be JSON-encoded. Sending other primitive non-string values
	 * as the request body is not supported.
	 *
	 * @method put
	 * @param {string} url The URL to which the request should be made.
	 * @param {(string|Object<string, *>)} data The data to send to the server
	 *        as the request body.
	 * @param {{timeout: number=, ttl: number=, repeatRequest: number=,
	 *        headers: Object<string, string>=, cache: boolean=,
	 *        withCredentials: boolean}=} options
	 *        Optional request options. The {@code timeout} specifies the
	 *        request timeout in milliseconds, the {@code ttl} specified how
	 *        long the request may be cached in milliseconds, the
	 *        {@code repeatRequest} specifies the maximum number of tries to
	 *        repeat the request if the request fails. The {@code headers}
	 *        field sets the additional request headers (the keys are
	 *        case-insensitive header names, the values are header values). The
	 *        {@code cache} flag enables caching the HTTP request (enabled by
	 *        default, also applies to requests in progress). The
	 *        {@code withCredentials} flag indicates whether the request should
	 *        be made using credentials such as cookies or authorization
	 *        headers.
	 * @return {Promise<{
	 *             status: number,
	 *             body: *,
	 *             params: {
	 *                 method: string,
	 *                 url: string,
	 *                 transformedUrl: string,
	 *                 data: Object<string, (boolean|number|string)>
	 *             },
	 *             headers: Object<string, string>,
	 *             cached: boolean
	 *         }>}
	 *         A promise that resolves to the response. The response body will
	 *         be parsed according to the {@code Content-Type} response
	 *         header's value.
	 */
	put(url, data, options = {}) {}

	/**
	 * Sends an HTTP PATCH request to the specified URL, sending the provided
	 * data as the request body. If an object is provided as the request data,
	 * the data will be JSON-encoded. Sending other primitive non-string values
	 * as the request body is not supported.
	 *
	 * @method patch
	 * @param {string} url The URL to which the request should be made.
	 * @param {(string|Object<string, *>)} data The data to send to the server
	 *        as the request body.
	 * @param {{timeout: number=, ttl: number=, repeatRequest: number=,
	 *        headers: Object<string, string>=, cache: boolean=,
	 *        withCredentials: boolean}=} options
	 *        Optional request options. The {@code timeout} specifies the
	 *        request timeout in milliseconds, the {@code ttl} specified how
	 *        long the request may be cached in milliseconds, the
	 *        {@code repeatRequest} specifies the maximum number of tries to
	 *        repeat the request if the request fails. The {@code headers}
	 *        field sets the additional request headers (the keys are
	 *        case-insensitive header names, the values are header values). The
	 *        {@code cache} flag enables caching the HTTP request (enabled by
	 *        default, also applies to requests in progress). The
	 *        {@code withCredentials} flag indicates whether the request should
	 *        be made using credentials such as cookies or authorization
	 *        headers.
	 * @return {Promise<{
	 *             status: number,
	 *             body: *,
	 *             params: {
	 *                 method: string,
	 *                 url: string,
	 *                 transformedUrl: string,
	 *                 data: Object<string, (boolean|number|string)>
	 *             },
	 *             headers: Object<string, string>,
	 *             cached: boolean
	 *         }>}
	 *         A promise that resolves to the response. The response body will
	 *         be parsed according to the {@code Content-Type} response
	 *         header's value.
	 */
	patch(url, data, options = {}) {}

	/**
	 * Sends an HTTP DELETE request to the specified URL, sending the provided
	 * data as the request body. If an object is provided as the request data,
	 * the data will be JSON-encoded. Sending other primitive non-string values
	 * as the request body is not supported.
	 *
	 * @method delete
	 * @param {string} url The URL to which the request should be made.
	 * @param {(string|Object<string, *>)} data The data to send to the server
	 *        as the request body.
	 * @param {{timeout: number=, ttl: number=, repeatRequest: number=,
	 *        headers: Object<string, string>=, cache: boolean=,
	 *        withCredentials: boolean}=} options
	 *        Optional request options. The {@code timeout} specifies the
	 *        request timeout in milliseconds, the {@code ttl} specified how
	 *        long the request may be cached in milliseconds, the
	 *        {@code repeatRequest} specifies the maximum number of tries to
	 *        repeat the request if the request fails. The {@code headers}
	 *        field sets the additional request headers (the keys are
	 *        case-insensitive header names, the values are header values). The
	 *        {@code cache} flag enables caching the HTTP request (enabled by
	 *        default, also applies to requests in progress). The
	 *        {@code withCredentials} flag indicates whether the request should
	 *        be made using credentials such as cookies or authorization
	 *        headers.
	 * @return {Promise<{
	 *             status: number,
	 *             body: *,
	 *             params: {
	 *                 method: string,
	 *                 url: string,
	 *                 transformedUrl: string,
	 *                 data: Object<string, (boolean|number|string)>
	 *             },
	 *             headers: Object<string, string>,
	 *             cached: boolean
	 *         }>}
	 *         A promise that resolves to the response. The response body will
	 *         be parsed according to the {@code Content-Type} response
	 *         header's value.
	 */
	delete(url, data, options = {}) {}

	/**
	 * Generates a cache key to use for identifying a request to the specified
	 * URL using the specified HTTP method, submitting the provided data.
	 *
	 * @method getCacheKey
	 * @param {string} method The HTTP method used by the request.
	 * @param {string} url The URL to which the request is sent.
	 * @param {Object<string, string>} data The data associated with the
	 *        request. These can be either the query parameters or request body
	 *        data.
	 * @return {string} The key to use for identifying such a request in the
	 *         cache.
	 */
	getCacheKey(method, url, data) {}

	/**
	 * Sets the specified header to be sent with every subsequent HTTP request,
	 * unless explicitly overridden by request options.
	 *
	 * @method setDefaultHeader
	 * @param {string} header The name of the header.
	 * @param {string} value The header value. To provide multiple values,
	 *        separate them with commas
	 *        (see http://www.w3.org/Protocols/rfc2616/rfc2616-sec4.html#sec4.2).
	 * @return {HttpAgent} This HTTP agent.
	 */
	setDefaultHeader(header, value) {}

	/**
	 * Clears all configured default headers.
	 *
	 * @method clearDefaultHeaders
	 * @return {HttpAgent} This HTTP agent.
	 */
	clearDefaultHeaders() {}
}

ns.ima.http.HttpAgent = HttpAgent;
