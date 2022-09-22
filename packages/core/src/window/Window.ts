export type listenerOptions = {
  capture?: boolean;
  once?: boolean;
  passive?: boolean;
  signal?: AbortSignal;
};

/**
 * The {@link Window} interface defines various utility API for easier
 * cross-environment usage of various low-level client-side JavaScript APIs
 * available through various global objects.
 *
 * @interface
 */
export default interface Window {
  /**
   * Returns `true` if invoked at the client side.
   *
   * @return {boolean} `true` if invoked at the client side.
   */
  isClient(): boolean;

  /**
   * Returns `true` if the cookies are set and processed with every
   * HTTP request and response automatically by the environment.
   *
   * @return {boolean} `true` if cookies are handled automatically by
   *         the environment.
   */
  isCookieEnabled(): boolean;

  /**
   * Returns `true` if the session storage is supported.
   *
   * @return {boolean} `true` if the session storage is supported.
   */
  hasSessionStorage(): boolean;

  /**
   * Sets the new page title of the document.
   *
   * @param {string} title The new page title.
   */
  setTitle(title: string): void;

  /**
   * Returns the native `window` object representing the global context
   * at the client-side. The method returns `undefined` if used at the
   * server-side.
   *
   * @return {(undefined|Window)} The `window` object at the
   *         client-side, or `undefined` at the server-side.
   */
  getWindow(): undefined | globalThis.Window;

  /**
   * Returns the native `document` object representing any web page loaded
   * in the browser and serves as an entry point into the web page's content
   * which is the DOM tree at the client-side. The method returns `undefined`
   * if used at the server-side.
   *
   * @return {(undefined|Document)} The `document` object at the
   *         client-side, or `undefined` at the server-side.
   */
  getDocument(): undefined | globalThis.Document;

  /**
   * Returns the number of pixels the viewport is scrolled horizontally.
   *
   * @return {number} The number of pixels the viewport is scrolled
   *         horizontally.
   */
  getScrollX(): number;

  /**
   * Returns the number of pixels the document is scrolled vertically.
   *
   * @return {number} The number of pixels the document is scrolled
   *         vertically.
   */
  getScrollY(): number;

  /**
   * Scrolls the viewport to the specified location (if possible).
   *
   * @param {number} x Horizontal scroll offset in pixels.
   * @param {number} y Vertical scroll offset in pixels.
   */
  scrollTo(x: number, y: number): void;

  /**
   * Returns the domain of the current document's URL as
   * ``${protocol}://${host}``.
   *
   * @return {string} The current domain.
   */
  getDomain(): string;

  /**
   * Returns the application's host.
   *
   * @return {string} The current host.
   */
  getHost(): string;

  /**
   * Returns the path part of the current URL, including the query string.
   *
   * @return {string} The path and query string parts of the current URL.
   */
  getPath(): string;

  /**
   * Returns the current document's URL.
   *
   * @return {string} The current document's URL.
   */
  getUrl(): string;

  /**
   * Returns the document's body element. The method returns
   * `undefined` if invoked at the server-side.
   *
   * @return {(undefined|HTMLBodyElement)} The document's body element, or
   *         `undefined` if invoked at the server side.
   */
  getBody(): undefined | HTMLElement;

  /**
   * Returns the HTML element with the specified `id` attribute value.
   *
   * @param {string} id The value of the `id` attribute to look for.
   * @return {?HTMLElement} The element with the specified id, or
   *         `null` if no such element exists.
   */
  getElementById(id: string): null | HTMLElement;

  /**
   * Returns the history state.
   *
   * @return {Object} The current history state
   */
  getHistoryState(): { [key: string]: unknown };

  /**
   * Returns the first element matching the specified CSS 3 selector.
   *
   * @param {string} selector The CSS selector.
   * @return {?HTMLElement} The first element matching the CSS selector or
   *         `null` if no such element exists.
   */
  querySelector(selector: string): null | HTMLElement;

  /**
   * Returns a node list of all elements matching the specified CSS 3
   * selector.
   *
   * @param {string} selector The CSS selector.
   * @return {NodeList} A node list containing all elements matching the
   *         specified CSS selector.
   */
  querySelectorAll(selector: string): NodeList;

  /**
   * Performs a hard redirect (discarding the current JavaScript state) to
   * the specified URL.
   *
   * @param {string} url The URL to which the browser will be redirected.
   */
  redirect(url: string): void;

  /**
   * Pushes a new state to the browser history. The method has no effect if
   * the current browser does not support the history API (IE9).
   *
   * @param {Object<string, *>} state A state object associated with the
   *        history item, preferably representing the page state.
   * @param {string} title The page title related to the state. Note that
   *        this parameter is ignored by some browsers.
   * @param {string} url The new URL at which the state is available.
   */
  pushState(
    state: { [key: string]: unknown },
    title: string,
    url: string | null
  ): void;

  /**
   * Replaces the current history entry. The method has no effect if the
   * current browser does not support the history API (IE9).
   *
   * @param {Object<string, *>} state A state object associated with the
   *        history item, preferably representing the page state.
   * @param {string} title The page title related to the state. Note that
   *        this parameter is ignored by some browsers.
   * @param {string=} [url=null] The new URL at which the state is available.
   */
  replaceState(
    state: { [key: string]: unknown },
    title: string,
    url: string | null
  ): void;

  /**
   * Create new instance of CustomEvent of the specified name and using the
   * provided options.
   *
   * @param {string} name Custom event's name (sometimes referred to as the
   *        event's type).
   * @param {Object<string, *>} options The custom event's options.
   * @return {CustomEvent} The created custom event.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
   */
  createCustomEvent(
    name: string,
    options: { [key: string]: unknown }
  ): CustomEvent;

  /**
   * Registers the provided event listener to be executed when the specified
   * event occurs on the specified event target.
   *
   * Registering the same event listener for the same event on the same event
   * target with the same `useCapture` flag value repeatedly has no
   * effect.
   *
   * @param {EventTarget} eventTarget The event target.
   * @param {string} event The name of the event.
   * @param {function(Event)} listener The event listener.
   * @param {boolean=} [useCapture=false] If true, the method initiates event
   *        capture. After initiating capture, all events of the specified
   *        type will be dispatched to the registered listener before being
   *        dispatched to any EventTarget beneath it in the DOM tree. Events
   *        which are bubbling upward through the tree will not trigger a
   *        listener designated to use capture.
   */
  bindEventListener(
    eventTarget: EventTarget,
    event: string,
    listener: (event: Event) => void,
    useCapture?: boolean | listenerOptions
  ): void;

  /**
   * Deregisters the provided event listener, so it will no longer we
   * executed when the specified event occurs on the specified event target.
   *
   * The method has no effect if the provided event listener is not
   * registered to be executed at the specified event.
   *
   * @param {EventTarget} eventTarget The event target.
   * @param {string} event The name of the event.
   * @param {function(Event)} listener The event listener.
   * @param {boolean=} [useCapture=false] The `useCapture` flag value
   *        that was used when the listener was registered.
   */
  unbindEventListener(
    eventTarget: EventTarget,
    event: string,
    listener: (event: Event) => void,
    useCapture?: boolean | listenerOptions
  ): void;
}
