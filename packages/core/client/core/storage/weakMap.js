import ns from 'imajs/client/core/namespace.js';

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
 *
 * @requires WeakMap
 */
class WeakMapStorage extends ns.Core.Storage.Map {
	/**
	 * Initializes the storage.
	 *
	 * @method constructor
	 * @constructor
	 * @param {number} entryTtl The time-to-live of a storage entry in
	 *        milliseconds.
	 * @param {number} maxEntries The maximum number of entries allowed in the
	 *        storage.
	 * @param {number} gcInterval The delay between runs of the garbage collector
	 *        in milliseconds.
	 * @param {number} gcEntryCountTreshold The maximum number of entries the
	 *        storage can contain before the garbage collector is started.
	 */
	constructor(entryTtl, maxEntries, gcInterval, gcEntryCountTreshold) {
		super();

		/**
		 * The time-to-live of a storage entry. Entries present in the storage for
		 * a longer period of time are considered stale and will be deleted by the
		 * garbage collector (if the garbage collector is active). The time-to-live
		 * is specified in milliseconds.
		 *
		 * @private
		 * @property _entryTtl
		 * @type {number}
		 */
		this._entryTtl = entryTtl;

		/**
		 * The maximum number of entries allowed in the storage. When the storage
		 * size exceeds this limit, the garbage collector will remove the oldest
		 * entries to reducte the storage size to this limit.
		 *
		 * @private
		 * @property _maxEntries
		 * @type {number}
		 */
		this._maxEntries = maxEntries;

		/**
		 * The interval duration in which the garbage collector discards the stale
		 * and overflowing storage entries. The interval duration is specified in
		 * milliseconds.
		 *
		 * @private
		 * @property _gcInterval
		 * @type {number}
		 */
		this._gcInterval = gcInterval;

		/**
		 * The maximum number of entries the storage can contain before the garbage
		 * collector is started.
		 *
		 * @private
		 * @property _gcEntryCountTreshold
		 * @type {number}
		 */
		this._gcEntryCountTreshold = gcEntryCountTreshold;

		/**
		 * ID of the global interval used to run the garbage collector
		 * periodically. The field is set to {@code null} if the garbage collector
		 * is not being currently used.
		 *
		 * @private
		 * @property _gcIntervalId
		 * @type {?number}
		 */
		this._gcIntervalId = null;
	}

	/**
	 * Retrieves the value of the entry indetified by the specified key. The
	 * method returns {@code undefined} if the entry does not exists.
	 *
	 * Entries set to the {@code undefined} value can be tested for existence
	 * using the {@codelink has} method.
	 *
	 * @inheritdoc
	 * @override
	 * @method get
	 * @param {string} key The key identifying the storage entry.
	 * @return {*} The value of the storage entry.
	 */
	get(key) {
		if (!this.has(key)) {
			return undefined;
		}

		return super.get(key).value;
	}

	/**
	 * Sets the storage entry identied by the specified key to the provided
	 * value. The method creates the entry if it does not exist already.
	 *
	 * @inheritdoc
	 * @override
	 * @chainable
	 * @method set
	 * @param {string} key The key identifying the storage entry.
	 * @param {*} value The storage entry value.
	 * @return {Core.Storage.WeakMap} This storage.
	 */
	set(key, value) {
		this._storage.set(key, {
			value,
			lastUpdate: Date.now()
		});

		if (this._storage.size > this._gcEntryCountTreshold) {
			this._startGc();
		}

		return this;
	}

	/**
	 * Deletes the entry identified by the specified key from this storage.
	 *
	 * @inheritdoc
	 * @override
	 * @chainable
	 * @method delete
	 * @param {string} key The key identifying the storage entry.
	 * @return {Core.Storage.WeakMap} This storage.
	 */
	delete(key) {
		super.delete(key);

		if (!this._storage.size) {
			this._stopGc();
		}

		return this;
	}

	/**
	 * Clears the storage of all entries.
	 *
	 * @inheritdoc
	 * @override
	 * @chainable
	 * @method clear
	 * @return {Core.Storage.WeakMap} This storage.
	 */
	clear() {
		super.clear();
		this._stopGc();
		return this;
	}

	/**
	 * Initiates the garbage collector. The garbage collector will execute each
	 * {@codelink _gcInterval} milliseconds, after a {@codelink _gcInterval}
	 * milliseconds delay after invoking this method.
	 *
	 * The method has no effect if the garbage collector is already active.
	 *
	 * @private
	 * @method _startGc
	 */
	_startGc() {
		if (!this._gcIntervalId) {
			this._gcIntervalId = setInterval(() => this._runGc(), this._gcInterval);
		}
	}

	/**
	 * Stops the garbage collector. The method has no effect if the gargabe
	 * collector is not currently active.
	 *
	 * @private
	 * @method _stopGc
	 */
	_stopGc() {
		if (this._gcIntervalId) {
			clearInterval(this._gcIntervalId);
			this._gcIntervalId = null;
		}
	}

	/**
	 * Performs garbage collection by deleting stale entries, and, if the storage
	 * size exceeds the {@codelink _maxEntries} field value, continues to delete
	 * the oldest entries until the size is reduced below the treshold.
	 *
	 * @private
	 * @method _runGc
	 */
	_runGc() {
		var now = Date.now();
		var expirationTreshold = now - this._entryTtl;

		for (var entry of this._storage) {
			if (entry[1].lastUpdate < expirationTreshold) {
				this.delete(entry[0]);
			}
		}

		if (this._storage.size > this._maxEntries) {
			this._runOverflowGc();
		}
	}

	/**
	 * Handles the overflowing entries in the storage by finding the oldest
	 * entries and deleting them. The method removes only so many entries that
	 * the storage size is reducted to the {@codelink _maxEntries} field value.
	 *
	 * @private
	 * @method _runOverflowGc
	 */
	_runOverflowGc() {
		var removalBuffer = [];
		var expectedBufferSize = this._storage.size - this._maxEntries;
		var entry = null;

		for (entry of this._storage) {
			insertSorted(entry);
		}

		for (entry of removalBuffer) {
			this.delete(entry[0]);
		}

		function insertSorted(item) {
			for (var i = 0; i < removalBuffer.length; i++) {
				if (comparator(item, removalBuffer[i]) > 0) {
					continue;
				}

				removalBuffer.splice(i, 0, item);
				break;
			}

			if (removalBuffer.length < expectedBufferSize) {
				removalBuffer.push(item);
			} else if (removalBuffer.length > expectedBufferSize) {
				removalBuffer.splice(expectedBufferSize);
			}
		}

		function comparator(entry1, entry2) {
			return entry1[1].lastUpdate - entry2[1].lastUpdate;
		}
	}
}

ns.Core.Storage.WeakMap = WeakMapStorage;

