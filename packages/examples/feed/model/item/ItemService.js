import AbstractService from 'app/model/AbstractService';
import ItemResource from 'app/model/item/ItemResource';

/**
 * Class for the feed model.
 * It's a model of the feed model.
 *
 * @class ItemService
 * @extends app.model.AbstractService
 * @namespace app.model.item
 * @module app
 * @submodule app.model
 */
export default class ItemService extends AbstractService {

	static get $dependencies() {
		return [ItemResource];
	}

	/**
	 * @constructor
	 * @method constructor
	 * @param {ItemResource} itemResource
	 */
	constructor(itemResource) {
		super(itemResource);
	}

	/**
	 * @method load
	 * @param {?string} [itemId=null]
	 * @return {Promise<ItemEntity>}
	 */
	load(itemId) {
		return this._resource.getEntity(itemId);
	}
}
