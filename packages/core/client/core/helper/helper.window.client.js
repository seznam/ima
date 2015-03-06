import ns from 'core/namespace/ns.js';

ns.namespace('Core.Helper');

/**
 * @class WindowClient
 * @extends ns.Core.Interface.WindowHelper
 * @namespace Core.Helper
 * @module Core
 * @submodule Core.Helper
 * */
class WindowClient extends ns.Core.Interface.WindowHelper {

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
		return true;
	}


	/**
	 * Return true if is session storage supported.
	 *
	 * @method isSessionStorage
	 * @return {Boolean}
	 * */
	isSessionStorage() {
		return typeof window.sessionStorage !== 'undefined' && window.sessionStorage !== null;
	}

	/**
	 * Return true if websocket is supported.
	 *
	 * @method isWebSocket
	 * @return {Boolean}
	 * */
	isWebSocket() {
		return window.WebSocket || window.MozWebSocket;
	}

	/**
	 * Get WebSocket interface.
	 *
	 * @method getWebSocket
	 * @return {WebSocket}
	 * */
	getWebSocket() {
		return window.WebSocket || window.MozWebSocket;
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
	addEventListener(element, event, listener, useCapture) {
		if (element.addEventListener) {
			element.addEventListener(event, listener, useCapture);
		} else {

			if (element.attachEvent) {
				element.attachEvent(`on${event}`, listener);
			}
		}
	}

	/**
	 * Return window object.
	 *
	 * @method getWindow
	 * @return {Window}
	 * */
	getWindow() {
		return window;
	}

}

ns.Core.Helper.WindowClient = WindowClient;