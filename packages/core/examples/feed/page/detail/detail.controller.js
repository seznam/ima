import ns from 'imajs/client/core/namespace.js';

ns.namespace('App.Page.Detail');

/**
 * Controller for the home page, with both enabled and disabled filtering.
 *
 * @class Controller
 * @extends App.Base.Controller
 * @namespace App.Page.Detail
 * @module App
 * @submodule App.Page
 */
class Controller extends ns.App.Base.Controller {

	/**
	 * Initializes the home page controller.
	 *
	 * @method constructor
	 * @constructor
	 * @param {App.Page.Detail.View} view
	 * @param {App.Module.Feed.Service} itemService
	 * @param {App.Module.CategoryList.Service} categoryListService
	 * @param {Core.Dispatcher.Handler} dispatcher
	 * @param {Core.Dictionary.Handler} dictionary
	 */
	constructor(view, itemService, categoryListService, dispatcher, dictionary) {
		super(view, dictionary);

		/**
		 * Service providing the list of feed items loaded from the REST API.
		 *
		 * @property itemService
		 * @private
		 * @type {App.Module.Feed.Service}
		 */
		this._itemService = itemService;

		/**
		 * Service providing the list of portals loaded from the REST API.
		 *
		 * @property categoryListService
		 * @private
		 * @type {App.Module.CategoryList.Service}
		 */
		this._categoryListService = categoryListService;

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
			item: this._itemService.load(this.params.itemId),
			category: this._categoryListService.getCategoryByUrl(this.params.category)
		};
	}

	/**
	 * @method activate
	 */
	// @override
	activate() {
	}

	/**
	 * @method deinit
	 */
	// @override
	deinit() {
	}

}

ns.App.Page.Detail.Controller = Controller;
