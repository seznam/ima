import AbstractEntityFactory from 'app/model/AbstractEntityFactory';
import CategoryFactory from 'app/model/category/CategoryFactory';
import CategoryListEntity from 'app/model/categoryList/CategoryListEntity';

/**
 * Factory to create feed entity.
 */
export default class CategoryListFactory extends AbstractEntityFactory {

	static get $dependencies() {
		return [CategoryFactory];
	}

	/**
	 * @param {CategoryFactory} categoryFactory
	 */
	constructor(categoryFactory) {
		super(CategoryListEntity);

		this._categoryFactory = categoryFactory;
	}

	/**
	 * Creates Entity of feed
	 *
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
