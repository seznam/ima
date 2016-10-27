import AbstractEntityFactory from 'app/model/AbstractEntityFactory';
import CategoryEntity from 'app/model/category/CategoryEntity';

/**
 * Factory to create category entity.
 */
export default class CategoryFactory extends AbstractEntityFactory {

	static get $dependencies() {
		return [];
	}

	constructor() {
		super(CategoryEntity);
	}
}
