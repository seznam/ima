import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core.Storage');

/**
 * The {@codelink SessionMap} storage is an implementation of the
 * {@codelink Core.Interface.Storage} interface acting as a synchronization
 * proxy between
 *
 * @class SessionMap
 * @implements Core.Interface.Storage
 * @namespace Core.Storage
 * @module Core
 * @submodule Core.Storage
 *
 * @requires Core.Storage.Map
 * @requires Core.Storage.Session
 */
class SessionMap extends ns.Core.Interface.Storage {
	/**
	 * Initializes the storage.
	 *
	 * @constructor
	 * @method constructor
	 * @param {Core.Storage.Map} map The map storage to use.
	 * @param {Core.Storage.Session} session The session storage to use.
	 */
	constructor(map, session) {
		super();

		/**
		 * The map storage, synced with the session storage.
		 *
		 * @private
		 * @property _map
		 * @type {Core.Storage.Map}
		 */
		this._map = map;

		/**
		 * The session storage, synced with the map storage.
		 *
		 * @private
		 * @property _session
		 * @type {Core.Storage.Session}
		 */
		this._session = session;
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
		this._map.clear();
		for (var key of this._session.keys()) {
			this._map.set(key, this._session[key]);
		}

		return this;
	}

	/**
	 * Returns {@code true} if the specified cookie exists in this storage.
	 *
	 * Note that the method checks only for cookies known to this storage, it
	 * does not check for cookies set using other means (for example by
	 * manipulating the {@code document.cookie} property).
	 *
	 * @override
	 * @method has
	 * @param {string} key The key identifying the storage entry.
	 * @return {boolean} {@code true} if the specified cookie exists in this
	 *         storage.
	 */
	has(key) {
		return this._map.has(key);
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
		return this._map.get(key);
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
	 * @return {Core.Storage.SessionMap} This storage.
	 */
	set(key, value) {
		this._session.set(key, value);
		this._map.set(key, value);
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
	 * @return {Core.Storage.SessionMap} This storage.
	 */
	delete(key) {
		this._session.delete(key);
		this._map.delete(key);
		return this;
	}

	/**
	 * Clears the storage of all entries.
	 *
	 * @inheritdoc
	 * @override
	 * @chainable
	 * @method clear
	 * @return {Core.Storage.SessionMap} This storage.
	 */
	clear() {
		this._session.clear();
		this._map.clear();
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
		return this._map.keys();
	}

	/**
	 * Returns storage size.
	 *
	 * @override
	 * @method size
	 * @return {number}
	 */
	size() {
		return this._map.size();
	}
}

ns.Core.Storage.SessionMap = SessionMap;
