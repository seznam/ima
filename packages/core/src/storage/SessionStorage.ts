import GenericError from '../error/GenericError';
import ImaStorage from './Storage';
import Window from '../window/Window';
import ClientWindow from '../window/ClientWindow';

/**
 * Implementation of the `link Storage` interface that relies on the
 * native `sessionStorage` DOM storage for storing its entries.
 */
export default class SessionStorage extends ImaStorage {
  private _storage: Storage;

  static get $dependencies() {
    return [Window];
  }

  /**
   * Initializes the session storage.
   */
  constructor(window: ClientWindow) {
    super();

    /**
     * The DOM storage providing the actual storage of the entries.
     */
    this._storage = window.getWindow().sessionStorage;
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
    return !!this._storage.getItem(key);
  }

  /**
   * @inheritdoc
   */
  get(key: string) {
    try {
      return JSON.parse(this._storage.getItem(key) as string).value;
    } catch (error) {
      throw new GenericError(
        'ima.storage.SessionStorage.get: Failed to parse a session ' +
        `storage item value identified by the key ${key}: ` +
        (error as Error).message
      );
    }
  }

  /**
   * @inheritdoc
   */
  set(key: string, value: unknown) {
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
   * @inheritdoc
   */
  delete(key: string) {
    this._storage.removeItem(key);
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
    return new StorageIterator(this._storage) as Iterable<string>;
  }

  /**
   * @override
   */
  size() {
    return this._storage.length;
  }

  /**
   * Deletes the oldest entry in this storage.
   */
  _deleteOldestEntry() {
    type Entry = {
      created: number;
      key?: string;
    };

    let oldestEntry: Entry = {
      created: Date.now() + 1,
    };

    for (const key of this.keys()) {
      const value = JSON.parse(this._storage.getItem(key) as string);
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
class StorageIterator {
  private _storage: Storage;
  private _currentKeyIndex: number;

  /**
   * Initializes the DOM storage iterator.
   *
   * @param {Storage} storage The DOM storage to iterate through.
   */
  constructor(storage: Storage) {
    /**
     * The DOM storage being iterated.
     *
     * @type {Storage}
     */
    this._storage = storage;

    /**
     * The current index of the DOM storage key this iterator will return
     * next.
     *
     * @type {number}
     */
    this._currentKeyIndex = 0;
  }

  /**
   * Iterates to the next item. This method implements the iterator protocol.
   *
   * @return {{done: boolean, value: (undefined|string)}} The next value in
   *         the sequence and whether the iterator is done iterating through
   *         the values.
   */
  next() {
    if (this._currentKeyIndex >= this._storage.length) {
      return {
        done: true,
        value: undefined,
      };
    }

    const key = this._storage.key(this._currentKeyIndex);
    this._currentKeyIndex++;

    return {
      done: false,
      value: key,
    };
  }

  /**
   * Returns the iterator for this object (this iterator). This method
   * implements the iterable protocol and provides compatibility with the
   * `for..of` loops.
   *
   * @return {StorageIterator} This iterator.
   */
  [Symbol.iterator]() {
    return this;
  }
}
