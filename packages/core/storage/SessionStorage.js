import ns from '../namespace';
import GenericError from '../error/GenericError';
import Storage from './Storage';
import Window from '../window/Window';

ns.namespace('ima.storage');

/**
 * Implementation of the {@codelink Storage} interface that relies on the
 * native {@code sessionStorage} DOM storage for storing its entries.
 */
export default class SessionStorage extends Storage {
	static get $dependencies() {
		return [Window];
	}

	/**
	 * Initializes the session storage.
	 * @param {Window} window
	 */
	constructor(window) {
		super();

		/**
		 * The DOM storage providing the actual storage of the entries.
		 *
		 * @type {Storage}
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
	has(key) {
		return !!this._storage.getItem(key);
	}

	/**
	 * @inheritdoc
	 */
	get(key) {
		try {
			return JSON.parse(this._storage.getItem(key)).value;
		} catch (error) {
			throw new GenericError(
				'ima.storage.SessionStorage.get: Failed to parse a session ' +
					`storage item value identified by the key ${key}: ` +
					error.message
			);
		}
	}

	/**
	 * @inheritdoc
	 */
	set(key, value) {
		try {
			this._storage.setItem(
				key,
				JSON.stringify({
					created: Date.now(),
					value
				})
			);
		} catch (error) {
			let storage = this._storage;
			let isItemTooBig =
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
	delete(key) {
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
		return new StorageIterator(this._storage);
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
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
 */
class StorageIterator {
	/**
	 * Initializes the DOM storage iterator.
	 *
	 * @param {Storage} storage The DOM storage to iterate through.
	 */
	constructor(storage) {
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
	 * @return {StorageIterator} This iterator.
	 */
	[Symbol.iterator]() {
		return this;
	}
}

ns.ima.storage.SessionStorage = SessionStorage;
