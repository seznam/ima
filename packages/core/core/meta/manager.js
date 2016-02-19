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
	 * @inheritdoc
	 * @method setTitle
	 */
	setTitle(title) {
		this._title = title;
	}

	/**
	 * @inheritdoc
	 * @method getTitle
	 */
	getTitle() {
		return this._title;
	}

	/**
	 * @inheritdoc
	 * @method setMetaName
	 */
	setMetaName(name, value) {
		this._metaName.set(name, value);
	}

	/**
	 * @inheritdoc
	 * @method getMetaName
	 */
	getMetaName(name) {
		return this._metaName.get(name) || '';
	}

	/**
	 * @inheritdoc
	 * @method getMetaNames
	 */
	getMetaNames() {
		return Array.from(this._metaName.keys());
	}

	/**
	 * @inheritdoc
	 * @method setMetaProperty
	 */
	setMetaProperty(name, value) {
		this._metaProperty.set(name, value);
	}

	/**
	 * @inheritdoc
	 * @method getMetaProperty
	 */
	getMetaProperty(name) {
		return this._metaProperty.get(name) || '';
	}

	/**
	 * @inheritdoc
	 * @method getMetaProperties
	 */
	getMetaProperties() {
		return Array.from(this._metaProperty.keys());
	}

	/**
	 * @inheritdoc
	 * @method setLink
	 */
	setLink(name, value) {
		this._link.set(name, value);
	}

	/**
	 * @inheritdoc
	 * @method getLink
	 */
	getLink(name) {
		return this._link.get(name) || '';
	}

	/**
	 * @inheritdoc
	 * @method getLinks
	 */
	getLinks() {
		return Array.from(this._link.keys());
	}
}

ns.Core.Meta.Manager = Manager;
