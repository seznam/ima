import BaseEntity from 'app/base/BaseEntity';
import ns from 'ima/namespace';

ns.namespace('app.model.category');

/**
 * Entity of portal.
 *
 * @class CategoryEntity
 * @namespace app.model.category
 * @extends app.base.BaseEntity
 * @module app
 * @submodule app.model
 */
class CategoryEntity extends BaseEntity {
	constructor(data) {
		super(data._id, 'services');

		/**
		 * Name of category.
		 *
		 * @property _name
		 * @private
		 * @type {string}
		 */
		this._name = data.name;

		/**
		 * Name to use in URL.
		 *
		 * @property _urlName
		 * @private
		 * @type {number}
		 */
		this._urlName = data.urlname;

		/**
		 * Hash tag
		 *
		 * @property hashTag
		 * @private
		 * @type {string}
		 */
		this._hashTag = data.hashtag;

		/**
		 * Image Url.
		 *
		 * @property _posted
		 * @private
		 * @type {string}
		 */
		this._iconUrl = data.iconurl;
	}

	/**
	 * Getter for _name.
	 *
	 * @method getName
	 * @return {string}
	 */
	getName() {
		return this._name;
	}

	/**
	 * Getter for _urlName.
	 *
	 * @method getUrlName
	 * @return {string}
	 */
	getUrlName() {
		return this._urlName;
	}

	/**
	 * Getter for _hashTag.
	 *
	 * @method getHashTag
	 * @return {string}
	 */
	getHashTag() {
		return this._hashTag;
	}

	/**
	 * Getter for _iconUrl.
	 *
	 * @method getIconUrl
	 * @return {string}
	 */
	getIconUrl() {
		return this._iconUrl;
	}

}

ns.app.model.category.CategoryEntity = CategoryEntity;
