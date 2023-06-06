import { HttpProxyRequestParams } from './HttpProxy';
import { StringParameters, UnknownParameters } from '../types';

/**
 * Options for a request sent using the HTTP agent.
 * @typedef {Object} HttpAgent~RequestOptions
 * @property timeout Specifies the request timeout in milliseconds.
 * @property ttl Specified how long the request may be cached in
 *           milliseconds.
 * @property repeatRequest Specifies the maximum number of tries to
 *           repeat the request if the request fails.
 * @property headers Sets the additional request
 *           headers (the keys are case-insensitive header names, the values
 *           are header values).
 * @property fetchOptions Sets the fetch request options.
 * @property cache Flag that enables caching the HTTP request
 *           (enabled by default, also applies to requests in progress).
 * @property withCredentials Flag that indicates whether the
 *           request should be made using credentials such as cookies or
 *           authorization headers.
 * @property postProcessors Response
 *           post-processors applied just before the response is stored in the
 *           cache and returned.
 */

export interface ImaRequestInit extends Omit<RequestInit, 'body'> {
  headers?: Record<string, string>;
}

export interface HttpAgentRequestOptions {
  timeout: number;
  ttl: number;
  repeatRequest: number;
  fetchOptions: ImaRequestInit;
  cache: boolean;
  postProcessors?: (<B = unknown>(
    response: HttpAgentResponse<B>
  ) => HttpAgentResponse<B>)[];
  abortController?: AbortController;
  keepSensitiveHeaders?: boolean;
}

/**
 * A response from the server.
 * @typedef HttpAgent~Response
 * @property status The HTTP response status code.
 * @property body The parsed response body, parsed as JSON.
 * @property params The original request params.
 * @property headers The response HTTP headers.
 * @property cached Whether or not the response has been cached.
 */

export type HttpAgentResponse<B> = {
  status: number;
  body: B;
  params: HttpProxyRequestParams;
  headers: StringParameters;
  headersRaw?: Headers;
  cached: boolean;
};

/**
 * The {@link HttpAgent} defines unifying API for sending HTTP requests at
 * both client-side and server-side.
 */
export abstract class HttpAgent {
  /**
   * Sends an HTTP GET request to the specified URL, sending the provided
   * data as query parameters.
   *
   * @param url The URL to which the request should be made.
   * @param data The data to send
   *        to the server as query parameters.
   * @param options Optional request options.
   * @return A promise that resolves to the
   *         response.
   */
  get<B = unknown>(
    url: string,
    data?: UnknownParameters,
    options?: Partial<HttpAgentRequestOptions>
  ): Promise<HttpAgentResponse<B>> {
    return Promise.reject();
  }

  /**
   * Sends an HTTP POST request to the specified URL, sending the provided
   * data as the request body. If an object is provided as the request data,
   * the data will be JSON-encoded. Sending other primitive non-string values
   * as the request body is not supported.
   *
   * @param url The URL to which the request should be made.
   * @param data The data to send to the server
   *        as the request body.
   * @param options Optional request options.
   * @return A promise that resolves to the
   *         response.
   */
  post<B = unknown>(
    url: string,
    data?: UnknownParameters,
    options?: Partial<HttpAgentRequestOptions>
  ): Promise<HttpAgentResponse<B>> {
    return Promise.reject();
  }

  /**
   * Sends an HTTP PUT request to the specified URL, sending the provided
   * data as the request body. If an object is provided as the request data,
   * the data will be JSON-encoded. Sending other primitive non-string values
   * as the request body is not supported.
   *
   * @param url The URL to which the request should be made.
   * @param data The data to send to the server
   *        as the request body.
   * @param options Optional request options.
   * @return A promise that resolves to the
   *         response.
   */
  put<B = unknown>(
    url: string,
    data?: UnknownParameters,
    options?: Partial<HttpAgentRequestOptions>
  ): Promise<HttpAgentResponse<B>> {
    return Promise.reject();
  }

  /**
   * Sends an HTTP PATCH request to the specified URL, sending the provided
   * data as the request body. If an object is provided as the request data,
   * the data will be JSON-encoded. Sending other primitive non-string values
   * as the request body is not supported.
   *
   * @param url The URL to which the request should be made.
   * @param data The data to send to the server
   *        as the request body.
   * @param options Optional request options.
   * @return A promise that resolves to the
   *         response.
   */
  patch<B = unknown>(
    url: string,
    data?: UnknownParameters,
    options?: Partial<HttpAgentRequestOptions>
  ): Promise<HttpAgentResponse<B>> {
    return Promise.reject();
  }

  /**
   * Sends an HTTP DELETE request to the specified URL, sending the provided
   * data as the request body. If an object is provided as the request data,
   * the data will be JSON-encoded. Sending other primitive non-string values
   * as the request body is not supported.
   *
   * @param url The URL to which the request should be made.
   * @param data The data to send to the server
   *        as the request body.
   * @param options Optional request options.
   * @return A promise that resolves to the
   *         response.
   */
  delete<B = unknown>(
    url: string,
    data?: UnknownParameters,
    options?: Partial<HttpAgentRequestOptions>
  ): Promise<HttpAgentResponse<B>> {
    return Promise.reject();
  }

  /**
   * Generates a cache key to use for identifying a request to the specified
   * URL using the specified HTTP method, submitting the provided data.
   *
   * @param method The HTTP method used by the request.
   * @param url The URL to which the request is sent.
   * @param data The data associated with the
   *        request. These can be either the query parameters or request body
   *        data.
   * @return The key to use for identifying such a request in the
   *         cache.
   */
  getCacheKey(method: string, url: string, data: UnknownParameters): string {
    return '';
  }

  /**
   * Method invalidate cache for given params
   */
  invalidateCache(method: string, url: string, data: UnknownParameters) {
    return;
  }

  /**
   * Sets the specified header to be sent with every subsequent HTTP request,
   * unless explicitly overridden by request options.
   *
   * @param header The name of the header.
   * @param value The header value. To provide multiple values,
   *        separate them with commas
   *        (see http://www.w3.org/Protocols/rfc2616/rfc2616-sec4.html#sec4.2).
   * @return This HTTP agent.
   */
  setDefaultHeader(header: string, value: string): this {
    return this;
  }

  /**
   * Clears all configured default headers.
   *
   * @return This HTTP agent.
   */
  clearDefaultHeaders(): this {
    return this;
  }
}
