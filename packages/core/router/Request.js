// @server-side export default class {}

/**
 * Wrapper for the ExpressJS request, exposing only the necessary minimum.
 */
export default class Request {
  static get $dependencies() {
    return [];
  }

  /**
   * Initializes the request.
   */
  constructor() {
    /**
     * The current ExpressJS request object, or {@code null} if running at
     * the client side.
     *
     * @type {?Express.Request}
     */
    this._request = null;
  }

  /**
   * Initializes the request using the provided ExpressJS request object.
   *
   * @param {?Express.Request} request The ExpressJS request object
   *        representing the current request. Use {@code null} at the client
   *        side.
   */
  init(request) {
    this._request = request;
  }

  /**
   * Returns the path part of the URL to which the request was made.
   *
   * @return {string} The path to which the request was made.
   */
  getPath() {
    return this._request ? this._request.originalUrl : '';
  }

  /**
   * Returns the {@code Cookie} HTTP header value.
   *
   * @return {string} The value of the {@code Cookie} header.
   */
  getCookieHeader() {
    return this._request ? this._request.get('Cookie') : '';
  }

  /**
   * Returns uploaded file to server and meta information.
   *
   * @return {?Object<string, *>}
   */
  getFile() {
    return this._request ? this._request.file : null;
  }

  /**
   * Returns upaloaded files to server with their meta information.
   *
   * @return {?Object<string, *>}
   */
  getFiles() {
    return this._request ? this._request.files : null;
  }

  /**
   * Returns body of request.
   *
   * @return {?string}
   */
  getBody() {
    return this._request ? this._request.body || null : null;
  }

  /**
   * Returns the specified HTTP request header.
   *
   * @param {string} header
   * @return {?string}
   */
  getHeader(header) {
    return this._request ? this._request.get(header) || null : null;
  }

  /**
   * Returns the remote IP address of the request.
   *
   * @return {?string}
   */
  getIP() {
    return this._request ? this._request.ip : null;
  }

  /**
   * Returns array of IP addresses specified in the “X-Forwarded-For”
   * request header.
   *
   * @return {string[]}
   */
  getIPs() {
    return this._request ? this._request.ips || [] : [];
  }
}
