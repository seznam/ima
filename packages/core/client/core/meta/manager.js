import ns from 'imajs/client/core/namespace';
import MetaManager from 'imajs/client/core/interface/metaManager';

ns.namespace('Core.Meta');

/**
 * Default implementation of the {@codelink Core.Interface.MetaManager}
 * interface.
 *
 * @class Manager
 * @implements Core.Interface.MetaManager
 * @namespace Core.Meta
 * @module Core
 * @submodule Core.Meta
 */
export default class Manager extends MetaManager {
	/**
	 * Initializes the meta page attributes manager.
	 *
	 * @method constructor
	 * @constructor
	 */
	constructor() {
		super();

		/**
		 * The page title.
		 *
		 * @property _title
		 * @private
		 * @type {string}
		 * @default ''
		 */
		this._title = '';

		/**
		 * Storage of generic meta information.
		 *
		 * @property _metaName
		 * @type {Map<string, string>}
		 */
		this._metaName = new Map();

		/**
		 * Storage of specialized meta information.
		 *
		 * @property _metaProperty
		 * @type {Map<string, string>}
		 */
		this._metaProperty = new Map();

		/**
		 * Storage of generic link information.
		 *
		 * @property _link
		 * @type {Map<string, string>}
		 */
		this._link = new Map();
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method setTitle
	 * @param {string} title
	 */
	setTitle(title) {
		this._title = title;
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method getTitle
	 * @return {string}
	 */
	getTitle() {
		return this._title;
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method setMetaName
	 * @param {string} name
	 * @param {string} value
	 */
	setMetaName(name, value) {
		this._metaName.set(name, value);
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method getMetaName
	 * @param {string} name
	 * @return {string}
	 */
	getMetaName(name) {
		return this._metaName.get(name) || '';
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method getMetaNames
	 * @return {Array<string>}
	 */
	getMetaNames() {
		return Array.from(this._metaName.keys());
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method setMetaProperty
	 * @param {string} name
	 * @param {string} value
	 */
	setMetaProperty(name, value) {
		this._metaProperty.set(name, value);
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method getMetaProperty
	 * @param {string} name
	 * @return {string}
	 */
	getMetaProperty(name) {
		return this._metaProperty.get(name) || '';
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method getMetaProperties
	 * @return {Array<string>}
	 */
	getMetaProperties() {
		return Array.from(this._metaProperty.keys());
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method setLink
	 * @param {string} name
	 * @param {string} value
	 */
	setLink(name, value) {
		this._link.set(name, value);
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method getLink
	 * @return {string}
	 */
	getLink(name) {
		return this._link.get(name) || '';
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method getLinks
	 * @return {Array<string>}
	 */
	getLinks() {
		return Array.from(this._link.keys());
	}
}

ns.Core.Meta.Manager = Manager;
