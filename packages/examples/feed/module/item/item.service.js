import ns from 'imajs/client/core/namespace';

ns.namespace('App.Module.Item');

/**
 * Class for the feed model.
 * It's a model of the feed model.
 *
 * @class Service
 * @extends App.Base.Service
 * @namespace App.Module.Item
 * @module App
 * @submodule App.Module
 */
class Service extends ns.App.Base.Service {

	/**
	 * @method constructor
	 * @constructor
	 * @param {App.Module.Item.Resource} itemResource
	 */
	constructor(itemResource) {
		super();

		/**
		 * @property _itemResource
		 * @private
		 * @type {App.Module.Item.Resource}
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

ns.App.Module.Item.Service = Service;
