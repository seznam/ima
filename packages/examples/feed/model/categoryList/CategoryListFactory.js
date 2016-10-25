import AbstractEntityFactory from 'app/model/AbstractEntityFactory';
import CategoryFactory from 'app/model/category/CategoryFactory';
import CategoryListEntity from 'app/model/categoryList/CategoryListEntity';

/**
 * Factory to create feed entity.
 *
 * @class CategoryListFactory
 * @extends app.model.AbstractEntityFactory
 * @namespace app.model.categoryList
 * @module app
 * @submodule app.model
 */
export default class CategoryListFactory extends AbstractEntityFactory {

	static get $dependencies() {
		return [CategoryFactory];
	}

	/**
	 * @constructor
	 * @method constructor
	 * @param {CategoryFactory} categoryFactory
	 */
	constructor(categoryFactory) {
		super(CategoryListEntity);

		this._categoryFactory = categoryFactory;
	}

	/**
	 * Creates Entity of feed
	 *
	 * @method createEntity
	 * @param {Object<string, *>} data
	 * @return {CategoryListEntity}
	 */
	createEntity(data) {
		let categoryEntityList = this._categoryFactory.createEntityList(
			data.categories
		);

		return super.createEntity({
			_id: 'categories',
			categories: categoryEntityList
		});
	}
}
