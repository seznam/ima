import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core.Interface');

/**
 * @class Cache
 * @namespace Core.Interface
 * @module Core
 * @submodule Core.Interface
 */
class Cache {

	/**
	 * Clear all cache.
	 *
	 * @method clear
	 */
	clear() {
	}

	/**
	 * Return true if key exist in cache.
	 *
	 * @method has
	 */
	has(){
	}

	/**
	 * Return cached value for key. If key doesnt exist then throw error.
	 *
	 * @method get
	 */
	get() {
	}

	/**
	 * Set value to cache for key.
	 *
	 * @method set
	 */
	set() {
	}

	/**
	 * Delete value in cache for key.
	 *
	 * @method delete
	 */
	delete() {
	}

	/**
	 * Disbale cache.
	 *
	 * @method disable
	 */
	disable() {
	}

	/**
	 * Enable cache
	 *
	 * @method enable
	 */
	enable() {
	}

	/**
	 * Serialization data from cache.
	 *
	 * @method serialize
	 */
	serialize() {
	}


	/**
	 * Deserialization data from JSON.
	 *
	 * @method deserialize
	 */
	deserialize() {
	}
}

ns.Core.Interface.Cache = Cache;