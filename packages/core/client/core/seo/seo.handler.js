import ns from 'core/namespace/ns.js';

ns.namespace('Core.Seo');

/**
 * Handler for SEO.
 *
 * @class Handler
 * @extends Core.Interface.Seo
 * @namespace Core.Seo
 * @module Core
 * @submodule Core.Seo
 */
class Handler extends ns.Core.Interface.Seo {

	/**
	 * @method constructor
	 * @constructor
	 */
	constructor() {
		super();

		/**
		 * @property _title
		 * @private
		 * @type {string}
		 * @default ''
		 */
		this._title = '';

		/**
		 * @property _metaNameStorage
		 * @type {Map}
		 * @default new Map()
		 */
		this._metaNameStorage = new Map();

		/**
		 * @property _metaPropertyStorage
		 * @type {Map}
		 * @default new Map()
		 */
		this._metaPropertyStorage = new Map();
	}

	/**
	 * Set page title.
	 *
	 * @method setTitle
	 * @param {string} title
	 */
	setTitle(title) {
		this._title = title;
	}

	/**
	 * Get page title.
	 *
	 * @method getTitle
	 * @return {string}
	 */
	getTitle() {
		return this._title;
	}

	/**
	 * Set data for meta tag with attribute name.
	 *
	 * @method setMetaName
	 * @param {string} metaName
	 * @param {string} value
	 */
	setMetaName(metaName, value) {
		this._metaNameStorage.set(metaName, value);
	}

	/**
	 * Returns data for meta tag with attribute name.
	 *
	 * @method getMetaName
	 * @param {string} metaName
	 * @return {string}
	 */
	getMetaName(metaName) {
		if (this._metaNameStorage.has(metaName)) {
			return this._metaNameStorage.get(metaName);
		}

		return '';
	}

	/**
	 * Returns storage for meta tags with attribute name.
	 *
	 * @method getMetaNameStorage
	 * @return {Map}
	 */
	getMetaNameStorage() {
		return this._metaNameStorage;
	}

	/**
	 * Set data for meta tag with attribute property.
	 *
	 * @method setMetaProperty
	 * @param {string} metaProperty
	 * @param {string} value
	 */
	setMetaProperty(metaProperty, value) {
		this._metaPropertyStorage.set(metaProperty, value);
	}

	/**
	 * Returns data for meta tag with attribute property.
	 *
	 * @method getMetaProperty
	 * @param {string} metaProperty
	 * @return {string}
	 */
	getMetaProperty(metaProperty) {
		if (this._metaPropertyStorage.has(metaProperty)) {
			return this._metaPropertyStorage.get(metaProperty);
		}

		return '';
	}

	/**
	 * Returns data for meta tags with attribute property.
	 *
	 * @method getMetaPropertyStorage
	 * @return {Map}
	 */
	getMetaPropertyStorage() {
		return this._metaPropertyStorage;
	}
}

ns.Core.Seo.Handler = Handler;