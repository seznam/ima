import ns from 'ima/namespace';
import MapStorage from 'ima/storage/mapStorage';

ns.namespace('Ima.Storage');

/**
 * A specialization of the {@codelink Ima.Storage.Map} storage mimicking the
 * native {@code WeakMap} using its internal garbage collector used once the
 * size of the storage reaches the configured threshold.
 *
 * @class WeakMapStorage
 * @extends Ima.Storage.Map
 * @namespace Ima.Storage
 * @module Ima
 * @submodule Ima.Storage
 */
export default class WeakMapStorage extends MapStorage {
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
	 * @inheritdoc
	 * @method has
	 */
	has(key) {
		this._discardExpiredEntries();

		return super.has(key);
	}

	/**
	 * @inheritdoc
	 * @method get
	 */
	get(key) {
		this._discardExpiredEntries();

		if (!super.has(key)) {
			return undefined;
		}

		return super.get(key).target;
	}

	/**
	 * @inheritdoc
	 * @method set
	 */
	set(key, value) {
		this._discardExpiredEntries();

		return super.set(key, new WeakRef(value, this._entryTtl));
	}

	/**
	 * @inheritdoc
	 * @method delete
	 */
	delete(key) {
		this._discardExpiredEntries();

		return super.delete(key);
	}

	/**
	 * @inheritdoc
	 * @method keys
	 */
	keys() {
		this._discardExpiredEntries();

		return super.keys();
	}

	/**
	 * @inheritdoc
	 * @method size
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
				super.delete(key);
			}
		}
	}
}

ns.Ima.Storage.WeakMapStorage = WeakMapStorage;

/**
 * A simple reference wrapper that emulates a weak reference. We seem to have
 * no other option, since WeakMap and WeakSet are not enumerable (so what is
 * the point of WeakMap and WeakSet if you still need to manage the keys?!) and
 * there is no native way to create a weak reference.
 *
 * @private
 * @class WeakRef
 * @namespace Ima.Storage
 * @module Ima
 * @submodule Ima.Storage
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
				throw new TypeError('The target reference must point to an ' +
						'object, primitive values are not allowed');
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
	 * @property target
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
