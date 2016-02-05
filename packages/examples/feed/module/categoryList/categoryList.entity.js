import ns from 'imajs/client/core/namespace';

ns.namespace('App.Module.CategoryList');

/**
 * Entity of category list. It is collecting all other entities or entity lists from category list.
 *
 * @class Entity
 * @extends App.Base.Entity
 * @namespace App.Module.CategoryList
 * @module App
 * @submodule App.Module
 */
class Entity extends ns.App.Base.Entity {
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
		 * @type {Array[App.Module.Category.Entity]}
		 */
		this._categories = data.categories;
	}

	/**
	 * Getter for categories
	 *
	 * @method getCategories
	 * @return {Array[App.Module.Item.Entity]}
	 */
	getCategories() {
		return this._categories;
	}

	/**
	 * Getter for category by id
	 *
	 * @method getCategoryById
	 * @return {App.Module.Item.Entity}
	 */
	getCategoryById(id) {
		return this._categories.filter((category) => {
			if (category.getId() === id) {
				return category;
			}
		})[0];
	}

}

ns.App.Module.CategoryList.Entity = Entity;

