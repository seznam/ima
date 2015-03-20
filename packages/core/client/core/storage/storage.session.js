import ns from 'core/namespace/ns.js';

ns.namespace('Core.Storage');

/**
 * Session storage.
 *
 * @class Session
 * @extends Core.Interface.Storage
 * @namespace Core.Storage
 * @module Core
 * @submodule Core.Storage
 *
 * @requires SessionStorage
 */
class Session extends ns.Core.Interface.Storage {

	/**
	 * @method constructor
	 * @constructor
	 */
	constructor() {
		super();

		/**
		 * @property _storage
		 * @type {SessionStorage}
		 * @default window.sessionStorage
		 */
		this._storage = window.sessionStorage;
	}

	/**
	 * Initialize the storage.
	 * @method init
	 * @chainable
	 * @return {Core.Storage.Session} Current instance
	 */
	init() {
		return this;
	}

	/**
	 * Clear the storage.
	 * @method clear
	 * @chainable
	 * @return {Core.Storage.Session} Current instance
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
		var item = this._storage.getItem(name);
		return item !== null && item !== undefined;
	}

	/**
	 * Returns a value of the given item.
	 * @method get
	 * @param {String} name
	 * @return {*}
	 */
	get(name) {
		try {
			return JSON.parse(this._storage.getItem(name));
		} catch(e) {
			throw new Error('Failed to parse a session storage item value saved under the name ' + name + '. ' + e.message);
		}
	}

	/**
	 * Saves the value under the given name.
	 * @method set
	 * @chainable
	 * @param {String} name
	 * @param {*} value
	 * @return {Core.Storage.Session} Current instance
	 */
	set(name, value) {
		this._storage.setItem(name, JSON.stringify(value));
		return this;
	}

	/**
	 * Deletes the item.
	 * @method delete
	 * @chainable
	 * @param {String} name
	 * @return {Core.Storage.Session} Current instance
	 */
	delete(name) {
		this._storage.removeItem(name);
		return this;
	}

	/**
	 * Returns an iterator containing keys.
	 * 
	 * @method keys
	 * @return {Iterator} Keys iterator.
	 */
	keys() {
		throw new Error('Method keys() is not implemented for the session storage.');
	}
}

ns.Core.Storage.Session = Session;