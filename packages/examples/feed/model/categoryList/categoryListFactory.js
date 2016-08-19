import ns from 'ima/namespace';
import BaseEntityFactory from 'app/base/BaseEntityFactory';

ns.namespace('app.model.categoryList');

/**
 * Factory to create feed entity.
 *
 * @class CategoryListFactory
 * @extends app.base.BaseEntityFactory
 * @namespace app.model.categoryList
 * @module app
 * @submodule app.model
 */
class CategoryListFactory extends BaseEntityFactory {
	/**
	 * @constructor
	 * @method constructor
	 * @param {app.model.categoryList.CategoryListEntity} CategoryListEntityConstructor
	 */
	constructor(CategoryListEntityConstructor, categoryFactory) {
		super(CategoryListEntityConstructor);

		this._categoryFactory = categoryFactory;
	}

	/**
	 * Creates Entity of feed
	 *
	 * @method createEntity
	 * @param {Object} data
	 * @return {app.model.categoryList.CategoryListEntity}
	 */
	createEntity(data) {
		let categoryEntityList = this._categoryFactory.createEntityList(data.categories);

		return super.createEntity({ _id: 'categories', categories: categoryEntityList });
	}
}

ns.app.model.categoryList.CategoryListFactory = CategoryListFactory;
