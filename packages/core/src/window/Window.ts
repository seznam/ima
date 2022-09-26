export type ListenerOptions = {
  capture?: boolean;
  once?: boolean;
  passive?: boolean;
  signal?: AbortSignal;
};

/**
 * The {@link Window} interface defines various utility API for easier
 * cross-environment usage of various low-level client-side JavaScript APIs
 * available through various global objects.
 */
export default abstract class Window {
  /**
   * @return `true` if invoked at the client side.
   */
  abstract isClient(): boolean;

  /**
   * Returns `true` if the cookies are set and processed with every
   * HTTP request and response automatically by the environment.
   *
   * @return `true` if cookies are handled automatically by
   *         the environment.
   */
  abstract isCookieEnabled(): boolean;

  /**
   * Returns `true` if the session storage is supported.
   *
   * @return `true` if the session storage is supported.
   */
  abstract hasSessionStorage(): boolean;

  /**
   * Sets the new page title of the document.
   *
   * @param title The new page title.
   */
  abstract setTitle(title: string): void;

  /**
   * Returns the native `window` object representing the global context
   * at the client-side. The method returns `undefined` if used at the
   * server-side.
   *
   * @return The `window` object at the
   *         client-side, or `undefined` at the server-side.
   */
  abstract getWindow(): undefined | globalThis.Window;

  /**
   * Returns the native `document` object representing any web page loaded
   * in the browser and serves as an entry point into the web page's content
   * which is the DOM tree at the client-side. The method returns `undefined`
   * if used at the server-side.
   *
   * @return The `document` object at the
   *         client-side, or `undefined` at the server-side.
   */
  abstract getDocument(): undefined | globalThis.Document;

  /**
   * Returns the number of pixels the viewport is scrolled horizontally.
   *
   * @return The number of pixels the viewport is scrolled
   *         horizontally.
   */
  abstract getScrollX(): number;

  /**
   * Returns the number of pixels the document is scrolled vertically.
   *
   * @return The number of pixels the document is scrolled
   *         vertically.
   */
  abstract getScrollY(): number;

  /**
   * Scrolls the viewport to the specified location (if possible).
   *
   * @param x Horizontal scroll offset in pixels.
   * @param y Vertical scroll offset in pixels.
   */
  abstract scrollTo(x: number, y: number): void;

  /**
   * Returns the domain of the current document's URL as
   * ``${protocol}://${host}``.
   *
   * @return The current domain.
   */
  abstract getDomain(): string;

  /**
   * @return The current host.
   */
  abstract getHost(): string;

  /**
   * Returns the path part of the current URL, including the query string.
   *
   * @return The path and query string parts of the current URL.
   */
  abstract getPath(): string;

  /**
   * @return The current document's URL.
   */
  abstract getUrl(): string;

  /**
   * Returns the document's body element. The method returns
   * `undefined` if invoked at the server-side.
   *
   * @return The document's body element, or
   *         `undefined` if invoked at the server side.
   */
  abstract getBody(): undefined | HTMLElement;

  /**
   * Returns the HTML element with the specified `id` attribute value.
   *
   * @param id The value of the `id` attribute to look for.
   * @return The element with the specified id, or
   *         `null` if no such element exists.
   */
  abstract getElementById(id: string): null | HTMLElement;

  /**
   * Returns the history state.
   *
   * @return The current history state
   */
  abstract getHistoryState(): { [key: string]: unknown };

  /**
   * Returns the first element matching the specified CSS 3 selector.
   *
   * @param selector The CSS selector.
   * @return The first element matching the CSS selector or
   *         `null` if no such element exists.
   */
  abstract querySelector(selector: string): null | Element;

  /**
   * Returns a node list of all elements matching the specified CSS 3
   * selector.
   *
   * @param selector The CSS selector.
   * @return A node list containing all elements matching the
   *         specified CSS selector.
   */
  abstract querySelectorAll(selector: string): NodeList;

  /**
   * Performs a hard redirect (discarding the current JavaScript state) to
   * the specified URL.
   *
   * @param url The URL to which the browser will be redirected.
   */
  abstract redirect(url: string): void;

  /**
   * Pushes a new state to the browser history. The method has no effect if
   * the current browser does not support the history API (IE9).
   *
   * @param state A state object associated with the
   *        history item, preferably representing the page state.
   * @param title The page title related to the state. Note that
   *        this parameter is ignored by some browsers.
   * @param url The new URL at which the state is available.
   */
  abstract pushState(
    state: { [key: string]: unknown },
    title: string,
    url?: string
  ): void;

  /**
   * Replaces the current history entry. The method has no effect if the
   * current browser does not support the history API (IE9).
   *
   * @param state A state object associated with the
   *        history item, preferably representing the page state.
   * @param title The page title related to the state. Note that
   *        this parameter is ignored by some browsers.
   * @param url The new URL at which the state is available.
   */
  abstract replaceState(
    state: { [key: string]: unknown },
    title: string,
    url?: string
  ): void;

  /**
   * Create new instance of CustomEvent of the specified name and using the
   * provided options.
   *
   * @param name Custom event's name (sometimes referred to as the
   *        event's type).
   * @param options The custom event's options.
   * @return The created custom event.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
   */
  abstract createCustomEvent(
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
   * @param eventTarget The event target.
   * @param event The name of the event.
   * @param listener The event listener.
   * @param useCapture If true, the method initiates event
   *        capture. After initiating capture, all events of the specified
   *        type will be dispatched to the registered listener before being
   *        dispatched to any EventTarget beneath it in the DOM tree. Events
   *        which are bubbling upward through the tree will not trigger a
   *        listener designated to use capture.
   */
  abstract bindEventListener(
    eventTarget: EventTarget,
    event: string,
    listener: (event: Event) => void,
    useCapture?: boolean | ListenerOptions
  ): void;

  /**
   * Deregisters the provided event listener, so it will no longer we
   * executed when the specified event occurs on the specified event target.
   *
   * The method has no effect if the provided event listener is not
   * registered to be executed at the specified event.
   *
   * @param eventTarget The event target.
   * @param event The name of the event.
   * @param listener The event listener.
   * @param useCapture The `useCapture` flag value
   *        that was used when the listener was registered.
   */
  abstract unbindEventListener(
    eventTarget: EventTarget,
    event: string,
    listener: (event: Event) => void,
    useCapture?: boolean | ListenerOptions
  ): void;
}
