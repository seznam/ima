import ns from 'core/namespace/ns.js';

ns.namespace('Core.Socket');

/**
 * Factory for create instance of WebSocket.
 *
 * @class Factory
 * @namespace Core.Socket
 * @module Core
 * @submodule Core.Socket
 * */
class Factory {

	/**
	 * @method constructor
	 * @constructor
	 * @param {WebSocket} webSocket
	 * */
	constructor(webSocket) {
		/**
		 * @property _webSocket
		 * @type {WebSocket}
		 * @default webSocket
		 * */
		this._webSocket = webSocket;

	}

	/**
	 * Create new WebSocket connection.
	 *
	 * @method createConnection
	 * */
	createConnection(url) {
		return new this._webSocket(url);
	}
}

ns.Core.Socket.Factory = Factory;