import ns from 'imajs/client/core/namespace';

ns.namespace('Core.Interface');

/**
 * The {@codelink HttpAgent} defines unifying API for simple sending of HTTP
 * requests at both client-side and server-side.
 *
 * @interface HttpAgent
 * @namespace Core.Interface
 * @module Core
 * @submodule Core.Interface
 */
export default class HttpAgent {
	/**
	 * Sends an HTTP GET request to the specified URL, sending the provided
	 * data as query parameters.
	 *
	 * @method get
	 * @param {string} url The URL to which the request should be made.
	 * @param {Object<string, (boolean|number|string|Date)>} data The data to
	 *        send to the server as query parameters.
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
	 * @return {Promise<*>} A promise that resolves to the response body parsed
	 *         as JSON.
	 */
	get(url, data, options = {}) {}

	/**
	 * Sends an HTTP POST request to the specified URL, sending the provided
	 * data as a request body.
	 *
	 * @method post
	 * @param {string} url The URL to which the request should be made.
	 * @param {Object<string, (boolean|number|string|Date)>} data The data to
	 *        send to the server as request body.
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
	 * @return {Promise<*>} A promise that resolves to the response body parsed
	 *         as JSON.
	 */
	post(url, data, options = {}) {}

	/**
	 * Sends an HTTP PUT request to the specified URL, sending the provided
	 * data as a request body.
	 *
	 * @method put
	 * @param {string} url The URL to which the request should be made.
	 * @param {Object<string, (boolean|number|string|Date)>} data The data to
	 *        send to the server as request body.
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
	 * @return {Promise<*>} A promise that resolves to the response body parsed
	 *         as JSON.
	 */
	put(url, data, options = {}) {}

	/**
	 * Sends an HTTP PATCH request to the specified URL, sending the provided
	 * data as a request body.
	 *
	 * @method patch
	 * @param {string} url The URL to which the request should be made.
	 * @param {Object<string, (boolean|number|string|Date)>} data The data to
	 *        send to the server as request body.
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
	 * @return {Promise<*>} A promise that resolves to the response body parsed
	 *         as JSON.
	 */
	patch(url, data, options = {}) {}

	/**
	 * Sends an HTTP DELETE request to the specified URL, sending the provided
	 * data as a request body.
	 *
	 * @method delete
	 * @param {string} url The URL to which the request should be made.
	 * @param {Object<string, (boolean|number|string|Date)>} data The data to
	 *        send to the server as request body.
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
	 * @return {Promise<*>} A promise that resolves to the response body parsed
	 *         as JSON.
	 */
	delete(url, data, options = {}) {}

	/**
	 * Generates a cache key to use for identifying a request to the specified
	 * URL and submitted data.
	 *
	 * @method getCacheKey
	 * @param {string} method The HTTP method used by the request.
	 * @param {string} url The URL to which the request is sent.
	 * @param {Object<string, string>} data The data associated with the
	 *        request. These can be either the query parameters of request body
	 *        parameters.
	 * @return {string} Key to use for identifying a request to the specified
	 *         URL with the specified request data in the cache.
	 */
	getCacheKey(method, url, data) {}

	/**
	 * Set constant header to all request.
	 *
	 * @method setDefaultHeader
	 * @chainable
	 * @param {string} header The name of the header.
	 * @param {string} value The header value. To provide multiple values,
	 *        separate them with commas
	 *        (see http://www.w3.org/Protocols/rfc2616/rfc2616-sec4.html#sec4.2).
	 * @return {Core.Interface.HttpAgent} This instance.
	 */
	setDefaultHeader(header, value) {}

	/**
	 * Clears all defaults headers sent with all requests.
	 *
	 * @method clearDefaultHeaders
	 * @chainable
	 * @return {Core.Interface.HttpAgent} This instance.
	 */
	clearDefaultHeaders() {}
}

ns.Core.Interface.HttpAgent = HttpAgent;
