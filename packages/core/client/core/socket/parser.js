import ns from 'imajs/client/core/namespace.js';
import CoreError from 'imajs/client/core/coreError.js';

ns.namespace('Core.Socket');

/**
 * Message parser for WebSocket.
 *
 * @class Parser
 * @namespace Core.Socket
 * @module Core
 * @submodule Core.Socket
 */
class Parser {

	/**
	 * @method constructor
	 * @constructor
	 */
	constructor() {

		/**
		 * @property TYPE_UNKNOWN
		 * @const
		 * @type {String}
		 * @default 'unknown'
		 */
		this.TYPE_UNKNOWN = 'unknown';


		/**
		 * @property _type
		 * @private
		 * @type {String}
		 * @default TYPE_UNKNOWN
		 */
		this._type = this.TYPE_UNKNOWN;

		/**
		 * @property _data
		 * @private
		 * @type {Object}
		 * @default {}
		 */
		this._data = {};

	}
	
	/**
	 * Parse socket event from server.
	 *
	 * @method parse
	 * @param {MessageEvent} event
	 */
	parse(event) {
		if (typeof event.data === 'string') {

			try{
				var parsedJSON = JSON.parse(event.data);

				if (parsedJSON.event) {
					this._data = parsedJSON.event.data;
					this._type = parsedJSON.event.type || this.TYPE_UNKNOWN;
				} else {
					throw new CoreError(`Core.Socket.Parser:parse - Method has bad format from server. Message hasn't property event.`, {event: event});
				}
			}catch(err) {
				throw new CoreError(err.message, err);
			}

		} else {
			this._data = event.data || {};
			this._type = this._data.type || this.TYPE_UNKNOWN;
		}
	}

	/**
	 * Return message type.
	 *
	 * @method getType
	 * @return {String}
	 */
	getType() {
		return this._type;
	}

	/**
	 * Return message data.
	 *
	 * @method getData
	 * @return {Object}
	 */
	getData() {
		return this._data;
	}

}

ns.Core.Socket.Parser = Parser;