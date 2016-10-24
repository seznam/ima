import ns from '../namespace';
import MetaManager from './MetaManager';

ns.namespace('ima.meta');

/**
 * Default implementation of the {@codelink MetaManager} interface.
 *
 * @class MetaManagerImpl
 * @implements MetaManager
 * @namespace ima.meta
 * @module ima
 * @submodule ima.meta
 */
export default class MetaManagerImpl extends MetaManager {

	static get $dependencies() {
		return [];
	}

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
	setLink(relation, value) {
		this._link.set(relation, value);
	}

	/**
	 * @inheritdoc
	 * @method getLink
	 */
	getLink(relation) {
		return this._link.get(relation) || '';
	}

	/**
	 * @inheritdoc
	 * @method getLinks
	 */
	getLinks() {
		return Array.from(this._link.keys());
	}
}

ns.ima.meta.MetaManagerImpl = MetaManagerImpl;
