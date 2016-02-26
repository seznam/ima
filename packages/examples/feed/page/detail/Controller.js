import ns from 'ima/namespace';
import BaseController from 'app/base/BaseController';

ns.namespace('app.page.detail');

/**
 * Controller for the home page, with both enabled and disabled filtering.
 *
 * @class Controller
 * @extends app.base.BaseController
 * @namespace app.page.detail
 * @module app
 * @submodule app.page
 */
class Controller extends BaseController {

	/**
	 * Initializes the home page controller.
	 *
	 * @method constructor
	 * @constructor
	 * @param {app.model.feed.FeedService} itemService
	 * @param {app.model.categoryList.CategoryListService} categoryListService
	 */
	constructor(itemService, categoryListService) {
		super();

		/**
		 * Service providing the list of feed items loaded from the REST API.
		 *
		 * @property itemService
		 * @private
		 * @type {app.model.feed.FeedService}
		 */
		this._itemService = itemService;

		/**
		 * Service providing the list of portals loaded from the REST API.
		 *
		 * @property categoryListService
		 * @private
		 * @type {app.model.categoryList.CategoryListService}
		 */
		this._categoryListService = categoryListService;
	}

	/**
	 * Load all needed data.
	 *
	 * @method load
	 * @return {Object} object of promise
	 */
	load() {

		return {
			item:
				this._itemService
					.load(this.params.itemId),
			category:
				this._categoryListService
					.getCategoryByUrl(this.params.category)
		};
	}

	/**
	 * @method activate
	 */
	// @override
	activate() {}

	/**
	 * @method destroy
	 */
	// @override
	destroy() {}

}

ns.app.page.detail.Controller = Controller;
