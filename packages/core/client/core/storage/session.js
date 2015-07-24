import ns from 'imajs/client/core/namespace.js';
import IMAError from 'imajs/client/core/imaError.js';

ns.namespace('Core.Storage');

/**
 * Implementation of the {@codelink Core.Interface.Storage} interface that
 * relies on the native {@code sessionStorage} DOM storage for storing its
 * entries.
 *
 * @class Session
 * @implements Core.Interface.Storage
 * @namespace Core.Storage
 * @module Core
 * @submodule Core.Storage
 *
 * @requires SessionStorage
 */
class Session extends ns.Core.Interface.Storage {
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
	 * This method is used to finalize the initialization of the storage after
	 * the dependencies provided through the constructor are ready to be used.
	 *
	 * This method must be invoked only once and it must be the first method
	 * invoked on this instance.
	 *
	 * @inheritDoc
	 * @override
	 * @chainable
	 * @method init
	 * @return {Core.Interface.Storage}
	 */
	init() {
		return this;
	}

	/**
	 * Returns {@code true} if the entry identified by the specified key exists
	 * in this storage.
	 *
	 * @method has
	 * @param {string} key The key identifying the storage entry.
	 * @return {boolean} {@code true} if the storage entry exists.
	 */
	has(key) {
		return !!this._storage.getItem(key);
	}

	/**
	 * Retrieves the value of the entry indetified by the specified key. The
	 * method returns {@code undefined} if the entry does not exists.
	 *
	 * Entries set to the {@code undefined} value can be tested for existence
	 * using the {@codelink has} method.
	 *
	 * @inheritDoc
	 * @override
	 * @method get
	 * @param {string} key The key identifying the storage entry.
	 * @return {*} The value of the storage entry.
	 */
	get(key) {
		try {
			return JSON.parse(this._storage.getItem(key)).value;
		} catch (e) {
			throw new IMAError('Core.Storage.Session.get: Failed to parse a ' +
			`session storage item value identified by the key ${key}: ` +
			e.message);
		}
	}

	/**
	 * Sets the storage entry identied by the specified key to the provided
	 * value. The method creates the entry if it does not exist already.
	 *
	 * @inheritDoc
	 * @override
	 * @chainable
	 * @method set
	 * @param {string} key The key identifying the storage entry.
	 * @param {*} value The storage entry value.
	 * @return {Core.Storage.Session} This storage.
	 */
	set(key, value) {
		try {
			this._storage.setItem(key, JSON.stringify({
				created: Date.now(),
				value
			}));
		} catch (e) {
			var storage = this._storage;
			var isItemTooBig = (storage.length === 0) ||
					((storage.length === 1) && (storage.key(0) === key));
			if (isItemTooBig) {
				throw e;
			}

			this._deleteOldestEntry();
			this.set(key, value);
		}

		return this;
	}

	/**
	 * Deletes the entry identified by the specified key from this storage.
	 *
	 * @inheritDoc
	 * @override
	 * @chainable
	 * @method delete
	 * @param {string} key The key identifying the storage entry.
	 * @return {Core.Storage.Session} This storage.
	 */
	delete(key) {
		this._storage.removeItem(key);
		return this;
	}

	/**
	 * Clears the storage of all entries.
	 *
	 * @inheritDoc
	 * @override
	 * @chainable
	 * @method clear
	 * @return {Core.Storage.Session} This storage.
	 */
	clear() {
		this._storage.clear();
		return this;
	}

	/**
	 * Returns an iterator for traversing the keys in this storage. The order in
	 * which the keys are traversed is undefined.
	 *
	 * @inheritDoc
	 * @override
	 * @method keys
	 * @return {Iterator<string>} An iterator for traversing the keys in this
	 *         storage. The iterator also implements the iterable protocol,
	 *         returning itself as its own iterator, allowing it to be used in a
	 *         {@code for..of} loop.
	 */
	keys() {
		return new StorageIterator(this._storage);
	}

	/**
	 * Returns storage size.
	 *
	 * @override
	 * @method size
	 * @return {number}
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
		var oldestEntry = {
			key: null,
			created: Date.now() + 1
		};

		for (var key of this.keys()) {
			var value = JSON.parse(this._storage.getItem(key));
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
 * Implementation of the iterator protocol and iterable protocol for DOM
 * storage keys.
 *
 * @private
 * @class StorageIterator
 * @implements Iterable
 * @implements Iterator
 * @namespace Core.Storage
 * @module Core
 * @submodule Core.Storage
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
 */
class StorageIterator {

	/**
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
		 * The current index of the DOM storage key this iterator will return next.
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
	 * @return {{done: boolean, value: (undefined|string)}} The next value in the
	 *         sequence and whether the iterator is done iterating through the
	 *         values.
	 */
	next() {
		if (this._currentKeyIndex >= this._storage.length) {
			return {
				done: true,
				value: undefined
			};
		}

		var key = this._storage.key(this._currentKeyIndex);
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

ns.Core.Storage.Session = Session;
