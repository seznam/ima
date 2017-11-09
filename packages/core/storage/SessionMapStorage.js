import MapStorage from './MapStorage';
import SessionStorage from './SessionStorage';
import Storage from './Storage';
import CacheEntry from '../cache/CacheEntry';

/**
 * The {@codelink SessionMap} storage is an implementation of the
 * {@codelink Storage} interface acting as a synchronization proxy between
 * the underlying map storage and the {@code sessionStorage} DOM storage.
 */
export default class SessionMapStorage extends Storage {
  static get $dependencies() {
    return [MapStorage, SessionStorage];
  }

  /**
	 * Initializes the storage.
	 *
	 * @param {MapStorage} map The map storage to use.
	 * @param {SessionStorage} session The session storage to use.
	 */
  constructor(map, session) {
    super();

    /**
		 * The map storage, synced with the session storage.
		 *
		 * @type {MapStorage}
		 */
    this._map = map;

    /**
		 * The session storage, synced with the map storage.
		 *
		 * @type {SessionStorage}
		 */
    this._session = session;
  }

  /**
	 * @inheritdoc
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
	 */
  has(key) {
    return this._map.has(key);
  }

  /**
	 * @inheritdoc
	 */
  get(key) {
    return this._map.get(key);
  }

  /**
	 * @inheritdoc
	 */
  set(key, value) {
    let canBeSerializedToJSON =
      !(value instanceof Promise) &&
      (!(value instanceof CacheEntry) ||
        !(value.getValue() instanceof Promise));
    if (canBeSerializedToJSON) {
      this._session.set(key, value);
    }

    this._map.set(key, value);
    return this;
  }

  /**
	 * @inheritdoc
	 */
  delete(key) {
    this._session.delete(key);
    this._map.delete(key);
    return this;
  }

  /**
	 * @inheritdoc
	 */
  clear() {
    this._session.clear();
    this._map.clear();
    return this;
  }

  /**
	 * @inheritdoc
	 */
  keys() {
    return this._map.keys();
  }

  /**
	 * @override
	 */
  size() {
    return this._map.size();
  }
}
