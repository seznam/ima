import ns from 'imajs/client/core/namespace';

ns.namespace('App.Module.Feed');

/**
 * Resource for feed.
 *
 * @class Resource
 * @extends App.Base.Resource
 * @namespace App.Module.Feed
 * @module App
 * @submodule App.Module
 */
class Resource extends ns.App.Base.Resource {
	/**
	 * @method constructor
	 * @constructor
	 * @param {Core.Http.Handler} http
	 * @param {String} url - API URL (Base server + api specific path.)
	 * @param {App.Factory.Feed} feedFactory
	 * @param {Core.Cache.Handler} cache
	 * */
	constructor(http, url, feedFactory, cache) {
		super(http, url, feedFactory, cache);
	}

	/**
	 * Method returns Feed entity with list of items. These items are capsuled
	 * inside this entity.
	 *   - If portalId is defined, it will return data for given portal.
	 *   - If AfterItemId is defined, it will returns items following this item.
	 *
	 * @method getFeedItems
	 * @param {App.Module.Category.Entity} [category=null] - Category entity.
	 * @param {App.Module.Item.Entity} [lastItem=null] - Last item entity.
	 * @return {App.Entity.Feed} - Promise of feed entity
	 */
	getEntity(category = null, lastItem = null) {
		var data = {};

		if (category) {
			data.category = category.getId();
		}

		return super.getEntity(null, data);
	}
}

ns.App.Module.Feed.Resource = Resource;
