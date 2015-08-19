import ns from 'imajs/client/core/namespace';

ns.namespace('App.Module.Feed');

/**
 * Class for the feed model.
 * It's a model of the feed model.
 *
 * @class Service
 * @extends App.Base.Service
 * @namespace App.Module.Feed
 * @module App
 * @submodule App.Module
 */
class Service extends ns.App.Base.Service {

	/**
	 * @method constructor
	 * @constructor
	 * @param {App.Module.Feed.Resource} feedResource
	 * @param {App.Module.Category.Service} categoryListService
	 */
	constructor(feedResource, categoryListService) {
		super();

		/**
		 * @property _feedResource
		 * @private
		 * @type {App.Module.Feed.Resource}
		 * @default feedResource
		 * */
		this._feedResource = feedResource;

		/**
		 * @property _categoryListService
		 * @private
		 * @type {App-Module.Category.Service}
		 * @default categoryListService
		 */
		this._categoryListService = categoryListService;

	}

	/**
	 * Returns last item entity.
	 *
	 * @method getLastItem
	 * @param {Object} feedEntity
	 * @return {App.Module.Item.Entity|null}
	 */
	getLastItem(feedEntity) {
		if (feedEntity && feedEntity.getItems().length > 0) {
			var items = feedEntity.getItems();

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
	 * @param {App.Module.Feed.Entity} feedEntity
	 * @param {App.Module.Item.Entity} itemEntity
	 * @return {App.Module.Feed.Entity}
	 */
	addItemToFeed(feedEntity, itemEntity) {
		var items = feedEntity.getItems();
		items.push(itemEntity);
		feedEntity.setItems(items);

		return feedEntity;
	}
}

ns.App.Module.Feed.Service = Service;
