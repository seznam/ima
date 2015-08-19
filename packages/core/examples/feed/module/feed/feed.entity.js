import ns from 'imajs/client/core/namespace';

ns.namespace('App.Module.Feed');

/**
 * Entity of Feed. It is collecting all other entities or entity lists from feed.
 *
 * @class Entity
 * @extends App.Base.Entity
 * @namespace App.Module.Feed
 * @module App
 * @submodule App.Module
 */
class Entity extends ns.App.Base.Entity {
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
		 * @type {Array[App.Module.Item.Entity]}
		 */
		this._items = data.items;
	}

	/**
	 * Getter for items
	 *
	 * @method getItems
	 * @return {Array[App.Module.Item.Entity]}
	 */
	getItems() {
		return this._items;
	}

	/**
	 * Setter for items
	 *
	 * @method setItems
	 * @param {Array[App.Module.Item.Entity]} items
	 * @return {App.Module.Feed.Entity}
	 */
	setItems(items) {
		this._items = items;
		return this;
	}
}

ns.App.Module.Feed.Entity = Entity;

