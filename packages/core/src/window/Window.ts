/* eslint-disable @typescript-eslint/no-unused-vars */

import { UnknownParameters } from '../types';

export type CaptureOptions = {
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
export abstract class Window {
  /**
   * @return `true` if invoked at the client side.
   */
  isClient() {
    return false;
  }

  /**
   * Returns `true` if the cookies are set and processed with every
   * HTTP request and response automatically by the environment.
   *
   * @return `true` if cookies are handled automatically by
   *         the environment.
   */
  isCookieEnabled() {
    return false;
  }

  /**
   * Returns `true` if the session storage is supported.
   *
   * @return `true` if the session storage is supported.
   */
  hasSessionStorage() {
    return false;
  }

  /**
   * Sets the new page title of the document.
   *
   * @param title The new page title.
   */
  setTitle(title: string) {
    return;
  }

  /**
   * Returns the native `window` object representing the global context
   * at the client-side. The method returns `undefined` if used at the
   * server-side.
   *
   * @return The `window` object at the
   *         client-side, or `undefined` at the server-side.
   */
  getWindow(): undefined | globalThis.Window {
    return;
  }

  /**
   * Returns the native `document` object representing any web page loaded
   * in the browser and serves as an entry point into the web page's content
   * which is the DOM tree at the client-side. The method returns `undefined`
   * if used at the server-side.
   *
   * @return The `document` object at the
   *         client-side, or `undefined` at the server-side.
   */
  getDocument(): undefined | globalThis.Document {
    return;
  }

  /**
   * Returns the number of pixels the viewport is scrolled horizontally.
   *
   * @return The number of pixels the viewport is scrolled
   *         horizontally.
   */
  getScrollX() {
    return 0;
  }

  /**
   * Returns the number of pixels the document is scrolled vertically.
   *
   * @return The number of pixels the document is scrolled
   *         vertically.
   */
  getScrollY() {
    return 0;
  }

  /**
   * Scrolls the viewport to the specified location (if possible).
   *
   * @param x Horizontal scroll offset in pixels.
   * @param y Vertical scroll offset in pixels.
   */
  scrollTo(x: number, y: number) {
    return;
  }

  /**
   * Returns the domain of the current document's URL as
   * ``${protocol}://${host}``.
   *
   * @return The current domain.
   */
  getDomain() {
    return '';
  }

  /**
   * @return The current host.
   */
  getHost() {
    return '';
  }

  /**
   * Returns the path part of the current URL, including the query string.
   *
   * @return The path and query string parts of the current URL.
   */
  getPath() {
    return '';
  }

  /**
   * @return The current document's URL.
   */
  getUrl() {
    return '';
  }

  /**
   * Returns the document's body element. The method returns
   * `undefined` if invoked at the server-side.
   *
   * @return The document's body element, or
   *         `undefined` if invoked at the server side.
   */
  getBody(): undefined | HTMLElement {
    return;
  }

  /**
   * Returns the HTML element with the specified `id` attribute value.
   *
   * @param id The value of the `id` attribute to look for.
   * @return The element with the specified id, or
   *         `null` if no such element exists.
   */
  getElementById(id: string): null | Element {
    return null;
  }

  /**
   * Returns the history state.
   *
   * @return The current history state
   */
  getHistoryState(): UnknownParameters {
    return {};
  }

  /**
   * Returns the first element matching the specified CSS 3 selector.
   *
   * @param selector The CSS selector.
   * @return The first element matching the CSS selector or
   *         `null` if no such element exists.
   */
  querySelector(selector: string): null | Element {
    return null;
  }

  /**
   * Returns a node list of all elements matching the specified CSS 3
   * selector.
   *
   * @param selector The CSS selector.
   * @return A node list containing all elements matching the
   *         specified CSS selector.
   */
  querySelectorAll(selector: string): NodeList {
    return new NodeList();
  }

  /**
   * Performs a hard redirect (discarding the current JavaScript state) to
   * the specified URL.
   *
   * @param url The URL to which the browser will be redirected.
   */
  redirect(url: string) {
    return;
  }

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
  pushState(state: UnknownParameters, title: string, url?: string) {
    return;
  }

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
  replaceState(state: UnknownParameters, title: string, url?: string) {
    return;
  }

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
  createCustomEvent(name: string, options: UnknownParameters): CustomEvent {
    return new CustomEvent('');
  }

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
  bindEventListener(
    eventTarget: EventTarget,
    event: string,
    listener: (event: Event) => void,
    useCapture?: boolean | CaptureOptions
  ) {
    return;
  }

  /**
   * Deregister the provided event listener, so it will no longer we
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
  unbindEventListener(
    eventTarget: EventTarget,
    event: string,
    listener: (event: Event) => void,
    useCapture?: boolean | CaptureOptions
  ) {
    return;
  }
}
