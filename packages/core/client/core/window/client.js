import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core.Window');

/**
 * @class Client
 * @extends ns.Core.Interface.Window
 * @namespace Core.Window
 * @module Core
 * @submodule Core.Window
 */
class Client extends ns.Core.Interface.Window {

	/**
	 * @method constructor
	 * @constructor
	 */
	constructor() {
		super();
	}

	/**
	 * Returns true if is client side code.
	 *
	 * @method isClient
	 * @return {boolean}
	 */
	isClient() {
		return true;
	}

	/**
	 * Returns true if cookie is enabled.
	 *
	 * @method isCookieEnabled
	 * @return {boolean}
	 */
	isCookieEnabled() {
		return typeof navigator === 'undefined' || navigator === null ||
			!navigator.cookieEnabled;
	}

	/**
	 * Returns true if is session storage supported.
	 *
	 * @method hasSessionStorage
	 * @return {boolean}
	 */
	hasSessionStorage() {
		return typeof window.sessionStorage !== 'undefined' && window.sessionStorage !== null;
	}

	/**
	 * Returns true if websocket is supported.
	 *
	 * @method hasWebSocket
	 * @return {boolean}
	 */
	hasWebSocket() {
		return window.WebSocket || window.MozWebSocket;
	}

	/**
	 * Returns true if history API is supported.
	 *
	 * @method hasHistoryAPI
	 * @return {boolean}
	 */
	hasHistoryAPI() {
		return !!(window.history) && !!(window.history.pushState);
	}

	/**
	 * Set new page title.
	 *
	 * @method setTitle
	 * @param {string} title
	 */
	setTitle(title) {
		document.title = title;
	}

	/**
	 * Get WebSocket interface.
	 *
	 * @method getWebSocket
	 * @return {WebSocket}
	 */
	getWebSocket() {
		return window.WebSocket || window.MozWebSocket;
	}

	/**
	 * Returns window object.
	 *
	 * @method getWindow
	 * @return {Window}
	 */
	getWindow() {
		return window;
	}

	/**
	 * Returns current domain.
	 *
	 * @method getDomain
	 * @return {string}
	 */
	getDomain() {
		return window.location.protocol + '//' + window.location.host;
	}

	/**
	 * Returns current path.
	 *
	 * @method getPath
	 * @return {string}
	 */
	getPath() {
		return decodeURI(window.location.pathname + window.location.search);
	}

	/**
	 * Returns current url.
	 *
	 * @method getUrl
	 * @return {string}
	 */
	getUrl() {
		return decodeURI(window.location.href);
	}

	/**
	 * Returns body element.
	 *
	 * @method getBody
	 * @return {HTMLElement}
	 */
	getBody() {
		return document.body;
	}

	/**
	 * Returns element by id.
	 *
	 * @method getElementById
	 * @param {string} id
	 * @return {HtmlElement|null}
	 */
	getElementById(id) {
		return document.getElementById(id);
	}

	/**
	 * Returns the first element within the document that matches the specified group of selectors.
	 *
	 * @method querySelector
	 * @param {string} selector
	 * @return {HtmlElement|null}
	 */
	querySelector(selector) {
		return document.querySelector(selector);
	}

	/**
	 * Returns a list of the elements within the document that match the specified group of selectors.
	 *
	 * @method querySelectorAll
	 * @param {string} selector
	 * @return {NodeList}
	 */
	querySelectorAll(selector) {
		return document.querySelectorAll(selector);
	}

	/**
	 * Redirect to url.
	 *
	 * @method redirect
	 * @param {string} url
	 */
	redirect(url) {
		window.location.href = url;
	}

	/**
	 * Push state to history API.
	 *
	 * @method pushStateToHistoryAPI
	 * @param {Object} state
	 * @param {string} title
	 * @param {string} url
	 */
	pushStateToHistoryAPI(state, title, url) {
		window.history.pushState(state, title, url);
	}

	/**
	 * Add event listener.
	 *
	 * @method addEventListener
	 * @param {EventTarget} element
	 * @param {string} event
	 * @param {function} listener
	 * @param {boolean} [useCapture=false]
	 */
	addEventListener(element, event, listener, useCapture = false) {
		if (element.addEventListener) {
			element.addEventListener(event, listener, useCapture);
		} else {
			if (element.attachEvent) {
				element.attachEvent(`on${event}`, listener);
			}
		}
	}

	/**
	 * Remove event listener.
	 *
	 * @method removeEventListener
	 * @param {EventTarget} element
	 * @param {string} event
	 * @param {function} listener
	 * @param {boolean} [useCapture=false]
	 */
	removeEventListener(element, event, listener, useCapture = false) {
		if (element.removeEventListener) {
			element.removeEventListener(event, listener, useCapture);
		} else {
			if (element.detachEvent) {
				element.detachEvent(`on${event}`, listener);
			}
		}
	}

	/**
	 * PreventDefault action.
	 *
	 * @method preventDefault
	 * @param {Event} e
	 */
	preventDefault(e) {
		if (e.preventDefault) {
			e.preventDefault();
		} else {
			e.returnValue = false;
		}
	}
}

ns.Core.Window.Client = Client;