import ns from 'ima/namespace';
import BaseEntity from 'app/base/BaseEntity';

ns.namespace('app.model.item');

/**
 * Entity of item.
 *
 * @class ItemEntity
 * @namespace app.model.item
 * @extends app.base.BaseEntity
 * @module app
 * @submodule app.model
 */
class ItemEntity extends BaseEntity {
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

ns.app.model.item.ItemEntity = ItemEntity;
