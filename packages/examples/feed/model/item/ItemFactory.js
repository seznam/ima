import AbstractEntityFactory from 'app/model/AbstractEntityFactory';
import ItemEntity from 'app/model/item/ItemEntity';

/**
 * Factory  to create item entity.
 *
 * @class ItemFactory
 * @extends app.model.AbstractEntityFactory
 * @namespace app.model.item
 * @module app
 * @submodule app.model
 */
export default class ItemFactory extends AbstractEntityFactory {

	static get $dependencies() {
		return [];
	}

	/**
	 * @constructor
	 * @method constructor
	 */
	constructor() {
		super(ItemEntity);
	}
}
