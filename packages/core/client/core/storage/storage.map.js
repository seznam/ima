import ns from 'core/namespace/ns.js';

ns.namespace('Core.Storage');

/**
 * Map storage.
 *
 * @class MapStorage
 * @extends Core.Interface.Storage
 * @namespace Core.Storage
 * @module Core
 * @submodule Core.Storage
 *
 * @requires Map
 * */
class MapStorage extends ns.Core.Interface.Storage {

	/**
	 * @method constructor
	 * @constructor
	 */
	constructor() {
		super();

		/**
		 * @property _storage
		 * @type {Map}
		 * @default new Map()
		 * */
		this._storage = new Map();
	}

	/**
	 * Initialize the storage.
	 * @method init
	 * @chainable
	 * @return {Core.Storage.Map} Current instance
	 */
	init() {
		return this;
	}

	/**
	 * Clear the storage.
	 * @method clear
	 * @chainable
	 * @return {Core.Storage.Map} Current instance
	 */
	clear() {
		this._storage.clear();
		return this;
	}

	/**
	 * Checks if an item with the given name exists.
	 * @method has
	 * @param {String} name
	 * @return {Boolean}
	 */
	has(name) {
		return this._storage.has(name);
	}

	/**
	 * Returns a value of the given item.
	 * @method get
	 * @param {String} name
	 * @return {*}
	 */
	get(name) {
		return this._storage.get(name);
	}

	/**
	 * Saves the value under the given name.
	 * @method set
	 * @chainable
	 * @param {String} name
	 * @param {*} value
	 * @return {Core.Storage.Map} Current instance
	 */
	set(name, value) {
		this._storage.set(name, value);
		return this;
	}

	/**
	 * Deletes the item.
	 *
	 * @method delete
	 * @chainable
	 * @param {String} name
	 * @return {Core.Storage.Map} Current instance
	 */
	delete(name) {
		this._storage.delete(name);
		return this;
	}

	/**
	 * Returns an iterator containing keys.
	 *
	 * @method keys
	 * @return {Iterator} Keys iterator.
	 */
	keys() {
		return this._storage.keys();
	}
}

ns.Core.Storage.Map = MapStorage;