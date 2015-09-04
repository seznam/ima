import ns from 'imajs/client/core/namespace';

ns.namespace('Core.Storage');

/**
 * A specialization of the {@codelink Core.Storage.Map} storage mimicking the
 * native {@code WeakMap} using its internal garbage collector used once the
 * size of the storage reaches the configured threshold.
 *
 * @class WeakMapStorage
 * @extends Core.Storage.Map
 * @namespace Core.Storage
 * @module Core
 * @submodule Core.Storage
 */
export default class WeakMapStorage extends ns.Core.Storage.Map {
	/**
	 * Initializes the storage.
	 *
	 * @constructor
	 * @method constructor
	 * @param {{entryTtl: number}} config Weak map storage configuration. The
	 *        fields have the following meaning:
	 *        - entryTtl The time-to-live of a storage entry in milliseconds.
	 */
	constructor(config) {
		super();

		/**
		 * The time-to-live of a storage entry in milliseconds.
		 *
		 * @private
		 * @property _entryTtl
		 * @type {number}
		 */
		this._entryTtl = config.entryTtl;
	}

	/**
	 * Returns {@code true} if the entry identified by the specified key exists
	 * in this storage.
	 *
	 * @inheritDoc
	 * @override
	 * @method has
	 * @param {string} key The key identifying the storage entry.
	 * @return {boolean} {@code true} if the storage entry exists.
	 */
	has(key) {
		this._discardExpiredEntries();

		return super.has(key);
	}

	/**
	 * Retrieves the value of the entry identified by the specified key. The
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
		this._discardExpiredEntries();

		if (!this.has(key)) {
			return undefined;
		}

		return targetReference.target;
	}

	/**
	 * Sets the storage entry identified by the specified key to the provided
	 * value. The method creates the entry if it does not exist already.
	 *
	 * @inheritDoc
	 * @override
	 * @chainable
	 * @method set
	 * @param {string} key The key identifying the storage entry.
	 * @param {*} value The storage entry value.
	 * @return {Core.Storage.WeakMap} This storage.
	 */
	set(key, value) {
		this._discardExpiredEntries();

		return super.set(key, new WeakRef(value, this._entryTtl));
	}

	/**
	 * Deletes the entry identified by the specified key from this storage.
	 *
	 * @inheritDoc
	 * @override
	 * @chainable
	 * @method delete
	 * @param {string} key The key identifying the storage entry.
	 * @return {Core.Storage.Map} This storage.
	 */
	delete(key) {
		this._discardExpiredEntries();

		return super.delete(key);
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
		this._discardExpiredEntries();

		return super.keys();
	}

	/**
	 * Returns the number of entries in this storage.
	 *
	 * @override
	 * @method size
	 * @return {number} The number of entries in this storage.
	 */
	size() {
		this._discardExpiredEntries();

		return super.size();
	}

	/**
	 * Deletes all expired entries from this storage.
	 *
	 * @private
	 * @method _discardExpiredEntries
	 */
	_discardExpiredEntries() {
		for (var key of super.keys()) {
			var targetReference = super.get(key);
			if (!targetReference.target) { // the reference has died
				this.delete(key);
			}
		}
	}
}

ns.Core.Storage.WeakMap = WeakMapStorage;

/**
 * A simple reference wrapper that emulates a weak reference. We seem to have
 * no other option, since WeakMap and WeakSet are not enumerable (so what is
 * the point of WeakMap and WeakSet if you still need to manage the keys?!) and
 * there is no native way to create a weak reference.
 *
 * @private
 * @class WeakRef
 * @namespace Core.Storage
 * @module Core
 * @submodule Core.Storage
 */
class WeakRef {
	/**
	 * Initializes the weak reference to the target reference.
	 *
	 * @constructor
	 * @method constructor
	 * @param {Object} target The target reference that should be referenced by
	 *        this weak reference.
	 * @param {number} ttl The maximum number of milliseconds the weak
	 *        reference should be kept. The reference will be discarded once
	 *        ACCESSED after the specified timeout.
	 */
	constructor(target, ttl) {
		if ($Debug) {
			if (!(target instanceof Object)) {
				throw new TypeError("The target reference must point to an " +
						"object, primitive values are not allowed");
			}
			if (ttl <= 0) {
				throw new Error('The time-to-live must be positive');
			}
		}

		/**
		 * The actual target reference, or {@code null} if the reference has
		 * been already discarded.
		 *
		 * @private
		 * @property _reference
		 * @type {?Object}
		 */
		this._reference = target;

		/**
		 * The UNIX timestamp with millisecond precision marking the moment at
		 * or after which the reference will be discarded.
		 *
		 * @private
		 * @property _expiration
		 * @type {number}
		 */
		this._expiration = Date.now() + ttl;
	}

	/**
	 * Returns the target reference, provided that the target reference is
	 * still alive. Returns {@code null} if the reference has been discarded.
	 *
	 * @return {?Object} The target reference, or {@code null} if the reference
	 *         has been discarded by the garbage collector.
	 */
	get target() {
		if (this._reference && (Date.now() >= this._expiration)) {
			this._reference = null; // let the GC do its job
		}

		return this._reference;
	}
}
