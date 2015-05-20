import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core.Storage');

/**
 * Implementation of the {@codelink Core.Interface.Storage} interface that
 * relies on the native {@code Map} for storage.
 *
 * @class Map
 * @implements Core.Interface.Storage
 * @namespace Core.Storage
 * @module Core
 * @submodule Core.Storage
 *
 * @requires Map
 */
class MapStorage extends ns.Core.Interface.Storage {
	/**
	 * Initializes the map storage.
	 *
	 * @method constructor
	 * @constructor
	 */
	constructor() {
		super();

		/**
		 * The internal storage of entries.
		 *
		 * @protected
		 * @property _storage
		 * @type {Map<string, *>}
		 */
		this._storage = new Map();
	}

	/**
	 * This method is used to finalize the initialization of the storage after
	 * the dependencies provided through the constructor are ready to be used.
	 *
	 * This method must be invoked only once and it must be the first method
	 * invoked on this instance.
	 *
	 * @inheritdoc
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
	 * @inheritdoc
	 * @override
	 * @method has
	 * @param {string} key The key identifying the storage entry.
	 * @return {boolean} {@code true} if the storage entry exists.
	 */
	has(key) {
		return this._storage.has(key);
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
		return this._storage.get(key);
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
	 * @return {Core.Storage.Map} This storage.
	 */
	set(key, value) {
		this._storage.set(key, value);
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
	 * @return {Core.Storage.Map} This storage.
	 */
	delete(key) {
		this._storage.delete(key);
		return this;
	}

	/**
	 * Clears the storage of all entries.
	 *
	 * @inheritdoc
	 * @override
	 * @chainable
	 * @method clear
	 * @return {Core.Storage.Map} This storage.
	 */
	clear() {
		this._storage.clear();
		return this;
	}

	/**
	 * Returns an iterator for traversing the keys in this storage. The order in
	 * which the keys are traversed is undefined.
	 *
	 * @inheritdoc
	 * @override
	 * @method keys
	 * @return {Iterator<string>} An iterator for traversing the keys in this
	 *         storage. The iterator also implements the iterable protocol,
	 *         returning itself as its own iterator, allowing it to be used in a
	 *         {@code for..of} loop.
	 */
	keys() {
		return this._storage.keys();
	}

	/**
	 * Returns storage size.
	 *
	 * @override
	 * @method size
	 * @return {number}
	 */
	size() {
		return this._storage.size;
	}
}

ns.Core.Storage.Map = MapStorage;
