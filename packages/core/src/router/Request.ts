/* @if client **
export class Request {};
/* @else */
import { Request as ExpressRequest } from 'express';

/**
 * Wrapper for the ExpressJS request, exposing only the necessary minimum.
 */
export class Request {
  /**
   * The current ExpressJS request object, or `null` if running at
   * the client side.
   */
  protected _request?: ExpressRequest;

  static get $dependencies() {
    return [];
  }

  /**
   * Initializes the request using the provided ExpressJS request object.
   *
   * @param request The ExpressJS request object
   *        representing the current request. Use `null` at the client
   *        side.
   */
  init(request: ExpressRequest) {
    this._request = request;
  }

  /**
   * Returns the path part of the URL to which the request was made.
   *
   * @return The path to which the request was made.
   */
  getPath() {
    return this._request ? this._request.originalUrl : '';
  }

  /**
   * Returns the `Cookie` HTTP header value.
   *
   * @return The value of the `Cookie` header.
   */
  getCookieHeader() {
    return this._request ? this._request.get('Cookie') : '';
  }

  /**
   * Returns uploaded file to server and meta information.
   */
  getFile() {
    // @ts-expect-error missing type fore 'file'
    return this._request ? this._request.file : null;
  }

  /**
   * Returns uploaded files to server with their meta information.
   */
  getFiles() {
    // @ts-expect-error missing type fore 'files'
    return this._request ? this._request.files : null;
  }

  /**
   * Returns body of request.
   */
  getBody() {
    return this._request ? this._request.body || null : null;
  }

  /**
   * Returns the specified HTTP request header.
   */
  getHeader(header: string): string | null {
    return this._request ? this._request.get(header) || null : null;
  }

  /**
   * Returns the remote IP address of the request.
   */
  getIP(): string | null {
    return this._request ? this._request.ip : null;
  }

  /**
   * Returns array of IP addresses specified in the “X-Forwarded-For”
   * request header.
   */
  getIPs(): string[] {
    return this._request ? this._request.ips || [] : [];
  }

  /**
   * Returns the HTTP method of the request.
   */
  getMethod() {
    return this._request ? this._request.method : '';
  }

  /**
   * Returns the raw request.
   */
  getRequest(): ExpressRequest | undefined {
    return this._request;
  }
}
// @endif
