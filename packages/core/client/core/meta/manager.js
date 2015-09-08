import ns from 'imajs/client/core/namespace';

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
export default class Manager extends ns.Core.Interface.MetaManager {
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
	 * @return {string[]}
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
	 * @return {string[]}
	 */
	getMetaProperties() {
		return Array.from(this._metaProperty.keys());
	}
}

ns.Core.Meta.Manager = Manager;
