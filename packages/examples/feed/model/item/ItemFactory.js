import ns from 'ima/namespace';
import BaseEntityFactory from 'app/base/BaseEntityFactory';

ns.namespace('app.model.item');

/**
 * Factory  to create item entity.
 *
 * @class ItemFactory
 * @extends app.base.BaseEntityFactory
 * @namespace app.model.item
 * @module app
 * @submodule app.model
 */
class ItemFactory extends BaseEntityFactory {
	/**
	 * @constructor
	 * @method constructor
	 * @param {app.model.item.ItemEntity} ItemEntityConstructor
	 */
	constructor(ItemEntityConstructor) {
		super(ItemEntityConstructor);
	}
}

ns.app.model.item.ItemFactory = ItemFactory;
