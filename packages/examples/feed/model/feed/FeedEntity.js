import ns from 'ima/namespace';
import BaseEntity from 'app/base/BaseEntity';

ns.namespace('app.model.feed');

/**
 * Entity of feed. It is collecting all other entities or entity lists from feed.
 *
 * @class FeedEntity
 * @extends app.base.BaseEntity
 * @namespace app.model.feed
 * @module app
 * @submodule app.model
 */
class FeedEntity extends BaseEntity {
	/**
	 * @constructor
	 * @method constructor
	 * @param {Object} data
	 */
	constructor(data) {
		super(data._id);

		/**
		 * Entity list - items for feed.
		 *
		 * @property items
		 * @type {Array<app.model.item.ItemEntity>}
		 */
		this._items = data.items;
	}

	/**
	 * Getter for items
	 *
	 * @method getItems
	 * @return {Array<app.model.item.ItemEntity>}
	 */
	getItems() {
		return this._items;
	}

	/**
	 * Setter for items
	 *
	 * @method setItems
	 * @param {Array[app.model.item.ItemEntity]} items
	 * @return {app.model.feed.ItemEntity}
	 */
	setItems(items) {
		this._items = items;
		return this;
	}
}

ns.app.model.feed.FeedEntity = FeedEntity;
