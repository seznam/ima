import ns from 'ima/namespace';
import BaseResource from 'app/base/BaseResource';

ns.namespace('app.model.feed');

/**
 * Resource for feed.
 *
 * @class FeedResource
 * @extends app.base.BaseResource
 * @namespace app.model.feed
 * @module app
 * @submodule app.model
 */
class FeedResource extends BaseResource {
	/**
	 * @method constructor
	 * @constructor
	 * @param {ima.http.HttpAgent} http
	 * @param {string} url - API URL (Base server + api specific path.)
	 * @param {app.model.factory.FeedFactory} feedFactory
	 * @param {ima.cache.Cache} cache
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
	 * @param {app.model.category.CategoryEntity} [category=null] - Category entity.
	 * @param {app.model.item.ItemEntity} [lastItem=null] - Last item entity.
	 * @return {app.model.feed.FeedEntity} - Promise of feed entity
	 */
	getEntity(category = null, lastItem = null) {
		let data = {};

		if (category) {
			data.category = category.getId();
		}

		return super.getEntity(null, data);
	}
}

ns.app.model.feed.FeedResource = FeedResource;
