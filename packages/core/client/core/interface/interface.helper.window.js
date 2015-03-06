import ns from 'core/namespace/ns.js';

ns.namespace('Core.Interface');

/**
 * Interface for window helper.
 *
 * @class WindowHelper
 * @namespace Core.Interface
 * @module Core
 * @submodule Core.Interface
 * */
class WindowHelper {

	/**
	 * @method constructor
	 * @constructor
	 * */
	constructor() {
	}

	/**
	 * Return true if is client side code.
	 *
	 * @method isClient
	 * @return {Boolean}
	 * */
	isClient() {

	}


	/**
	 * Return true if is session storage supported.
	 *
	 * @method isSessionStorage
	 * @return {Boolean}
	 * */
	isSessionStorage() {

	}

	/**
	 * Return true if websocket is supported.
	 *
	 * @method isWebSocket
	 * @return {Boolean}
	 * */
	isWebSocket() {

	}

	/**
	 * Get WebSocket interface.
	 *
	 * @method getWebSocket
	 * @return {WebSocket}
	 * */
	getWebSocket() {

	}

	/**
	 * Add event listener.
	 *
	 * @method addEventListener
	 * */
	addEventListener() {

	}

	/**
	 * Return object window.
	 *
	 * @method getWindow
	 * @return {Window|undefined}
	 * */
	getWindow() {
		
	}
}

ns.Core.Interface.WindowHelper = WindowHelper;