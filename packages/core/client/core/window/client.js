import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core.Window');

/**
 * Client-side implementation of the {@code Core.Interface.Window} utility API.
 *
 * @class Client
 * @implements ns.Core.Interface.Window
 * @namespace Core.Window
 * @module Core
 * @submodule Core.Window
 */
export default class Client extends ns.Core.Interface.Window {

	/**
	 * Returns {@code true} if invoked at the client side.
	 *
	 * @inheritDoc
	 * @override
	 * @method isClient
	 * @return {boolean} {@code true} if invoked at the client side.
	 */
	isClient() {
		return true;
	}

	/**
	 * Returns {@code true} if the cookies are set and processed on the HTTP
	 * requests and responses automatically by the environment.
	 *
	 * @inheritDoc
	 * @override
	 * @method isCookieEnabled
	 * @return {boolean} {@code true} if cookies are handled automatically by the
	 *         environment.
	 */
	isCookieEnabled() {
		return navigator.cookieEnabled;
	}

	/**
	 * Returns {@code true} if the session storage is supported.
	 *
	 * @inheritDoc
	 * @override
	 * @method hasSessionStorage
	 * @return {boolean} {@code true} if the session storage is supported.
	 */
	hasSessionStorage() {
		if (window.sessionStorage) {
			var sessionKey = 'IMA.jsTest';

			try {
				sessionStorage.setItem(sessionKey, 1);
				sessionStorage.removeItem(sessionKey);
			} catch(e) {
				return false;
			}

			return true;
		}
		return false;
	}

	/**
	 * Returns {@code true} if the WebSockets are supported.
	 *
	 * @inheritDoc
	 * @override
	 * @method hasWebSocket
	 * @return {boolean} {@code true} if the WebSockets are supported.
	 */
	hasWebSocket() {
		return window.WebSocket || window.MozWebSocket;
	}

	/**
	 * Returns {@code true} if the history manipulation API is supported.
	 *
	 * @inheritDoc
	 * @override
	 * @method hasHistoryAPI
	 * @return {boolean} {@code true} if the history manipulation API is
	 *         supported.
	 */
	hasHistoryAPI() {
		return !!(window.history) && !!(window.history.pushState);
	}

	/**
	 * Sets the new page title to the document.
	 *
	 * @inheritDoc
	 * @override
	 * @method setTitle
	 * @param {string} title The new page title.
	 */
	setTitle(title) {
		document.title = title;
	}

	/**
	 * Returns the current {@code WebSocket} implementation to use.
	 *
	 * @inheritDoc
	 * @override
	 * @method getWebSocket
	 * @return {function(new: WebSocket)} The current {@code WebSocket}
	 *         implementation.
	 */
	getWebSocket() {
		return window.WebSocket || window.MozWebSocket;
	}

	/**
	 * Returns the {@code window} object representing the global context at the
	 * client side. The method returns {@code undefined} if used at the server
	 * side.
	 *
	 * @inheritDoc
	 * @override
	 * @method getWindow
	 * @return {(undefined|Window)} The {@code window} object at the client side,
	 *         or {@code undefined} at the server side.
	 */
	getWindow() {
		return window;
	}

	/**
	 * Returns the number of pixels that document has already been scrolled horizontally.
	 *
	 * @inheritDoc
	 * @override
	 * @method getScrollX
	 * @return {number}
	 */
	getScrollX() {
		var supportPageOffset = window.pageXOffset !== undefined;
		var isCSS1Compat = ((document.compatMode || '') === 'CSS1Compat');

		return supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft;
	}

	/**
	 * Returns the number of pixels that document has already been scrolled vertically.
	 *
	 * @inheritDoc
	 * @override
	 * @method getScrollY
	 * @return {number}
	 */
	getScrollY() {
		var supportPageOffset = window.pageYOffset !== undefined;
		var isCSS1Compat = ((document.compatMode || '') === 'CSS1Compat');

		return supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
	}

	/**
	 * Scrolls to a particular set of coordinates in the document.
	 *
	 * @inheritDoc
	 * @override
	 * @method scrollTo
	 * @param {number} x is the pixel along the horizontal axis of the document
	 * @param {number} y is the pixel along the vertical axis of the document
	 */
	scrollTo(x, y) {
		window.scrollTo(x, y);
	}

	/**
	 * Returns the domain of the current URL as `${protocol}://${host}`.
	 *
	 * @inheritDoc
	 * @override
	 * @method getDomain
	 * @return {string} The current domain.
	 */
	getDomain() {
		return window.location.protocol + '//' + window.location.host;
	}

	/**
	 * Returns the application's host.
	 *
	 * @inheritDoc
	 * @override
	 * @method getHost
	 * @return {string} The current host.
	 */
	getHost() {
		return window.location.host;
	}

	/**
	 * Returns the path part of the current URL, including the query string.
	 *
	 * @inheritDoc
	 * @override
	 * @method getPath
	 * @return {string} The path and query string parts of the current URL.
	 */
	getPath() {
		return decodeURI(window.location.pathname + window.location.search);
	}

	/**
	 * Returns the current URL.
	 *
	 * @inheritDoc
	 * @override
	 * @method getUrl
	 * @return {string} The current URL.
	 */
	getUrl() {
		return decodeURI(window.location.href);
	}

	/**
	 * Returns the {@code &lt;body&gt;} body element. The method returns
	 * {@code undefined} if invoked at the server side.
	 *
	 * @inheritDoc
	 * @override
	 * @method getBody
	 * @return {(undefined|HTMLBodyElement)} The {@code &lt;body&gt;} body
	 *         element, or {@code undefined} if invoked at the server side.
	 */
	getBody() {
		return document.body;
	}

	/**
	 * Returns the HTML element with the specified {@code id} attribute value.
	 *
	 * @inheritDoc
	 * @override
	 * @method getElementById
	 * @param {string} id The value of the {@code id} attribute to look for.
	 * @return {?HTMLElement} The element with the specified id, or {@code null}
	 *         if no such element exists.
	 */
	getElementById(id) {
		return document.getElementById(id);
	}

	/**
	 * Returns the first element matching the specified CSS 2.1 (or CSS 3 since
	 * IE9) selector.
	 *
	 * @inheritDoc
	 * @override
	 * @method querySelector
	 * @param {string} selector The CSS selector.
	 * @return {?HTMLElement} The first element matching the CSS selector or
	 *         {@code null} if no such element exists.
	 */
	querySelector(selector) {
		return document.querySelector(selector);
	}

	/**
	 * Returns a node list of all elements matching the specified CSS 2.1 (or
	 * CSS 3 since IE9) selector.
	 *
	 * @inheritDoc
	 * @override
	 * @method querySelectorAll
	 * @param {string} selector The CSS selector.
	 * @return {NodeList} A node list containing all elements matching the
	 *         specified CSS selector.
	 */
	querySelectorAll(selector) {
		return document.querySelectorAll(selector);
	}

	/**
	 * Performs a hard redirect (discarding the current JavaScript state) to the
	 * specified URL.
	 *
	 * @inheritDoc
	 * @override
	 * @method redirect
	 * @param {string} url The URL to which the browser will be redirected.
	 */
	redirect(url) {
		window.location.href = url;
	}

	/**
	 * Pushes a new state to the browser history.
	 *
	 * @inheritDoc
	 * @override
	 * @method pushState
	 * @param {Object<string, *>} state A state object associated with the
	 *        history item, preferably representing the page state.
	 * @param {string} title The page title related to the state. Note that this
	 *        parameter is ignored by some browsers.
	 * @param {string} url The new URL at which the state is available.
	 */
	pushState(state, title, url) {
		window.history.pushState(state, title, url);
	}

	/**
	 * Replace the current history entry state.
	 *
	 * @inheritDoc
	 * @override
	 * @method replaceState
	 * @param {Object<string, *>} state A state object associated with the
	 *        history item, preferably representing the page state.
	 * @param {string} title The page title related to the state. Note that this
	 *        parameter is ignored by some browsers.
	 * @param {string} url The new URL at which the state is available.
	 */
	replaceState(state, title, url) {
		window.history.replaceState(state, title, url);
	}

	/**
	 * Create new instance of CustomEvent with defined name and options.
	 *
	 * @method createCustomEvent
	 * @param {string} name
	 * @param {Object<string, *>} options
	 * @return {CustomEvent}
	 */
	createCustomEvent(name, options) {
		return new CustomEvent(name, options);
	}

	/**
	 * Registers the provided event listener to be executed when the specified
	 * event occurrs on the specified event target.
	 *
	 * Registering the same event listener for the same event on the same event
	 * target with the same {@code useCapture} flag value repeatedly has no
	 * effect.
	 *
	 * @inheritDoc
	 * @override
	 * @method bindEventListener
	 * @param {EventTarget} eventTarget The event target.
	 * @param {string} event The name of the event.
	 * @param {function(Event)} listener The event listener.
	 * @param {boolean=} [useCapture=false] If true, the method initiates event
	 *        capture. After initiating capture, all events of the specified type
	 *        will be dispatched to the registered listener before being
	 *        dispatched to any EventTarget beneath it in the DOM tree. Events
	 *        which are bubbling upward through the tree will not trigger a
	 *        listener designated to use capture.
	 */
	bindEventListener(element, event, listener, useCapture = false) {
		if (element.addEventListener) {
			element.addEventListener(event, listener, useCapture);
		} else {
			if (element.attachEvent) {
				element.attachEvent(`on${event}`, listener);
			}
		}
	}

	/**
	 * Unregisters the provided event listener, so it will no longer we executed
	 * when the specified event occurrs on the specified event target.
	 *
	 * The method has no effect if the provided event listener is not registered
	 * to be executed at the specified event.
	 *
	 * @inheritDoc
	 * @override
	 * @method unbindEventListener
	 * @param {EventTarget} eventTarget The event target.
	 * @param {string} event The name of the event.
	 * @param {function(Event)} listener The event listener.
	 * @param {boolean=} [useCapture=false] The {@code useCapture} flag value
	 *        that was used when the listener was registered.
	 */
	unbindEventListener(element, event, listener, useCapture = false) {
		if (element.removeEventListener) {
			element.removeEventListener(event, listener, useCapture);
		} else {
			if (element.detachEvent) {
				element.detachEvent(`on${event}`, listener);
			}
		}
	}

	/**
	 * Prevents the default browser action for the provided event.
	 *
	 * @inheritDoc
	 * @override
	 * @method preventDefault
	 * @param {Event} event The event.
	 */
	preventDefault(event) {
		if (event.preventDefault) {
			event.preventDefault();
		} else {
			event.returnValue = false;
		}
	}
}

ns.Core.Window.Client = Client;
