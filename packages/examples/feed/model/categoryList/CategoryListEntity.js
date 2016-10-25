import AbstractEntity from 'app/model/AbstractEntity';
import CategoryEntity from 'app/model/category/CategoryEntity';

/**
 * Entity of containing a list of categories.
 *
 * @class CategoryListEntity
 * @extends app.model.AbstractEntity
 * @namespace app.model.categoryList
 * @module app
 * @submodule app.model
 */
export default class CategoryListEntity extends AbstractEntity {

	/**
	 * @constructor
	 * @method constructor
	 * @param {Object<string, *>} data
	 */
	constructor(data) {
		super(data._id);

		/**
		 * Entity list - categories for category list.
		 *
		 * @property categories
		 * @type {CategoryEntity[]}
		 */
		this._categories = data.categories;
	}

	/**
	 * Getter for categories
	 *
	 * @method getCategories
	 * @return {CategoryEntity[]}
	 */
	getCategories() {
		return this._categories;
	}

	/**
	 * Getter for category by id
	 *
	 * @method getCategoryById
	 * @return {CategoryEntity}
	 */
	getCategoryById(id) {
		return this._categories.filter(category => category.getId() === id)[0];
	}
}
