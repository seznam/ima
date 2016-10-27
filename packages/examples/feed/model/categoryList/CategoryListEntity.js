import AbstractEntity from 'app/model/AbstractEntity';
import CategoryEntity from 'app/model/category/CategoryEntity';

/**
 * Entity of containing a list of categories.
 */
export default class CategoryListEntity extends AbstractEntity {

	/**
	 * @param {Object<string, *>} data
	 */
	constructor(data) {
		super(data._id);

		/**
		 * Entity list - categories for category list.
		 *
		 * @type {CategoryEntity[]}
		 */
		this._categories = data.categories;
	}

	/**
	 * Getter for categories
	 *
	 * @return {CategoryEntity[]}
	 */
	getCategories() {
		return this._categories;
	}

	/**
	 * Getter for category by id
	 *
	 * @return {CategoryEntity}
	 */
	getCategoryById(id) {
		return this._categories.filter(category => category.getId() === id)[0];
	}
}
