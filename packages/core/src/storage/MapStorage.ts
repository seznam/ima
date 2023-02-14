import { Storage } from './Storage';
import { Dependencies } from '../ObjectContainer';

/**
 * Implementation of the `link Storage` interface that relies on the
 * native `Map` for storage.
 */
export class MapStorage<V> extends Storage<V> {
  /**
   * The internal storage of entries.
   */
  private _storage: Map<string, V> = new Map();

  static get $dependencies(): Dependencies {
    return [];
  }

  /**
   * @inheritDoc
   */
  init(): this {
    return this;
  }

  /**
   * @inheritDoc
   */
  has(key: string): boolean {
    return this._storage.has(key);
  }

  /**
   * @inheritDoc
   */
  get(key: string): V | undefined {
    return this._storage.get(key);
  }

  /**
   * @inheritDoc
   */
  set(key: string, value: V): this {
    this._storage.set(key, value);

    return this;
  }

  /**
   * @inheritDoc
   */
  delete(key: string): this {
    this._storage.delete(key);

    return this;
  }

  /**
   * @inheritDoc
   */
  clear(): this {
    this._storage.clear();

    return this;
  }

  /**
   * @inheritDoc
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
