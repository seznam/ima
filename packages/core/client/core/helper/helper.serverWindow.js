import ns from 'core/namespace/ns.js';

ns.namespace('Core.Helper');

/**
 * @class ServerWindow
 * @extends ns.Core.Interface.Window
 * @namespace Core.Helper
 * @module Core
 * @submodule Core.Helper
 */
class ServerWindow extends ns.Core.Interface.Window {

	/**
	 * @method constructor
	 * @constructor
	 */
	constructor() {
		super();
	}

	/**
	 * Return true if is client side code.
	 *
	 * @method isClient
	 * @return {boolean}
	 */
	isClient() {
		return false;
	}


	/**
	 * Return true if is session storage supported.
	 *
	 * @method hasSessionStorage
	 * @return {boolean}
	 */
	hasSessionStorage() {
		return false;
	}

	/**
	 * Return true if websocket is supported.
	 *
	 * @method hasWebSocket
	 * @return {boolean}
	 */
	hasWebSocket() {
		return false;
	}

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
	 * Return window object.
	 *
	 * @method getWindow
	 * @return {undefined}
	 */
	getWindow() {
		return undefined;
	}

	/**
	 * Return current domain.
	 *
	 * @method getDomain
	 * @return {string}
	 */
	getDomain() {
		return '';
	}

	/**
	 * Return current path.
	 *
	 * @method getPath
	 * @return {string}
	 */
	getPath() {
		return '';
	}

	/**
	 * Return current url.
	 *
	 * @method getUrl
	 * @return {string}
	 */
	getUrl() {
		return '';
	}

	/**
	 * Return body element.
	 *
	 * @method getBody
	 * @return {undefined}
	 */
	getBody() {
		return undefined;
	}

	/**
	 * Redirect to url.
	 *
	 * @method redirect
	 */
	redirect() {

	}

	/**
	 * Push state to history API.
	 *
	 * @method pushStateToHistoryAPI
	 */
	pushStateToHistoryAPI() {

	}

	/**
	 * Add event listener.
	 *
	 * @method addEventListener
	 */
	addEventListener() {

	}

	/**
	 * PreventDefault action.
	 *
	 * @method preventDefault
	 */
	preventDefault() {

	}

}

ns.Core.Helper.ServerWindow = ServerWindow;