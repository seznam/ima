import ns from 'core/namespace/ns.js';

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
	 */
	constructor(feedResource) {
		super();

		/**
		 * @property _feedResource
		 * @private
		 * @type {App.Module.Feed.Resource}
		 * @default feedResource
		 * */
		this._feedResource = feedResource;

	}

	/**
	 * Force update feed.
	 *
	 * @method updateFeed
	 */
	updateFeed() {
		return this._feedResource
				.getFeedItems(true);
	}
	
	/**
	 * Loads next items after current one and returns new Feed Entity.
	 *
	 * @method loadNextItems
	 * @param {App.Module.Portal.Entity} portal
	 * @param {App.Module.Item.Entity} afterItem
	 *
	 * @return {App.Module.Feed.Entity|null} updatedFeedEntity
	 */
	loadNextItems(portal, oldFeedEntity) {

		if (oldFeedEntity) {
			var lastItem = this.getLastItem(oldFeedEntity);

			return (
				this._feedResource
					.getFeedItems(false, portal, lastItem)
					.then((feedEntity) => {
						feedEntity
							.getItems()
							.push(...oldFeedEntity.getItems());

						return feedEntity;
				})
			);
		} else {

			return null;
		}
	}

	/**
	 * Returns last item entity.
	 *
	 * @method getLastItem
	 * @param {Object} feedEntity
	 * @return {App.Module.Item.Entity|null} 
	 */
	getLastItem(feedEntity) {
		if (feedEntity && (feedEntity.getItems().length > 0)) {
			var items = feedEntity.getItems();

			return items[0];
		}

		return null;
	}

	/**
	 * @method load
	 * @param {App.Module.Portal.Entity} [currentPortalEntity=null]
	 */
	load(currentPortalEntity) {

		return currentPortalEntity.then((portalEntity) => {

				return this._feedResource
						.getEntity(portalEntity);
			}
		);
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