import ns from 'ima/namespace';
import StorageInterface from 'ima/storage/storage';
import CacheEntry from 'ima/cache/cacheEntry';

ns.namespace('ima.storage');

/**
 * The {@codelink SessionMap} storage is an implementation of the
 * {@codelink ima.storage.Storage} interface acting as a synchronization
 * proxy between
 *
 * @class SessionMapStorage
 * @implements ima.storage.Storage
 * @namespace ima.storage
 * @module ima
 * @submodule ima.storage
 *
 * @requires ima.storage.MapStorage
 * @requires ima.storage.SessionStorage
 */
export default class SessionMapStorage extends StorageInterface {
	/**
	 * Initializes the storage.
	 *
	 * @constructor
	 * @method constructor
	 * @param {ima.storage.MapStorage} map The map storage to use.
	 * @param {ima.storage.SessionStorage} session The session storage to use.
	 */
	constructor(map, session) {
		super();

		/**
		 * The map storage, synced with the session storage.
		 *
		 * @private
		 * @property _map
		 * @type {ima.storage.MapStorage}
		 */
		this._map = map;

		/**
		 * The session storage, synced with the map storage.
		 *
		 * @private
		 * @property _session
		 * @type {ima.storage.SessionStorage}
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

ns.ima.storage.SessionMapStorage = SessionMapStorage;
