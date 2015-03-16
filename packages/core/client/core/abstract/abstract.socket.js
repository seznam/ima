import ns from 'core/namespace/ns.js';

ns.namespace('Core.Abstract');

/**
 * Abstract class for socket communication.
 *
 * @class Socket
 * @extends Core.Interface.Socket
 * @namespace Core.Abstract
 * @module Core
 * @submodule Core.Abstract
 *
 * @requires Core.Interface.Dispatcher
 * */
class Socket extends ns.Core.Interface.Socket {

	/**
	 * @method constructor
	 * @constructor
	 * @param {Core.Interface.Dispatcher} dispatcher
	 * @param {Object} config
	 * @param {String} technologie
	 * */
	constructor(dispatcher, config, technologie) {
		super();

		/**
		 * @property _dispatcher
		 * @protected
		 * @type {Core.Interface.Dispatcher}
		 * @default dispatcher
		 * */
		this._dispatcher = dispatcher;

		/**
		 * @property _baseUrl
		 * @protected
		 * @type {String}
		 * @default socketUrl
		 * */
		this._baseUrl = config.webSocketUrl;

		/**
		 * @property _connection
		 * @protected
		 * @type {WebSocket}
		 * @default null
		 * */
		this._connection = null;

		/**
		 * @property _technologie
		 * @protected
		 * @type {String}
		 * @default technologie
		 * */
		this._technologie = technologie;

		/**
		 * @property MAX_REPEATED_ATTEMPTS
		 * @const
		 * @type {Number}
		 * @default maxRepeatedAttempts
		 * */
		this.MAX_REPEATED_ATTEMPTS = config.maxRepeatedAttempts;

	}

	/**
	 * Open connection to server.
	 *
	 * @method open
	 * */
	open() {

	}

	/**
	 * Close connection from server.
	 *
	 * @method close
	 * */
	close() {

	}

	/**
	 * Return true if connection is opened.
	 *
	 * @method isOpened
	 * @return {Boolean}
	 * */
	isOpened() {
		return !!this._connection;
	}

	/**
	 * Send messsage to server
	 *
	 * @method send
	 * */
	send() {
		throw new Error('Core.Abstract.Socket:send method must be implemented.');
	}
}

ns.Core.Abstract.Socket = Socket;