import AbstractService from 'app/model/AbstractService';
import CategoryListService from 'app/model/categoryList/CategoryListService';
import FeedEntity from 'app/model/feed/FeedEntity';
import FeedResource from 'app/model/feed/FeedResource';
import ItemEntity from 'app/model/item/ItemEntity';

/**
 * Class for the feed model.
 * It's a model of the feed model.
 *
 * @class FeedService
 * @extends app.model.AbstractService
 * @namespace app.model.feed
 * @module app
 * @submodule app.model
 */
export default class FeedService extends AbstractService {

	static get $dependencies() {
		return [FeedResource, CategoryListService];
	}

	/**
	 * @constructor
	 * @method constructor
	 * @param {FeedResource} feedResource
	 * @param {CategoryListService} categoryListService
	 */
	constructor(feedResource, categoryListService) {
		super(feedResource);

		/**
		 * @private
		 * @property _categoryListService
		 * @type {CategoryListService}
		 * @default categoryListService
		 */
		this._categoryListService = categoryListService;
	}

	/**
	 * Returns last item entity.
	 *
	 * @method getLastItem
	 * @param {FeedEntity} feedEntity
	 * @return {?ItemEntity}
	 */
	getLastItem(feedEntity) {
		if (feedEntity && feedEntity.getItems().length) {
			let items = feedEntity.getItems();

			return items[0];
		}

		return null;
	}

	/**
	 * @method load
	 * @param {?string=} [currentCategory=null]
	 * @return {Promise<FeedEntity>}
	 */
	load(currentCategory = null) {
		return this
			._categoryListService
			.getCategoryByUrl(currentCategory)
			.then((categoryEntity) => {
				return this._resource.getEntity(categoryEntity);
			});
	}

	/**
	 * Adds new item to feed.
	 *
	 * @method addItemToFeed
	 * @param {FeedEntity} feedEntity
	 * @param {ItemEntity} itemEntity
	 * @return {FeedEntity}
	 */
	addItemToFeed(feedEntity, itemEntity) {
		let items = feedEntity.getItems();
		items.push(itemEntity);
		feedEntity.setItems(items);

		return feedEntity;
	}
}
