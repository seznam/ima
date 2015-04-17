import ns from 'imajs/client/core/namespace.js';

ns.namespace('App.Page.Home');

/**
 * Controller for the home page, with both enabled and disabled filtering.
 *
 * @class Controller
 * @extends App.Base.Controller
 * @namespace App.Page.Home
 * @module App
 * @submodule App.Page
 */
class Controller extends ns.App.Base.Controller {

	/**
	 * Initializes the home page controller.
	 *
	 * @method constructor
	 * @constructor
	 * @param {App.Page.Home.View} view
	 * @param {App.Module.Feed.Service} feedService
	 * @param {App.Module.CategoryList.Service} categoryListService
	 * @param {App.Module.Item.Resource} itemResource
	 * @param {Core.Dispatcher.Handler} dispatcher
	 */
	constructor(view, feedService, categoryListService, itemResource, dispatcher) {
		super(view);

		/**
		 * Service providing the list of feed items loaded from the REST API.
		 *
		 * @property feedService
		 * @private
		 * @type {App.Module.Feed.Service}
		 */
		this._feedService = feedService;

		/**
		 * Service providing the list of categories loaded from the REST API.
		 *
		 * @property categoryListService
		 * @private
		 * @type {App.Module.Category.Service}
		 */
		this._categoryListService = categoryListService;

		/**
		 * Item resource for creating new item entities.
		 *
		 * @property itemResource
		 * @private
		 * @type {App.Module.Item.Resource}
		 */
		this._itemResource = itemResource;
		

		/**
		 * Event dispatcher.
		 *
		 * @property dispatcher
		 * @private
		 * @type {Core.Dispatcher.Handler}
		 */
		this._dispatcher = dispatcher;
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
			sharedItem: null,
			textInputCheckedCategory: null
		};
	}

	/**
	 * @method activate
	 */
	// @override
	activate() {
		this._dispatcher.listen('setCheckedInputCategory', this.setCheckedInputCategory, this);
		this._dispatcher.listen('addItemToFeed', this.addItemToFeed, this);
		this._dispatcher.listen('shareToggle', this.onShareToggle, this);
	}

	/**
	 * @method deinit
	 */
	// @override
	deinit() {
		this._dispatcher.unlisten('setCheckedInputCategory', this.setCheckedInputCategory, this);
		this._dispatcher.unlisten('addItemToFeed', this.addItemToFeed, this);
		this._dispatcher.unlisten('shareToggle', this.onShareToggle, this);
		//this._dispatcher.clear(); // It could work, too - sometimes.
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
		var state = this.getState();

		if (state.sharedItem === event.item) {
			state.sharedItem = null;
		} else {
			state.sharedItem = event.item;
		}

		this.setState(state);
	}

	/**
	 * Button click handler for getting more items.
	 * It sets new feed entity to state. 
	 *
	 * @method getMoreFeedItems
	 */
	getMoreFeedItems() {
		var state = this.getState();
		var updatedFeedPromise = this._feedService.loadNextItems(state.currentCategory, state.feed);
		updatedFeedPromise.then((feedEntity) => {
			state.feed = feedEntity;
			this.setState(state);
		});
	}
	
	/**
	 * Button click handler for add new item to feed.
	 * It cretaes new item entity and adds it to feed. 
	 *
	 * @method addItemToFeed
	 * @param {Object} data
	 */
	addItemToFeed(data) {
		
		this
			._itemResource
			.createEntity(data)
			.then((item)=> {
				var state = this.getState();
				this._feedService.addItemToFeed(state.feed, item);
				this.setState(state);
			});
	}

	/**
	 * Sets checked item category in text input
	 *
	 * @method setCheckedFilterCategory
	 * @param {number} category
	 */
	setCheckedInputCategory(categoryId) {
		var state = this.getState();
		state.textInputCheckedCategory = state.categories.getCategoryById(categoryId);
		this.setState(state);
	}
	

}

ns.App.Page.Home.Controller = Controller;
