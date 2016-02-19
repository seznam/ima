import ns from 'ima/core/namespace';

ns.namespace('Core.Interface');

/**
 * The {@codelink Window} interface defines the API for a utility for easier
 * cross-environment use of various low-level client-side JavaScript APIs
 * available through various global objects.
 *
 * @interface Window
 * @namespace Core.Interface
 * @module Core
 * @submodule Core.Interface
 */
export default class Window {

	/**
	 * Returns {@code true} if invoked at the client side.
	 *
	 * @method isClient
	 * @return {boolean} {@code true} if invoked at the client side.
	 */
	isClient() {}

	/**
	 * Returns {@code true} if the cookies are set and processed on the HTTP
	 * requests and responses automatically by the environment.
	 *
	 * @method isCookieEnabled
	 * @return {boolean} {@code true} if cookies are handled automatically by
	 *         the environment.
	 */
	isCookieEnabled() {}

	/**
	 * Returns {@code true} if the session storage is supported.
	 *
	 * @method hasSessionStorage
	 * @return {boolean} {@code true} if the session storage is supported.
	 */
	hasSessionStorage() {}

	/**
	 * Returns {@code true} if the WebSockets are supported.
	 *
	 * @method hasWebSocket
	 * @return {boolean} {@code true} if the WebSockets are supported.
	 */
	hasWebSocket() {}

	/**
	 * Returns {@code true} if the history manipulation API is supported.
	 *
	 * @method hasHistoryAPI
	 * @return {boolean} {@code true} if the history manipulation API is
	 *         supported.
	 */
	hasHistoryAPI() {}

	/**
	 * Sets the new page title to the document.
	 *
	 * @method setTitle
	 * @param {string} title The new page title.
	 */
	setTitle(title) {}

	/**
	 * Returns the current {@code WebSocket} implementation to use.
	 *
	 * @method getWebSocket
	 * @return {function(new: WebSocket)} The current {@code WebSocket}
	 *         implementation.
	 */
	getWebSocket() {}

	/**
	 * Returns the {@code window} object representing the global context at the
	 * client side. The method returns {@code undefined} if used at the server
	 * side.
	 *
	 * @method getWindow
	 * @return {(undefined|Window)} The {@code window} object at the client
	 *         side, or {@code undefined} at the server side.
	 */
	getWindow() {}

	/**
	 * Returns the number of pixels that document has already been scrolled
	 * horizontally.
	 *
	 * @method getScrollX
	 * @return {number}
	 */
	getScrollX() {}

	/**
	 * Returns the number of pixels that document has already been scrolled
	 * vertically.
	 *
	 * @method getScrollY
	 * @return {number}
	 */
	getScrollY() {}

	/**
	 * Scrolls to a particular set of coordinates in the document.
	 *
	 * @method scrollTo
	 * @param {number} x is the pixel along the horizontal axis of the document
	 * @param {number} y is the pixel along the vertical axis of the document
	 */
	scrollTo(x, y) {}

	/**
	 * Returns the domain of the current URL as `${protocol}://${host}`.
	 *
	 * @method getDomain
	 * @return {string} The current domain.
	 */
	getDomain() {}

	/**
	 * Returns the application's host.
	 *
	 * @method getHost
	 * @return {string} The current host.
	 */
	getHost() {}

	/**
	 * Returns the path part of the current URL, including the query string.
	 *
	 * @method getPath
	 * @return {string} The path and query string parts of the current URL.
	 */
	getPath() {}

	/**
	 * Returns the current URL.
	 *
	 * @method getUrl
	 * @return {string} The current URL.
	 */
	getUrl() {}

	/**
	 * Returns the {@code &lt;body&gt;} body element. The method returns
	 * {@code undefined} if invoked at the server side.
	 *
	 * @method getBody
	 * @return {(undefined|HTMLBodyElement)} The {@code &lt;body&gt;} body
	 *         element, or {@code undefined} if invoked at the server side.
	 */
	getBody() {}

	/**
	 * Returns the HTML element with the specified {@code id} attribute value.
	 *
	 * @method getElementById
	 * @param {string} id The value of the {@code id} attribute to look for.
	 * @return {?HTMLElement} The element with the specified id, or
	 *         {@code null} if no such element exists.
	 */
	getElementById(id) {}

	/**
	 * Returns the first element matching the specified CSS 2.1 (or CSS 3 since
	 * IE9) selector.
	 *
	 * @method querySelector
	 * @param {string} selector The CSS selector.
	 * @return {?HTMLElement} The first element matching the CSS selector or
	 *         {@code null} if no such element exists.
	 */
	querySelector(selector) {}

	/**
	 * Returns a node list of all elements matching the specified CSS 2.1 (or
	 * CSS 3 since IE9) selector.
	 *
	 * @method querySelectorAll
	 * @param {string} selector The CSS selector.
	 * @return {NodeList} A node list containing all elements matching the
	 *         specified CSS selector.
	 */
	querySelectorAll(selector) {}

	/**
	 * Performs a hard redirect (discarding the current JavaScript state) to
	 * the specified URL.
	 *
	 * @method redirect
	 * @param {string} url The URL to which the browser will be redirected.
	 */
	redirect(url) {}

	/**
	 * Pushes a new state to the browser history.
	 *
	 * @method pushState
	 * @param {Object<string, *>} state A state object associated with the
	 *        history item, preferably representing the page state.
	 * @param {string} title The page title related to the state. Note that
	 *        this parameter is ignored by some browsers.
	 * @param {string} url The new URL at which the state is available.
	 */
	pushState(state, title, url) {}

	/**
	 * Replace the current history entry state.
	 *
	 * @method replaceState
	 * @param {Object<string, *>} state A state object associated with the
	 *        history item, preferably representing the page state.
	 * @param {string} title The page title related to the state. Note that
	 *        this parameter is ignored by some browsers.
	 * @param {string} url The new URL at which the state is available.
	 */
	replaceState(state, title, url) {}

	/**
	 * Create new instance of CustomEvent with defined name and options.
	 *
	 * @method createCustomEvent
	 * @param {string} name
	 * @param {Object<string, *>} options The custom event options.
	 * @return {CustomEvent} The created custom event.
	 */
	createCustomEvent(name, options) {}

	/**
	 * Registers the provided event listener to be executed when the specified
	 * event occurs on the specified event target.
	 *
	 * Registering the same event listener for the same event on the same event
	 * target with the same {@code useCapture} flag value repeatedly has no
	 * effect.
	 *
	 * @method bindEventListener
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
	bindEventListener(eventTarget, event, listener, useCapture = false) {}

	/**
	 * Deregisters the provided event listener, so it will no longer we
	 * executed when the specified event occurs on the specified event target.
	 *
	 * The method has no effect if the provided event listener is not
	 * registered to be executed at the specified event.
	 *
	 * @method unbindEventListener
	 * @param {EventTarget} eventTarget The event target.
	 * @param {string} event The name of the event.
	 * @param {function(Event)} listener The event listener.
	 * @param {boolean=} [useCapture=false] The {@code useCapture} flag value
	 *        that was used when the listener was registered.
	 */
	unbindEventListener(eventTarget, event, listener, useCapture = false) {}

	/**
	 * Prevents the default browser action for the provided event.
	 *
	 * @method preventDefault
	 * @param {Event} event The event.
	 */
	preventDefault(event) {}
}

ns.Core.Interface.Window = Window;
