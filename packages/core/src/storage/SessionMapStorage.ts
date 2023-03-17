import { MapStorage } from './MapStorage';
import { SessionStorage } from './SessionStorage';
import { Storage } from './Storage';
import { CacheEntry } from '../cache/CacheEntry';
import { Dependencies } from '../ObjectContainer';

/**
 * The `link SessionMap` storage is an implementation of the
 * `link Storage` interface acting as a synchronization proxy between
 * the underlying map storage and the `sessionStorage` DOM storage.
 */
export class SessionMapStorage<V> extends Storage<V> {
  /**
   * The map storage, synced with the session storage.
   */
  private _map: MapStorage<V>;
  /**
   * The session storage, synced with the map storage.
   */
  private _session: SessionStorage<V>;

  static get $dependencies(): Dependencies {
    return [MapStorage, SessionStorage];
  }

  /**
   * Initializes the storage.
   *
   * @param map The map storage to use.
   * @param session The session storage to use.
   */
  constructor(map: MapStorage<V>, session: SessionStorage<V>) {
    super();

    this._map = map;

    this._session = session;
  }

  /**
   * @inheritDoc
   */
  init(): this {
    this._map.clear();

    for (const key of this._session.keys()) {
      if (!key) {
        continue;
      }

      const sessionValue = this._session.get(key);

      if (sessionValue) {
        this._map.set(key as string, sessionValue);
      }
    }

    return this;
  }

  /**
   * @inheritDoc
   */
  has(key: string): boolean {
    return this._map.has(key);
  }

  /**
   * @inheritDoc
   */
  get(key: string): V | undefined {
    return this._map.get(key);
  }

  /**
   * @inheritDoc
   */
  set(key: string, value: V): this {
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
   * @inheritDoc
   */
  delete(key: string): this {
    this._session.delete(key);
    this._map.delete(key);

    return this;
  }

  /**
   * @inheritDoc
   */
  clear(): this {
    this._session.clear();
    this._map.clear();

    return this;
  }

  /**
   * @inheritDoc
   */
  keys(): Iterable<string> {
    return this._map.keys();
  }

  /**
   * @override
   */
  size(): number {
    return this._map.size();
  }
}
