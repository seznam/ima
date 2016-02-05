import ns from 'imajs/client/core/namespace';

ns.namespace('App.Module.Item');

/**
 * Entity of item.
 *
 * @class Entity
 * @namespace App.Module.Item
 * @extends App.Base.Entity
 * @module App
 * @submodule App.Module
 */
class Entity extends ns.App.Base.Entity {
	constructor(data) {
		super(data._id);

		/**
		 * Text of item.
		 *
		 * @property _text
		 * @private
		 * @type {string}
		 */
		this._content = data.content;

		/**
		 * ID of the service to which this feed item is related.
		 *
		 * @property _category
		 * @private
		 * @type {number}
		 */
		this._category = data.category;

		/**
		 * Dete of item publication.
		 *
		 * @property _posted
		 * @private
		 * @type {Date}
		 */
		this._posted = new Date(data.date);
	}

	/**
	 * Getter for text.
	 *
	 * @method getText
	 * @return {string}
	 */
	getContent() {
		return this._content;
	}

	/**
	 * Getter for service.
	 *
	 * @method getService
	 * @return {number}
	 */
	getCategoryId() {
		return this._category;
	}

	/**
	 * Getter for posted.
	 *
	 * @method getPosted
	 * @return {Date}
	 */
	getPosted() {
		return this._posted;
	}
}

ns.App.Module.Item.Entity = Entity;
