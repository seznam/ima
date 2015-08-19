import ns from 'imajs/client/core/namespace';

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
	 * @param {String} url - API URL (Base server + api specific path.)
	 * @param {App.Factory.Item} itemFactory
	 * @param {Core.Cache.Handler} cache
	 * */
	constructor(http, apiUrl, itemFactory, cache) {
		super(http, apiUrl, itemFactory, cache);
	}

	/**
	 * Method returns entity with list of items.
	 *
	 * @method getEntity
	 * @param {string} id - Id of the item.
	 * @return {App.Entity.Item} - Promise of item entity
	 */
	getEntity(id) {
		return super.getEntity(null, { id: id });
	}

	/**
	 * Method make request to API server and returns new entity.
	 *
	 * @method createEntity
	 * @param {Object} data - Data with text and category for create new Entity ({text: <string>, category: <number>}).
	 * @return {App.Entity.Item} - Promise of item entity
	 */
	createEntity(data) {
		this._cache.clear();

		return super.createEntity(data);
	}
}

ns.App.Module.Item.Resource = Resource;
