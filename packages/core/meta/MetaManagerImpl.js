import MetaManager from './MetaManager';

/**
 * Default implementation of the {@codelink MetaManager} interface.
 */
export default class MetaManagerImpl extends MetaManager {
  static get $dependencies() {
    return [];
  }

  /**
	 * Initializes the meta page attributes manager.
	 */
  constructor() {
    super();

    /**
		 * The page title.
		 *
		 * @type {string}
		 */
    this._title = '';

    /**
		 * Storage of generic meta information.
		 *
		 * @type {Map<string, string>}
		 */
    this._metaName = new Map();

    /**
		 * Storage of specialized meta information.
		 *
		 * @type {Map<string, string>}
		 */
    this._metaProperty = new Map();

    /**
		 * Storage of generic link information.
		 *
		 * @type {Map<string, string>}
		 */
    this._link = new Map();
  }

  /**
	 * @inheritdoc
	 */
  setTitle(title) {
    this._title = title;
  }

  /**
	 * @inheritdoc
	 */
  getTitle() {
    return this._title;
  }

  /**
	 * @inheritdoc
	 */
  setMetaName(name, value) {
    this._metaName.set(name, value);
  }

  /**
	 * @inheritdoc
	 */
  getMetaName(name) {
    return this._metaName.get(name) || '';
  }

  /**
	 * @inheritdoc
	 */
  getMetaNames() {
    return Array.from(this._metaName.keys());
  }

  /**
	 * @inheritdoc
	 */
  setMetaProperty(name, value) {
    this._metaProperty.set(name, value);
  }

  /**
	 * @inheritdoc
	 */
  getMetaProperty(name) {
    return this._metaProperty.get(name) || '';
  }

  /**
	 * @inheritdoc
	 */
  getMetaProperties() {
    return Array.from(this._metaProperty.keys());
  }

  /**
	 * @inheritdoc
	 */
  setLink(relation, value) {
    this._link.set(relation, value);
  }

  /**
	 * @inheritdoc
	 */
  getLink(relation) {
    return this._link.get(relation) || '';
  }

  /**
	 * @inheritdoc
	 */
  getLinks() {
    return Array.from(this._link.keys());
  }
}
