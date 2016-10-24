import ns from '../namespace';
import GenericError from '../error/GenericError';
import Storage from './Storage';

ns.namespace('ima.storage');

/**
 * Implementation of the {@codelink Storage} interface that relies on the
 * native {@code sessionStorage} DOM storage for storing its entries.
 *
 * @class SessionStorage
 * @implements Storage
 * @namespace ima.storage
 * @module ima
 * @submodule ima.storage
 *
 * @requires SessionStorage
 */
export default class SessionStorage extends Storage {

	static get $dependencies() {
		return [];
	}

	/**
	 * Initializes the session storage.
	 *
	 * @constructor
	 * @method constructor
	 */
	constructor() {
		super();

		/**
		 * The DOM storage providing the actual storage of the entries.
		 *
		 * @private
		 * @property _storage
		 * @type {Storage}
		 */
		this._storage = window.sessionStorage;
	}

	/**
	 * @inheritdoc
	 * @method init
	 */
	init() {
		return this;
	}

	/**
	 * @inheritdoc
	 * @method has
	 */
	has(key) {
		return !!this._storage.getItem(key);
	}

	/**
	 * @inheritdoc
	 * @method get
	 */
	get(key) {
		try {
			return JSON.parse(this._storage.getItem(key)).value;
		} catch (e) {
			throw new GenericError('ima.storage.SessionStorage.get: Failed ' +
					`to parse a session storage item value identified by ` +
					`the key ${key}: ${e.message}`);
		}
	}

	/**
	 * @inheritdoc
	 * @method set
	 */
	set(key, value) {
		try {
			this._storage.setItem(key, JSON.stringify({
				created: Date.now(),
				value
			}));
		} catch (e) {
			let storage = this._storage;
			let isItemTooBig = storage.length === 0 ||
					storage.length === 1 &&
					storage.key(0) === key;

			if (isItemTooBig) {
				throw e;
			}

			this._deleteOldestEntry();
			this.set(key, value);
		}

		return this;
	}

	/**
	 * @inheritdoc
	 * @method delete
	 */
	delete(key) {
		this._storage.removeItem(key);
		return this;
	}

	/**
	 * @inheritdoc
	 * @method clear
	 */
	clear() {
		this._storage.clear();
		return this;
	}

	/**
	 * @inheritdoc
	 * @method keys
	 */
	keys() {
		return new StorageIterator(this._storage);
	}

	/**
	 * @override
	 * @method size
	 */
	size() {
		return this._storage.length;
	}

	/**
	 * Deletes the oldest entry in this storage.
	 *
	 * @private
	 * @method _deleteOldestEntry
	 */
	_deleteOldestEntry() {
		let oldestEntry = {
			key: null,
			created: Date.now() + 1
		};

		for (let key of this.keys()) {
			let value = JSON.parse(this._storage.getItem(key));
			if (value.created < oldestEntry.created) {
				oldestEntry = {
					key,
					created: value.created
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
 * @private
 * @class StorageIterator
 * @implements Iterable
 * @implements Iterator
 * @namespace ima.storage
 * @module ima
 * @submodule ima.storage
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
 */
class StorageIterator {

	/**
	 * Initializes the DOM storage iterator.
	 *
	 * @constructor
	 * @method constructor
	 * @param {Storage} storage The DOM storage to iterate through.
	 */
	constructor(storage) {

		/**
		 * The DOM storage being iterated.
		 *
		 * @private
		 * @property _storage
		 * @type {Storage}
		 */
		this._storage = storage;

		/**
		 * The current index of the DOM storage key this iterator will return
		 * next.
		 *
		 * @private
		 * @property _currentKeyIndex
		 * @type {number}
		 */
		this._currentKeyIndex = 0;
	}

	/**
	 * Iterates to the next item. This method implements the iterator protocol.
	 *
	 * @method next
	 * @return {{done: boolean, value: (undefined|string)}} The next value in
	 *         the sequence and whether the iterator is done iterating through
	 *         the values.
	 */
	next() {
		if (this._currentKeyIndex >= this._storage.length) {
			return {
				done: true,
				value: undefined
			};
		}

		let key = this._storage.key(this._currentKeyIndex);
		this._currentKeyIndex++;

		return {
			done: false,
			value: key
		};
	}

	/**
	 * Returns the iterator for this object (this iterator). This method
	 * implements the iterable protocol and provides compatibility with the
	 * {@code for..of} loops.
	 *
	 * @method @@Symbol.iterator
	 * @return {StorageIterator} This iterator.
	 */
	[Symbol.iterator]() {
		return this;
	}
}

ns.ima.storage.SessionStorage = SessionStorage;
