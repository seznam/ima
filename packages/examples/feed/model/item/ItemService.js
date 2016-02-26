import ns from 'ima/namespace';
import BaseService from 'app/base/BaseService';

ns.namespace('app.model.item');

/**
 * Class for the feed model.
 * It's a model of the feed model.
 *
 * @class ItemService
 * @extends app.base.BaseService
 * @namespace app.model.item
 * @module app
 * @submodule app.model
 */
class ItemService extends BaseService {

	/**
	 * @method constructor
	 * @constructor
	 * @param {app.model.item.ItemResource} itemResource
	 */
	constructor(itemResource) {
		super();

		/**
		 * @property _itemResource
		 * @private
		 * @type {app.model.item.ItemResource}
		 * @default itemResource
		 * */
		this._itemResource = itemResource;

	}

	/**
	 * @method load
	 * @param {string} [itemId=null]
	 */
	load(itemId) {
		return this._itemResource
				.getEntity(itemId);
	}
}

ns.app.model.item.ItemService = ItemService;
