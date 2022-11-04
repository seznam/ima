import Storage from './Storage';

/**
 * Implementation of the `link Storage` interface that relies on the
 * native `Map` for storage.
 */
export default class MapStorage extends Storage {
  /**
   * The internal storage of entries.
   */
  private _storage: Map<string, unknown> = new Map();

  static get $dependencies(): unknown[] {
    return [];
  }

  /**
   * @inheritDoc
   */
  init() {
    return this;
  }

  /**
   * @inheritDoc
   */
  has(key: string) {
    return this._storage.has(key);
  }

  /**
   * @inheritDoc
   */
  get(key: string) {
    return this._storage.get(key);
  }

  /**
   * @inheritDoc
   */
  set(key: string, value: unknown) {
    this._storage.set(key, value);
    return this;
  }

  /**
   * @inheritDoc
   */
  delete(key: string) {
    this._storage.delete(key);
    return this;
  }

  /**
   * @inheritDoc
   */
  clear() {
    this._storage.clear();
    return this;
  }

  /**
   * @inheritDoc
   */
  keys() {
    return this._storage.keys();
  }

  /**
   * @override
   */
  size() {
    return this._storage.size;
  }
}
