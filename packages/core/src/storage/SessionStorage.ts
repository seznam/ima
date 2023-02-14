import { Storage as ImaStorage } from './Storage';
import { GenericError } from '../error/GenericError';
import { Dependencies } from '../ObjectContainer';
import { ClientWindow } from '../window/ClientWindow';
import { Window } from '../window/Window';

/**
 * Implementation of the `link Storage` interface that relies on the
 * native `sessionStorage` DOM storage for storing its entries.
 */
export class SessionStorage<V> extends ImaStorage<V> {
  /**
   * The DOM storage providing the actual storage of the entries.
   */
  private _storage: Storage;

  static get $dependencies(): Dependencies {
    return [Window];
  }

  /**
   * Initializes the session storage.
   */
  constructor(window: ClientWindow) {
    super();

    this._storage = window.getWindow().sessionStorage;
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
    return !!this._storage.getItem(key);
  }

  /**
   * @inheritDoc
   */
  get(key: string): V | undefined {
    try {
      return JSON.parse(this._storage.getItem(key) as string)?.value;
    } catch (error) {
      throw new GenericError(
        'ima.storage.SessionStorage.get: Failed to parse a session ' +
          `storage item value identified by the key ${key}: ` +
          (error as Error).message
      );
    }
  }

  /**
   * @inheritDoc
   */
  set(key: string, value: V): this {
    try {
      this._storage.setItem(
        key,
        JSON.stringify({
          created: Date.now(),
          value,
        })
      );
    } catch (error) {
      const storage = this._storage;
      const isItemTooBig =
        storage.length === 0 ||
        (storage.length === 1 && storage.key(0) === key);

      if (isItemTooBig) {
        throw error;
      }

      this._deleteOldestEntry();
      this.set(key, value);
    }

    return this;
  }

  /**
   * @inheritDoc
   */
  delete(key: string): this {
    this._storage.removeItem(key);

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
    return new StorageIterator(this._storage);
  }

  /**
   * @override
   */
  size(): number {
    return this._storage.length;
  }

  /**
   * Deletes the oldest entry in this storage.
   */
  _deleteOldestEntry(): void {
    type Entry = {
      created: number;
      key?: string;
    };

    let oldestEntry: Entry = {
      created: Date.now() + 1,
    };

    for (const key of this.keys()) {
      const value = JSON.parse(this._storage.getItem(key) as string) as Entry;

      if (value.created < oldestEntry.created) {
        oldestEntry = {
          key,
          created: value.created,
        };
      }
    }

    if (typeof oldestEntry.key === 'string') {
      this.delete(oldestEntry.key);
    }
  }
}

/**
 * Implementation of the iterator protocol and the iterable protocol for DOM
 * storage keys.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
 */
class StorageIterator implements Iterable<string> {
  /**
   * The DOM storage being iterated.
   */
  private _storage: Storage;
  /**
   * The current index of the DOM storage key this iterator will return
   * next.
   */
  private _currentKeyIndex = 0;

  /**
   * Initializes the DOM storage iterator.
   *
   * @param storage The DOM storage to iterate through.
   */
  constructor(storage: Storage) {
    this._storage = storage;
  }

  /**
   * Iterates to the next item. This method implements the iterator protocol.
   *
   * @return The next value in
   *         the sequence and whether the iterator is done iterating through
   *         the values.
   */
  next(): IteratorResult<string> {
    // We are sure there is always a value so it can be safely cast to string
    const key = this._storage.key(this._currentKeyIndex) as string;

    return {
      done: this._currentKeyIndex++ === this._storage.length,
      value: key,
    };
  }

  /**
   * Returns the iterator for this object (this iterator). This method
   * implements the iterable protocol and provides compatibility with the
   * `for..of` loops.
   *
   * @return This iterator.
   */
  [Symbol.iterator](): this {
    return this;
  }
}
