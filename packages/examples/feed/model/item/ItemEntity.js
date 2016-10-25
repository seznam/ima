import AbstractEntity from 'app/model/AbstractEntity';

/**
 * Feed item entity.
 *
 * @class ItemEntity
 * @namespace app.model.item
 * @extends app.model.AbstractEntity
 * @module app
 * @submodule app.model
 */
export default class ItemEntity extends AbstractEntity {

	constructor(data) {
		super(data._id);

		/**
		 * Text of item.
		 *
		 * @private
		 * @property _text
		 * @type {string}
		 */
		this._content = data.content;

		/**
		 * ID of the service to which this feed item is related.
		 *
		 * @private
		 * @property _category
		 * @type {number}
		 */
		this._category = data.category;

		/**
		 * Dete of item publication.
		 *
		 * @private
		 * @property _posted
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
