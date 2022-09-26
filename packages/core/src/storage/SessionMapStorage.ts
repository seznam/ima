import MapStorage from './MapStorage';
import SessionStorage from './SessionStorage';
import Storage from './Storage';
import CacheEntry from '../cache/CacheEntry';

/**
 * The `link SessionMap` storage is an implementation of the
 * `link Storage` interface acting as a synchronization proxy between
 * the underlying map storage and the `sessionStorage` DOM storage.
 */
export default class SessionMapStorage extends Storage {
  private _map: MapStorage;
  private _session: SessionStorage;

  static get $dependencies() {
    return [MapStorage, SessionStorage];
  }

  /**
   * Initializes the storage.
   *
   * @param map The map storage to use.
   * @param session The session storage to use.
   */
  constructor(map: MapStorage, session: SessionStorage) {
    super();

    /**
     * The map storage, synced with the session storage.
     */
    this._map = map;

    /**
     * The session storage, synced with the map storage.
     */
    this._session = session;
  }

  /**
   * @inheritdoc
   */
  init() {
    this._map.clear();
    for (const key of this._session.keys()) {
      this._map.set(key as string, this._session.get(key));
    }

    return this;
  }

  /**
   * @inheritdoc
   */
  has(key: string) {
    return this._map.has(key);
  }

  /**
   * @inheritdoc
   */
  get(key: string) {
    return this._map.get(key);
  }

  /**
   * @inheritdoc
   */
  set(key: string, value: unknown) {
    const canBeSerializedToJSON =
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
  delete(key: string) {
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
