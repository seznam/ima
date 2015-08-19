import ns from 'imajs/client/core/namespace';

ns.namespace('App.Interface');

/**
 * Interface class for Resource.
 * @class Resource
 * @namespace App.Interface
 * @module App
 */
class Resource {

	/**
	 * Gets 1 entity from http and returns Entity.
	 *
	 * @method getEntity
	 * @param {String} [id=null] ID for get entity from API.
	 * @param {Object} [data={}]
	 * @param {Object} [options={}] Possible keys {ttl: {number}(in ms), timeout: {number}(in ms), repeatRequest: {number}}
	 * @param {Boolean} [force=false] Forces request, doesn't use cache.
	 * @return {App.Base.Entity}
	 */
	getEntity(id = null, data = {}, options = {}, force = false) {}

	/**
	 * Posts data to http and returns new Entity.
	 *
	 * @method postEntity
	 * @param {String} [id=null] ID for post entity from API.
	 * @param {Object} [data={}]
	 * @param {Object} [options={}] Possible keys {ttl: {number}(in ms), timeout: {number}(in ms), repeatRequest: {number}}
	 * @return {App.Base.Entity}
	 */
	postEntity(id = null, data = {}, options = {}) {}

	/**
	 * Gets entity list from http, save embeds to cache and returns Entity List.
	 *
	 * @method getEntityList
	 * @param {Object} [data={}]
	 * @param {Object} [options={}]
	 * @param {Boolean} [force=false] Forces request, doesn't use cache.
	 * @return {Array[App.Base.Entity]} - Entity List
	 */
	getEntityList(data = {}, options = {}, force = false) {}
}

ns.App.Interface.Resource = Resource;
