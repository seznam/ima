import ns from 'ima/namespace';
import BaseEntityFactory from 'app/base/BaseEntityFactory';

ns.namespace('app.model.category');

/**
 * Factory to create category entity.
 *
 * @class CategoryFactory
 * @extends app.base.BaseEntityFactory
 * @namespace app.model.category
 * @module app
 * @submodule app.model
 */
class CategoryFactory extends BaseEntityFactory {
	/**
	 * @constructor
	 * @method constructor
	 * @param {app.model.category.CategoryEntity} CategoryEntityConstructor
	 */
	constructor(CategoryEntityConstructor) {
		super(CategoryEntityConstructor);
	}
}

ns.app.model.category.CategoryFactory = CategoryFactory;
