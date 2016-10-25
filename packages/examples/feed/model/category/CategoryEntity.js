import AbstractEntity from 'app/model/AbstractEntity';

/**
 * Category entity.
 *
 * @class CategoryEntity
 * @namespace app.model.category
 * @extends app.model.AbstractEntity
 * @module app
 * @submodule app.model
 */
export default class CategoryEntity extends AbstractEntity {

	constructor(data) {
		super(data._id);

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
		 * @type {string}
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
