import ns from 'ima/namespace';
import BaseService from 'app/base/BaseService';

ns.namespace('app.model.feed');

/**
 * Class for the feed model.
 * It's a model of the feed model.
 *
 * @class FeedService
 * @extends app.base.BaseService
 * @namespace app.model.feed
 * @module app
 * @submodule app.model
 */
class FeedService extends BaseService {

	/**
	 * @method constructor
	 * @constructor
	 * @param {app.model.feed.FeedResource} feedResource
	 * @param {app.model.category.CategoryListService} categoryListService
	 */
	constructor(feedResource, categoryListService) {
		super();

		/**
		 * @property _feedResource
		 * @private
		 * @type {app.model.feed.FeedResource}
		 * @default feedResource
		 * */
		this._feedResource = feedResource;

		/**
		 * @property _categoryListService
		 * @private
		 * @type {app.model.categoryList.CategoryListService}
		 * @default categoryListService
		 */
		this._categoryListService = categoryListService;

	}

	/**
	 * Returns last item entity.
	 *
	 * @method getLastItem
	 * @param {app.model.feed.FeedEntity} feedEntity
	 * @return {app.model.Item.ItemEntity|null}
	 */
	getLastItem(feedEntity) {
		if (feedEntity && feedEntity.getItems().length > 0) {
			let items = feedEntity.getItems();

			return items[0];
		}

		return null;
	}

	/**
	 * @method load
	 * @param {string=} [currentCategory=null]
	 */
	load(currentCategory = null) {
		return this
			._categoryListService
			.getCategoryByUrl(currentCategory)
			.then((categoryEntity) => {

				return this._feedResource
						.getEntity(categoryEntity);
			});
	}

	/**
	 * Adds new item to feed.
	 *
	 * @method addItemToFedd
	 * @param {app.model.feed.FeedEntity} feedEntity
	 * @param {app.model.Item.ItemEntity} itemEntity
	 * @return {app.model.feed.FeedEntity}
	 */
	addItemTofeed(feedEntity, itemEntity) {
		let items = feedEntity.getItems();
		items.push(itemEntity);
		feedEntity.setItems(items);

		return feedEntity;
	}
}

ns.app.model.feed.FeedService = FeedService;
