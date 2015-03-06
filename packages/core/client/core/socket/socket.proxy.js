import ns from 'core/namespace/ns.js';

ns.namespace('Core.Socket');

/**
 * Wrap for WebSocket.
 *
 * @class Proxy
 * @extends Core.Abstract.Socket
 * @namespace Core.Socket
 * @module Core
 * @submodule Core.Socket
 * */
class Proxy extends ns.Core.Abstract.Socket {

	/**
	 * @method constructor
	 * @constructor
	 * @param {Core.Dispatcher.Handler} dispatcher
	 * @param {Core.Socket.Factory} socketFactory
	 * @param {Core.Socket.Parser} socketParser
	 * @param {Object} config
	 * @param {Boolean} secure - flag for secure connection
	 *
	 * @example
	 *      proxy.open(url);
	 *      dispatcher.listen('socket.message.[event.type]', data);
	 *      proxy.close();
	 * */
	constructor(dispatcher, socketFactory, socketParser, config, secure) {
		super(dispatcher, config, 'websocket');

		/**
		 * @property _socksetFactory
		 * @private
		 * @type {Core.Socket.Factory}
		 * @default socketFactory
		 * */
		this._socketFactory = socketFactory;

		/**
		 * @property _socketParser
		 * @private
		 * @type {Core.Socket.Parser}
		 * @default socketParser
		 * */
		this._socketParser = socketParser;

		/**
		 * @property _secure
		 * @private
		 * @type {Boolean}
		 * @default secure
		 * */
		this._secure = secure;

		/**
		 * @property _repeatedAttempts
		 * @private
		 * @type {Number}
		 * @default 0
		 * */
		this._repeatedAttempts = 0;

		/**
		 * Keep flah for manually closed connection.
		 *
		 * @property _manuallyClosed
		 * @private
		 * @type {Number}
		 * @default false
		 * */
		this._manuallyClosed = false;

		/**
		 * @property _url
		 * @private
		 * @type {String}
		 * @default '';
		 * */
		this._url = '';
	}

	/**
	 * Open connection from server.
	 *
	 * @method open
	 * @param {String} [id]
	 * */
	open(id) {
		var url = this._createUrl(id);

		if (this._url !== url || !this.isOpened()) {
			this.close();
			this._url = url;
			this._connect();
		}
	}

	/**
	 * Close active connection.
	 *
	 * @method close
	 * */
	close() {
		if (this._connection && this._connection.readyState === 1) {
			this._manuallyClosed = true;
			this._connection.close();
			this._connection = null;
			this._repeatedAttempt = 0;
		}
	}

	/**
	 * Create url for connection.
	 *
	 * @method _createUrl
	 * @param {String} [id]
	 * @return {String}
	 * */
	_createUrl(id) {
		var protocol = this._secure ? 'wss:' : 'ws:';
		var url = protocol + this._baseUrl + '/' + this._technologie;

		if (id) {
			url += '/' + id;
		}

		return url;
	}

	/**
	 * Connect to server.
	 *
	 * @method _connect
	 * @private
	 * */
	_connect() {
		this._connection = this._socketFactory.createConnection(this._url);

		this._connection.onopen = (e) => this._open(e);
		this._connection.onmessage = (e) => this._message(e);
		this._connection.onerror = (e) => this._error(e);
		this._connection.onclose = (e) => this._close(e);
	}
	
	/**
	 * Connection was established.
	 *
	 * @method _open
	 * @private
	 * */
	_open() {
		this._repeatedAttempts = 0;
	}

	/**
	 * Message was received.
	 *
	 * @method _message
	 * @private
	 * @param {Event} e
	 * */
	_message(e) {
		this._socketParser.parse(e);
		this._dispatcher.fire(`socket.message.${this._socketParser.getType()}`, this._socketParser.getData());
	}

	/**
	 * Error was throwed.
	 *
	 * @method _error
	 * @private
	 * */
	_error() {
		this._repeatedAttempts++;
	}

	/**
	 * Connection was closed.
	 *
	 * @method _close
	 * @private
	 * */
	_close() {
		if (this._manuallyClosed === true) {
			this._manuallyClosed = false;
		} else {
			if (this._repeatedAttempts < this.MAX_REPEATED_ATTEMPTS) {
				this._connect();
			} else {
				throw ns.oc.create('$Error', `Core.Socket.Proxy:_close is received max number of attempts to connect with server throught socket.`);
			}
		}
	}

}

ns.Core.Socket.Proxy = Proxy;