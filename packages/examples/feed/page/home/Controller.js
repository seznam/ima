import ns from 'ima/namespace';
import BaseController from 'app/base/BaseController';

ns.namespace('app.page.home');

/**
 * Controller for the home page, with both enabled and disabled filtering.
 *
 * @class Controller
 * @extends app.base.BaseController
 * @namespace app.page.home
 * @module app
 * @submodule app.page
 */
class Controller extends BaseController {

	/**
	 * Initializes the home page controller.
	 *
	 * @method constructor
	 * @constructor
	 * @param {app.model.feed.FeedService} feedService
	 * @param {app.model.categoryList.categoryListService} categoryListService
	 * @param {app.model.Item.ItemResource} itemResource
	 */
	constructor(feedService, categoryListService, itemResource) {
		super();

		/**
		 * Service providing the list of feed items loaded from the REST API.
		 *
		 * @property feedService
		 * @private
		 * @type {app.model.feed.FeedService}
		 */
		this._feedService = feedService;

		/**
		 * Service providing the list of categories loaded from the REST API.
		 *
		 * @property categoryListService
		 * @private
		 * @type {app.model.categoryList.CategoryListService}
		 */
		this._categoryListService = categoryListService;

		/**
		 * Item resource for creating new item entities.
		 *
		 * @property itemResource
		 * @private
		 * @type {app.model.Item.ItemResource}
		 */
		this._itemResource = itemResource;
	}

	/**
	 * Load all needed data.
	 *
	 * @method load
	 * @return {Object} object of promise
	 */
	load() {

		return {
			categories:
				this._categoryListService
					.load(),
			currentCategory:
				this._categoryListService
					.getCategoryByUrl(this.params.category),
			feed:
				this._feedService
					.load(this.params.category),
			sharedItem: null
		};
	}

	/**
	 * @method activate
	 */
	// @override
	activate() {

	}

	/**
	 * @method destroy
	 */
	// @override
	destroy() {

	}

	/**
	 * Event handler for the sharetoggle event fired by the Share component.
	 *
	 * The handler first checks whether the feed item for which sharing has been
	 * toggles is the feed item for which the sharing options are currently
	 * displayed.
	 *
	 * In such case, the handler resets the sharedItem state field of this
	 * controller, which results in hiding the sharing UI.
	 *
	 * If the event is fired for a different feed item, the handler sets the
	 * sharedItem state field of this controller to the new feed item, which
	 * results in hiding the sharing UI of the previosly selected feed item (if
	 * any), and showing the sharing UI for the newly selected feed item.
	 *
	 * @method onShareToggle
	 * @param {Object} event The event fired by the Share component.
	 */
	onShareToggle(event) {
		let state = this.getState();

		if (state.sharedItem === event.item) {
			state.sharedItem = null;
		} else {
			state.sharedItem = event.item;
		}

		this.setState(state);
	}

	/**
	 * Button click handler for add new item to feed.
	 * It cretaes new item entity and adds it to feed.
	 *
	 * @method addItemToFeed
	 * @param {Object} data
	 */
	onAddItemToFeed(data) {
		this
			._itemResource
			.createEntity(data)
			.then((item) => {
				let state = this.getState();
				this._feedService.addItemTofeed(state.feed, item);
				this.setState(state);
			});
	}
}

ns.app.page.home.Controller = Controller;
