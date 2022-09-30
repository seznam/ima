import MetaManager from './MetaManager';

/**
 * Default implementation of the {@link MetaManager} interface.
 */
export default class MetaManagerImpl extends MetaManager {
  protected _title: string;
  protected _metaName: Map<string, string>;
  protected _metaProperty: Map<string, string>;
  protected _link: Map<string, string>;

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
     */
    this._title = '';

    /**
     * Storage of generic meta information.
     */
    this._metaName = new Map();

    /**
     * Storage of specialized meta information.
     */
    this._metaProperty = new Map();

    /**
     * Storage of generic link information.
     */
    this._link = new Map();
  }

  /**
   * @inheritdoc
   */
  setTitle(title: string) {
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
  setMetaName(name: string, value: string) {
    this._metaName.set(name, value);
  }

  /**
   * @inheritdoc
   */
  getMetaName(name: string) {
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
  setMetaProperty(name: string, value: string) {
    this._metaProperty.set(name, value);
  }

  /**
   * @inheritdoc
   */
  getMetaProperty(name: string) {
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
  setLink(relation: string, value: string) {
    this._link.set(relation, value);
  }

  /**
   * @inheritdoc
   */
  getLink(relation: string) {
    return this._link.get(relation) || '';
  }

  /**
   * @inheritdoc
   */
  getLinks() {
    return Array.from(this._link.keys());
  }

  /**
   * @inheritdoc
   */
  clearMetaAttributes() {
    this._metaProperty = new Map();
    this._metaName = new Map();
    this._link = new Map();
  }
}
