import ns from '../namespace';
import MapStorage from './MapStorage';
import SessionStorage from './SessionStorage';
import Storage from './Storage';
import CacheEntry from '../cache/CacheEntry';

ns.namespace('ima.storage');

/**
 * The {@codelink SessionMap} storage is an implementation of the
 * {@codelink Storage} interface acting as a synchronization proxy between
 * the underlying map storage and the {@code sessionStorage} DOM storage.
 *
 * @class SessionMapStorage
 * @implements Storage
 * @namespace ima.storage
 * @module ima
 * @submodule ima.storage
 *
 * @requires MapStorage
 * @requires SessionStorage
 */
export default class SessionMapStorage extends Storage {

	static get $dependencies() {
		return [MapStorage, SessionStorage];
	}

	/**
	 * Initializes the storage.
	 *
	 * @constructor
	 * @method constructor
	 * @param {MapStorage} map The map storage to use.
	 * @param {SessionStorage} session The session storage to use.
	 */
	constructor(map, session) {
		super();

		/**
		 * The map storage, synced with the session storage.
		 *
		 * @private
		 * @property _map
		 * @type {MapStorage}
		 */
		this._map = map;

		/**
		 * The session storage, synced with the map storage.
		 *
		 * @private
		 * @property _session
		 * @type {SessionStorage}
		 */
		this._session = session;
	}

	/**
	 * @inheritdoc
	 * @method init
	 */
	init() {
		this._map.clear();
		for (let key of this._session.keys()) {
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
		let canBeSerializedToJSON =
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
