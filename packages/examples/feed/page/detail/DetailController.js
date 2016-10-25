import AbstractController from 'app/page/AbstractController';
import CategoryListService from 'app/model/categoryList/CategoryListService';
import ItemService from 'app/model/item/ItemService';

/**
 * Controller for the home page, with both enabled and disabled filtering.
 *
 * @class DetailController
 * @extends app.page.AbstractController
 * @namespace app.page.detail
 * @module app
 * @submodule app.page
 */
export default class DetailController extends AbstractController {

	static get $dependencies() {
		return [ItemService, CategoryListService];
	}

	/**
	 * Initializes the home page controller.
	 *
	 * @constructor
	 * @method constructor
	 * @param {ItemService} itemService
	 * @param {CategoryListService} categoryListService
	 */
	constructor(itemService, categoryListService) {
		super();

		/**
		 * Service providing the list of feed items loaded from the REST API.
		 *
		 * @private
		 * @property itemService
		 * @type {ItemService}
		 */
		this._itemService = itemService;

		/**
		 * Service providing the list of portals loaded from the REST API.
		 *
		 * @private
		 * @property categoryListService
		 * @type {CategoryListService}
		 */
		this._categoryListService = categoryListService;
	}

	/**
	 * Load all needed data.
	 *
	 * @method load
	 * @return {Object<string, *>} object of promise
	 */
	load() {
		let categoryId = this.params.category;

		return {
			item: this._itemService.load(this.params.itemId),
			category: this._categoryListService.getCategoryByUrl(categoryId)
		};
	}

	/**
	 * @override
	 * @method activate
	 */
	activate() {}

	/**
	 * @override
	 * @method destroy
	 */
	destroy() {}
}
