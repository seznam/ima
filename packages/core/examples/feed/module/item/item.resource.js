import ns from 'core/namespace/ns.js';

ns.namespace('App.Module.Item');

/**
 * Resource for items.
 * 
 * @class Resource
 * @extends App.Base.Resource
 * @namespace App.Module.Item
 * @module App
 * @submodule App.Module
 */
class Resource extends ns.App.Base.Resource {
	/**
	 * @method constructor
	 * @constructor
	 * @param {Core.Http.Handler} http
	 * @param {String} baseUrl - Server URL.
	 * @param {String} apiUrl - API spectific URL.
	 * @param {App.Factory.Item} itemFactory
	 * @param {Core.Cache.Handler} cache
	 * */
	constructor(http, baseUrl, apiUrl, itemFactory, cache) {
		super(http, baseUrl, apiUrl, itemFactory, cache);
	}

	/**
	 * Method returns entity with list of items.
	 *
	 * @method getItem
	 * @param {string} id - Id of the item.
	 * @return {App.Entity.Item} - Promise of item entity 
	 */
	getItem(id) {
		return super.getEntity(null, { id: id });
	}

	/**
	 * Method make request to API server and returns new entity.
	 *
	 * @method postItem
	 * @param {Object} data - Data with text and category for create new Entity ({text: <string>, category: <number>}).
	 * @return {App.Entity.Item} - Promise of item entity 
	 */
	postItem(data) {
		this._cache.clear();
		
		return super.postEntity(null, data);
	}
}

ns.App.Module.Item.Resource = Resource;