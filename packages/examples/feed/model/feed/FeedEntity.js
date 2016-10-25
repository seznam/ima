import AbstractEntity from 'app/model/AbstractEntity';
import ItemEntity from 'app/model/item/ItemEntity';

/**
 * Feed item entity.
 *
 * @class FeedEntity
 * @extends app.model.AbstractEntity
 * @namespace app.model.feed
 * @module app
 * @submodule app.model
 */
export default class FeedEntity extends AbstractEntity {

	/**
	 * @constructor
	 * @method constructor
	 * @param {Object<string, *>} data
	 */
	constructor(data) {
		super(data._id);

		/**
		 * Entity list - feed items.
		 *
		 * @property items
		 * @type {ItemEntity[]}
		 */
		this._items = data.items;
	}

	/**
	 * Getter for items
	 *
	 * @method getItems
	 * @return {ItemEntity[]}
	 */
	getItems() {
		return this._items;
	}

	/**
	 * Setter for items
	 *
	 * @method setItems
	 * @param {ItemEntity[]} items
	 * @return {FeedEntity}
	 */
	setItems(items) {
		this._items = items;
		return this;
	}
}
