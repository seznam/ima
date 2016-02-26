import ns from 'ima/namespace';
import BaseResource from 'app/base/BaseResource';

ns.namespace('app.model.item');

/**
 * Resource for items.
 *
 * @class ItemResource
 * @extends app.base.BaseResource
 * @namespace app.model.item
 * @module app
 * @submodule app.model
 */
class ItemResource extends BaseResource {
	/**
	 * @method constructor
	 * @constructor
	 * @param {ima.http.HttpAgent} http
	 * @param {string} url - API URL (Base server + api specific path.)
	 * @param {app.model.item.ItemFactory} itemFactory
	 * @param {ima.Cache.Cache} cache
	 * */
	constructor(http, apiUrl, itemFactory, cache) {
		super(http, apiUrl, itemFactory, cache);
	}

	/**
	 * Method returns entity with list of items.
	 *
	 * @method getEntity
	 * @param {string} id - Id of the item.
	 * @return {app.model.item.ItemEntity} - Promise of item entity
	 */
	getEntity(id) {
		return super.getEntity(null, { id: id });
	}

	/**
	 * Method make request to API server and returns new entity.
	 *
	 * @method createEntity
	 * @param {Object} data - Data with text and category for create new Entity ({text: <string>, category: <number>}).
	 * @return {app.model.item.ItemEntity} - Promise of item entity
	 */
	createEntity(data) {
		this._cache.clear();

		return super.createEntity(data);
	}
}

ns.app.model.item.ItemResource = ItemResource;
