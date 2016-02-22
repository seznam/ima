import ns from 'ima/namespace';
import Storage from 'ima/interface/storage';
import CacheEntry from 'ima/cache/cacheEntry';

ns.namespace('Ima.Storage');

/**
 * The {@codelink SessionMap} storage is an implementation of the
 * {@codelink Ima.Interface.Storage} interface acting as a synchronization
 * proxy between
 *
 * @class SessionMap
 * @implements Ima.Interface.Storage
 * @namespace Ima.Storage
 * @module Ima
 * @submodule Ima.Storage
 *
 * @requires Ima.Storage.Map
 * @requires Ima.Storage.Session
 */
export default class SessionMap extends Storage {
	/**
	 * Initializes the storage.
	 *
	 * @constructor
	 * @method constructor
	 * @param {Ima.Storage.Map} map The map storage to use.
	 * @param {Ima.Storage.Session} session The session storage to use.
	 */
	constructor(map, session) {
		super();

		/**
		 * The map storage, synced with the session storage.
		 *
		 * @private
		 * @property _map
		 * @type {Ima.Storage.Map}
		 */
		this._map = map;

		/**
		 * The session storage, synced with the map storage.
		 *
		 * @private
		 * @property _session
		 * @type {Ima.Storage.Session}
		 */
		this._session = session;
	}

	/**
	 * @inheritdoc
	 * @method init
	 */
	init() {
		this._map.clear();
		for (var key of this._session.keys()) {
			this._map.set(key, this._session[key]);
		}

		return this;
	}

	/**
	 * @inheritdoc
	 * @method has
	 */
	has(key) {
		return this._map.has(key);
	}

	/**
	 * @inheritdoc
	 * @method get
	 */
	get(key) {
		return this._map.get(key);
	}

	/**
	 * @inheritdoc
	 * @method set
	 */
	set(key, value) {
		var canBeSerializedToJSON =
				!(value instanceof Promise) &&
				(
					!(value instanceof CacheEntry) ||
					!(value.getValue() instanceof Promise)
				);
		if (canBeSerializedToJSON) {
			this._session.set(key, value);
		}

		this._map.set(key, value);
		return this;
	}

	/**
	 * @inheritdoc
	 * @method delete
	 */
	delete(key) {
		this._session.delete(key);
		this._map.delete(key);
		return this;
	}

	/**
	 * @inheritdoc
	 * @method clear
	 */
	clear() {
		this._session.clear();
		this._map.clear();
		return this;
	}

	/**
	 * @inheritdoc
	 * @method keys
	 */
	keys() {
		return this._map.keys();
	}

	/**
	 * @override
	 * @method size
	 */
	size() {
		return this._map.size();
	}
}

ns.Ima.Storage.SessionMap = SessionMap;
