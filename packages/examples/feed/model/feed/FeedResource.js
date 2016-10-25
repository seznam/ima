import Cache from 'ima/cache/Cache';
import HttpAgent from 'ima/http/HttpAgent';
import AbstractResource from 'app/model/AbstractResource';
import CategoryEntity from 'app/model/category/CategoryEntity';
import FeedEntity from 'app/model/feed/FeedEntity';
import FeedFactory from 'app/model/feed/FeedFactory';
import ItemEntity from 'app/model/item/ItemEntity';

/**
 * Resource for feed.
 *
 * @class FeedResource
 * @extends app.model.AbstractResource
 * @namespace app.model.feed
 * @module app
 * @submodule app.model
 */
export default class FeedResource extends AbstractResource {

	/**
	 * @constructor
	 * @method constructor
	 * @param {HttpAgent} http
	 * @param {string} url API URL (Base server + api specific path.)
	 * @param {FeedFactory} feedFactory
	 * @param {Cache} cache
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
	 * @param {CategoryEntity=} [category=null] Category entity.
	 * @param {ItemEntity=} [lastItem=null] Last item entity.
	 * @return {Promise<FeedEntity>} Promise of feed entity
	 */
	getEntity(category = null, lastItem = null) {
		let data = {};

		if (category) {
			data.category = category.getId();
		}

		return super.getEntity(null, data);
	}
}
