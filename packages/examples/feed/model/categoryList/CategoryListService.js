import IMAError from 'ima/error/GenericError';
import AbstractService from 'app/model/AbstractService';
import CategoryEntity from 'app/model/category/CategoryEntity';
import CategoryListEntity from 'app/model/categoryList/CategoryListEntity';
import CategoryListResource from 'app/model/categoryList/CategoryListResource';

/**
 * Category list model service.
 *
 * @class CategoryListService
 * @extends app.model.AbstractService
 * @namespace app.model.categoryList
 * @module app
 * @submodule app.model
 */
export default class CategoryListService extends AbstractService {

	static get $dependencies() {
		return [CategoryListResource];
	}

	/**
	 * @method constructor
	 * @constructor
	 * @param {CategoryListResource} categoryListResource
	 */
	constructor(categoryListResource) {
		super(categoryListResource);
	}

	/**
	 * Get category by url name.
	 *
	 * @method getCategoryByUrl
	 * @param {?string} urlName
	 * @return {Promise<?CategoryEntity>}
	 */
	getCategoryByUrl(urlName) {
		return this._resource.getEntity().then((categoryListEntity) => {
			if (!urlName) {
				return null;
			}

			let categories = categoryListEntity.getCategories();

			for (let i = 0; i < categories.length; i++) {
				if (categories[i].getUrlName() === urlName) {
					return categories[i];
				}
			}

			throw new IMAError('Category not found.', { status: 404 });
		});
	}

	/**
	 * @method load
	 * @return {Promise<CategoryListEntity>}
	 */
	load() {
		return this._resource.getEntity();
	}
}
