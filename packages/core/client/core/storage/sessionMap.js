import ns from 'imajs/client/core/namespace';
import Storage from 'imajs/client/core/interface/storage';
import Entry from 'imajs/client/core/cache/entry';

ns.namespace('Core.Storage');

/**
 * The {@codelink SessionMap} storage is an implementation of the
 * {@codelink Core.Interface.Storage} interface acting as a synchronization
 * proxy between
 *
 * @class SessionMap
 * @implements Core.Interface.Storage
 * @namespace Core.Storage
 * @module Core
 * @submodule Core.Storage
 *
 * @requires Core.Storage.Map
 * @requires Core.Storage.Session
 */
export default class SessionMap extends Storage {
	/**
	 * Initializes the storage.
	 *
	 * @constructor
	 * @method constructor
	 * @param {Core.Storage.Map} map The map storage to use.
	 * @param {Core.Storage.Session} session The session storage to use.
	 */
	constructor(map, session) {
		super();

		/**
		 * The map storage, synced with the session storage.
		 *
		 * @private
		 * @property _map
		 * @type {Core.Storage.Map}
		 */
		this._map = map;

		/**
		 * The session storage, synced with the map storage.
		 *
		 * @private
		 * @property _session
		 * @type {Core.Storage.Session}
		 */
		this._session = session;
	}

	/**
	 * @inheritDoc
	 * @override
	 * @chainable
	 * @method init
	 * @return {Core.Interface.Storage}
	 */
	init() {
		this._map.clear();
		for (var key of this._session.keys()) {
			this._map.set(key, this._session[key]);
		}

		return this;
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method has
	 * @param {string} key
	 * @return {boolean}
	 */
	has(key) {
		return this._map.has(key);
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method get
	 * @param {string} key
	 * @return {*}
	 */
	get(key) {
		return this._map.get(key);
	}

	/**
	 * @inheritDoc
	 * @override
	 * @chainable
	 * @method set
	 * @param {string} key
	 * @param {*} value
	 * @return {Core.Storage.SessionMap}
	 */
	set(key, value) {
		var canBeSerializedToJSON =
				!(value instanceof Promise) &&
				(
					!(value instanceof Entry) ||
					!(value.getValue() instanceof Promise)
				);
		if (canBeSerializedToJSON) {
			this._session.set(key, value);
		}

		this._map.set(key, value);
		return this;
	}

	/**
	 * @inheritDoc
	 * @override
	 * @chainable
	 * @method delete
	 * @param {string} key
	 * @return {Core.Storage.SessionMap}
	 */
	delete(key) {
		this._session.delete(key);
		this._map.delete(key);
		return this;
	}

	/**
	 * @inheritDoc
	 * @override
	 * @chainable
	 * @method clear
	 * @return {Core.Storage.SessionMap}
	 */
	clear() {
		this._session.clear();
		this._map.clear();
		return this;
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method keys
	 * @return {Iterator<string>}
	 */
	keys() {
		return this._map.keys();
	}

	/**
	 * @override
	 * @method size
	 * @return {number}
	 */
	size() {
		return this._map.size();
	}
}

ns.Core.Storage.SessionMap = SessionMap;
