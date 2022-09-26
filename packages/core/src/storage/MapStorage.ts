import Storage from './Storage';

/**
 * Implementation of the `link Storage` interface that relies on the
 * native `Map` for storage.
 */
export default class MapStorage implements Storage {
  protected _storage: Map<string, unknown>;

  static get $dependencies() {
    return [];
  }

  /**
   * Initializes the map storage.
   */
  constructor() {
    /**
     * The internal storage of entries.
     *
     * @protected
     * @type {Map<string, *>}
     */
    this._storage = new Map();
  }

  /**
   * @inheritdoc
   */
  init() {
    return this;
  }

  /**
   * @inheritdoc
   */
  has(key: string) {
    return this._storage.has(key);
  }

  /**
   * @inheritdoc
   */
  get(key: string) {
    return this._storage.get(key);
  }

  /**
   * @inheritdoc
   */
  set(key: string, value: unknown) {
    this._storage.set(key, value);
    return this;
  }

  /**
   * @inheritdoc
   */
  delete(key: string) {
    this._storage.delete(key);
    return this;
  }

  /**
   * @inheritdoc
   */
  clear() {
    this._storage.clear();
    return this;
  }

  /**
   * @inheritdoc
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
