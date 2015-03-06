import ns from 'core/namespace/ns.js';

ns.namespace('Core.Helper');

/**
 * @class WindowServer
 * @extends ns.Core.Interface.WindowHelper
 * @namespace Core.Helper
 * @module Core
 * @submodule Core.Helper
 * */
class WindowServer extends ns.Core.Interface.WindowHelper {

	/**
	 * @method constructor
	 * @constructor
	 * */
	constructor() {
		super();
	}

	/**
	 * Return true if is client side code.
	 *
	 * @method isClient
	 * @return {Boolean}
	 * */
	isClient() {
		return false;
	}


	/**
	 * Return true if is session storage supported.
	 *
	 * @method isSessionStorage
	 * @return {Boolean}
	 * */
	isSessionStorage() {
		return false;
	}

	/**
	 * Return true if websocket is supported.
	 *
	 * @method isWebSocket
	 * @return {Boolean}
	 * */
	isWebSocket() {
		return false;
	}

	/**
	 * Get WebSocket interface.
	 *
	 * @method getWebSocket
	 * @return {WebSocket}
	 * */
	getWebSocket() {

		function WebSocket() {
			this.open = () => {};
			this.close = () => {};
			this.send = () => {};
		}

		return WebSocket;
	}

	/**
	 * Add event listener.
	 *
	 * @method addEventListener
	 * @param {NodeElement} element
	 * @param {String} event
	 * @param {Function} listener
	 * @param {Boolean} useCapture
	 * */
	addEventListener() { // jshint ignore:line

	}

	/**
	 * Return window object.
	 *
	 * @method getWindow
	 * @return {undefined}
	 * */
	getWindow() {
		return undefined;
	}

}

ns.Core.Helper.WindowServer = WindowServer;