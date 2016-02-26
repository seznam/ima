import ns from 'ima/namespace';
import BaseEntity from 'app/base/BaseEntity';

ns.namespace('app.model.categoryList');

/**
 * Entity of category list. It is collecting all other entities or entity lists from category list.
 *
 * @class CategoryListEntity
 * @extends app.base.BaseEntity
 * @namespace app.model.categoryList
 * @module app
 * @submodule app.model
 */
class CategoryListEntity extends BaseEntity {
	/**
	 * @constructor
	 * @method constructor
	 * @param {Object} data
	 */
	constructor(data) {
		super(data._id);

		/**
		 * Entity list - categories for category list.
		 *
		 * @property categories
		 * @type {Array<app.model.category.CategoryEntity>}
		 */
		this._categories = data.categories;
	}

	/**
	 * Getter for categories
	 *
	 * @method getCategories
	 * @return {Array<app.model.category.CategoryEntity>}
	 */
	getCategories() {
		return this._categories;
	}

	/**
	 * Getter for category by id
	 *
	 * @method getCategoryById
	 * @return {app.model.category.CategoryEntity}
	 */
	getCategoryById(id) {
		return this._categories.filter((category) => {
			if (category.getId() === id) {
				return category;
			}
		})[0];
	}

}

ns.app.model.categoryList.CategoryListEntity = CategoryListEntity;
