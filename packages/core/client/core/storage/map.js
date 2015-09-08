import ns from 'imajs/client/core/namespace';

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
export default class MapStorage extends ns.Core.Interface.Storage {
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
	 * @inheritDoc
	 * @override
	 * @method has
	 * @param {string} key
	 * @return {boolean}
	 */
	has(key) {
		return this._storage.has(key);
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method get
	 * @param {string} key
	 * @return {*}
	 */
	get(key) {
		return this._storage.get(key);
	}

	/**
	 * @inheritDoc
	 * @override
	 * @chainable
	 * @method set
	 * @param {string} key
	 * @param {*} value
	 * @return {Core.Storage.Map}
	 */
	set(key, value) {
		this._storage.set(key, value);
		return this;
	}

	/**
	 * @inheritDoc
	 * @override
	 * @chainable
	 * @method delete
	 * @param {string} key
	 * @return {Core.Storage.Map}
	 */
	delete(key) {
		this._storage.delete(key);
		return this;
	}

	/**
	 * @inheritDoc
	 * @override
	 * @chainable
	 * @method clear
	 * @return {Core.Storage.Map}
	 */
	clear() {
		this._storage.clear();
		return this;
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method keys
	 * @return {Iterator<string>}
	 */
	keys() {
		return this._storage.keys();
	}

	/**
	 * @override
	 * @method size
	 * @return {number}
	 */
	size() {
		return this._storage.size;
	}
}

ns.Core.Storage.Map = MapStorage;
