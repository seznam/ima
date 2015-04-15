import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core.Cache');

/**
 * @class Entry
 * @namespace Core.Cache
 * @module Core
 * @submodule Core.Cache
 */
class Entry {

	/**
	 * @method constructor
	 * @constructor
	 *
	 * @param {*} value
	 * @param {Number} TTL - time to live
	 */
	constructor(value, TTL) {

		/**
		 * Stored value.
		 *
		 * @property _value
		 * @private
		 * @type {*}
		 * @default value
		 */
		this._value = value;

		/**
		 * Time to live.
		 *
		 * @property TTL
		 * @private
		 * @type {Number}
		 * @default TTL
		 */
		this._TTL = TTL;

		/**
		 * Cached time.
		 *
		 * @property cachedTime
		 * @private
		 * @type {Date}
		 * @default new Date().getTime()
		 */
		this._cachedTime = new Date().getTime();
	}

	/**
	 * Ruturn true is data is live.
	 *
	 * @method isLive
	 * @return {Boolean}
	 */
	isLive() {
		var now = new Date().getTime();
		return now <= this._cachedTime + this._TTL;
	}

	/**
	 * Return data for serialization.
	 *
	 * @method serialize
	 * @return {Object} - {value, TTL}
	 */
	serialize() {
		return {value: this._value, TTL: this._TTL};
	}

	/**
	 * Return stored value.
	 *
	 * @method getValue
	 * @return {Mixed}
	 */
	getValue() {
		return this._value;
	}
}

ns.Core.Cache.Entry = Entry;