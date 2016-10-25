import AbstractEntityFactory from 'app/model/AbstractEntityFactory';
import CategoryEntity from 'app/model/category/CategoryEntity';

/**
 * Factory to create category entity.
 *
 * @class CategoryFactory
 * @extends app.model.AbstractEntityFactory
 * @namespace app.model.category
 * @module app
 * @submodule app.model
 */
export default class CategoryFactory extends AbstractEntityFactory {

	static get $dependencies() {
		return [];
	}

	/**
	 * @constructor
	 * @method constructor
	 */
	constructor() {
		super(CategoryEntity);
	}
}
