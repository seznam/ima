import MetaManager from './MetaManager';

/**
 * Default implementation of the {@link MetaManager} interface.
 */
export default class MetaManagerImpl extends MetaManager {
  protected _title: string;
  protected _metaName: Map<string, string | object>;
  protected _metaProperty: Map<string, string | object>;
  protected _link: Map<string, string | object>;

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
  setMetaName(name: string, value: string, other_attrs: object) {
    const meta = other_attrs ? { value, ...other_attrs } : value;
    this._metaName.set(name, meta);
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
  setMetaProperty(name: string, value: string, other_attrs: object) {
    const meta = other_attrs ? { value, ...other_attrs } : value;
    this._metaProperty.set(name, meta);
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
  setLink(relation: string, value: string, other_attrs: object) {
    const meta = other_attrs ? { value, ...other_attrs } : value;
    this._link.set(relation, meta);
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
    this._metaProperty.clear();
    this._metaName.clear();
    this._link.clear();
  }
}
