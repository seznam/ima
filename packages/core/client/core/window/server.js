import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core.Window');

/**
 * @class Server
 * @extends ns.Core.Interface.Window
 * @namespace Core.Window
 * @module Core
 * @submodule Core.Window
 */
class Server extends ns.Core.Interface.Window {

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
		return false;
	}

	/**
	 * Returns true if cookie is enabled.
	 *
	 * @method isCookieEnabled
	 * @return {boolean}
	 */
	isCookieEnabled() {
		return false;
	}

	/**
	 * Returns true if is session storage supported.
	 *
	 * @method hasSessionStorage
	 * @return {boolean}
	 */
	hasSessionStorage() {
		return false;
	}

	/**
	 * Returns true if websocket is supported.
	 *
	 * @method hasWebSocket
	 * @return {boolean}
	 */
	hasWebSocket() {
		return false;
	}

	/**
	 * Set new page title.
	 *
	 * @method setTitle
	 */
	setTitle() {}

	/**
	 * Get WebSocket interface.
	 *
	 * @method getWebSocket
	 * @return {WebSocket}
	 */
	getWebSocket() {

		function WebSocket() {
			this.open = () => {};
			this.close = () => {};
			this.send = () => {};
		}

		return WebSocket;
	}

	/**
	 * Returns window object.
	 *
	 * @method getWindow
	 * @return {undefined}
	 */
	getWindow() {
		return undefined;
	}

	/**
	 * Returns current domain.
	 *
	 * @method getDomain
	 * @return {string}
	 */
	getDomain() {
		return '';
	}

	/**
	 * Returns current path.
	 *
	 * @method getPath
	 * @return {string}
	 */
	getPath() {
		return '';
	}

	/**
	 * Returns current url.
	 *
	 * @method getUrl
	 * @return {string}
	 */
	getUrl() {
		return '';
	}

	/**
	 * Returns body element.
	 *
	 * @method getBody
	 * @return {undefined}
	 */
	getBody() {
		return undefined;
	}

	/**
	 * Returns element by id.
	 *
	 * @method getElementById
	 * @return {null}
	 */
	getElementById() {
		return null;
	}

	/**
	 * Returns the first element within the document that matches the specified group of selectors.
	 *
	 * @method querySelector
	 * @return {null}
	 */
	querySelector() {
		return null;
	}

	/**
	 * Returns a list of the elements within the document that match the specified group of selectors.
	 *
	 * @method querySelectorAll
	 * @return {Array}
	 */
	querySelectorAll() {
		return [];
	}

	/**
	 * Redirect to url.
	 *
	 * @method redirect
	 */
	redirect() {}

	/**
	 * Push state to history API.
	 *
	 * @method pushStateToHistoryAPI
	 */
	pushStateToHistoryAPI() {}

	/**
	 * Bind event listener.
	 *
	 * @method bindEventListener
	 * @param {EventTarget} element
	 * @param {string} event
	 * @param {function} listener
	 * @param {boolean} [useCapture=false]
	 */
	bindEventListener(element, event, listener, useCapture = false) {}

	/**
	 * Unbind event listener.
	 *
	 * @method unbindEventListener
	 * @param {EventTarget} element
	 * @param {string} event
	 * @param {function} listener
	 * @param {boolean} [useCapture=false]
	 */
	unbindEventListener(element, event, listener, useCapture = false) {}

	/**
	 * PreventDefault action.
	 *
	 * @method preventDefault
	 */
	preventDefault() {}

}

ns.Core.Window.Server = Server;