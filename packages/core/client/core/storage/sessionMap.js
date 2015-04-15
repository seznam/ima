import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core.Storage');

/**
 * Session map storage.
 *
 * @class SessionMap
 * @extends Core.Interface.Storage
 * @namespace Core.Storage
 * @module Core
 * @submodule Core.Storage
 *
 * @requires Core.Storage.Map
 * @requires Core.Storage.Session
 */
class SessionMap extends ns.Core.Interface.Storage {

	/**
	 * @method constructor
	 * @constructor
	 * @param {Core.Storage.Map} map
	 * @param {Core.Storage.Session} session
	 */
	constructor(map, session) {
		super();

		/**
		 * @property _map
		 * @private
		 * @type {Core.Storage.Map}
		 * @default map
		 */
		this._map = map;

		/**
		 * @property _session
		 * @private
		 * @type {Core.Storage.Session}
		 * @default session
		 */
		this._session = session;
	}

	/**
	 * Initialize the storage.
	 * @method init
	 * @chainable
	 * @return {Core.Storage.Session} Current instance
	 */
	init() {
		this._map.clear();
		for (var i = 0; i < this._session.length; i++) {
			var key = this._session.key(i);
			this._map.set(key, this._session[key]);
		}
		return this;
	}

	/**
	 * Clear the storage.
	 * @method clear
	 * @chainable
	 * @return {Core.Storage.Session} Current instance
	 */
	clear() {
		this._session.clear();
		this._map.clear();
		return this;
	}

	/**
	 * Checks if an item with the given name exists.
	 * @method has
	 * @param {String} name
	 * @return {Boolean}
	 */
	has(name) {
		return this._map.has(name);
	}

	/**
	 * Returns a value of the given item.
	 * @method get
	 * @param {String} name
	 * @return {*}
	 */
	get(name) {
		return this._map.get(name);
	}

	/**
	 * Saves the value under the given name.
	 * @method set
	 * @chainable
	 * @param {String} name
	 * @param {*} value
	 * @return {Core.Storage.Session} Current instance
	 */
	set(name, value) {
		this._session.set(name, value);
		return this._map.set(name, value);
	}

	/**
	 * Deletes the item.
	 * @method delete
	 * @chainable
	 * @param {String} name
	 * @return {Core.Storage.Session} Current instance
	 */
	delete(name) {
		this._session.delete(name);
		return this._map.delete(name);
	}

	/**
	 * Returns an iterator containing keys.
	 * 
	 * @method keys
	 * @return {Iterator} Keys iterator.
	 */
	keys() {
		return this._map.keys();
	}
}

ns.Core.Storage.SessionMap = SessionMap;