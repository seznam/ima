import Storage from './Storage';

/**
 * Implementation of the `link Storage` interface that relies on the
 * native `Map` for storage.
 */
export default class MapStorage<V> extends Storage<V> {
  /**
   * The internal storage of entries.
   */
  private _storage: Map<string, V> = new Map();

  // TODO type dependencies
  static get $dependencies() {
    return [];
  }

  /**
   * @inheritdoc
   */
  init(): this {
    return this;
  }

  /**
   * @inheritdoc
   */
  has(key: string): boolean {
    return this._storage.has(key);
  }

  /**
   * @inheritdoc
   */
  get(key: string): V | undefined {
    return this._storage.get(key);
  }

  /**
   * @inheritdoc
   */
  set(key: string, value: V): this {
    this._storage.set(key, value);

    return this;
  }

  /**
   * @inheritdoc
   */
  delete(key: string): this {
    this._storage.delete(key);

    return this;
  }

  /**
   * @inheritdoc
   */
  clear(): this {
    this._storage.clear();

    return this;
  }

  /**
   * @inheritdoc
   */
  keys(): Iterable<string> {
    return this._storage.keys();
  }

  /**
   * @override
   */
  size(): number {
    return this._storage.size;
  }
}
