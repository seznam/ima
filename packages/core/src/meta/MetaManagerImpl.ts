import MetaManager from './MetaManager';

/**
 * Default implementation of the {@link MetaManager} interface.
 */
export default class MetaManagerImpl extends MetaManager {
  protected _title: string;
  protected _metaName: Map<string, { value: string; [key: string]: string }>;
  protected _metaProperty: Map<
    string,
    { value: string; [key: string]: string }
  >;
  protected _link: Map<string, { value: string; [key: string]: string }>;

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
  setMetaName(name: string, value: { value: string; [key: string]: string }) {
    this._metaName.set(name, value);
  }

  /**
   * @inheritdoc
   */
  getMetaName(name: string) {
    return this._metaName.get(name) || { value: '' };
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
  setMetaProperty(
    name: string,
    value: { value: string; [key: string]: string }
  ) {
    this._metaProperty.set(name, value);
  }

  /**
   * @inheritdoc
   */
  getMetaProperty(name: string) {
    return this._metaProperty.get(name) || { value: '' };
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
  setLink(relation: string, value: { value: string; [key: string]: string }) {
    this._link.set(relation, value);
  }

  /**
   * @inheritdoc
   */
  getLink(relation: string) {
    return this._link.get(relation) || { value: '' };
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
