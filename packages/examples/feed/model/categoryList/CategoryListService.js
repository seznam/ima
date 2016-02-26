import ns from 'ima/namespace';
import BaseService from 'app/base/BaseService';
import IMAError from 'ima/error/GenericError';

ns.namespace('app.model.categoryList');

/**
 * Class for the feed model.
 * It's a model of the feed model.
 *
 * @class CategoryListService
 * @extends app.base.BaseService
 * @namespace pp.model.categoryList
 * @module app
 * @submodule app.model
 */
class CategoryListService extends BaseService {

	/**
	 * @method constructor
	 * @constructor
	 * @param {app.model.categoryList.CategoryListResource} categoryListResource
	 */
	constructor(categoryListResource) {
		super();

		/**
		 * @property _categoryListResource
		 * @private
		 * @type {app.model.categoryList.CategoryListResource}
		 * @default categoryListResource
		 * */
		this._categoryListResource = categoryListResource;
	}

	/**
	 * Deinitialization model.
	 *
	 * @method deinit
	 * */
	deinit() {}

	/**
	 * Get category by url name.
	 *
	 * @method getCategoryByUrl
	 * @param {string|null} urlName
	 * @return {app.base.CategoryEntity|null}
	 */
	getCategoryByUrl(urlName) {
		return this._categoryListResource
				.getEntity()
				.then((categoryListEntity) => {
					var categories = categoryListEntity.getCategories();

					if (!urlName) {
						return null;
					}

					for (var i = 0; i < categories.length; i++) {
						if (categories[i].getUrlName() === urlName) {
							return categories[i];
						}
					}

					throw new IMAError('Category not found.', { status: 404 });
				});
	}

	/**
	 * @method load
	 * @return {app.model.categoryList.CategoryListEntity}
	 */
	load() {
		return this._categoryListResource.getEntity();
	}
}

ns.app.model.categoryList.CategoryListService = CategoryListService;
