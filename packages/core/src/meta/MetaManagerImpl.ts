import MetaManager, { MetaAttributes, MetaValue } from './MetaManager';

/**
 * Default implementation of the {@link MetaManager} interface.
 */
export default class MetaManagerImpl extends MetaManager {
  protected _title: string;
  protected _metaName: Map<string, MetaAttributes>;
  protected _metaProperty: Map<string, MetaAttributes>;
  protected _link: Map<string, MetaAttributes>;

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
  setMetaName(name: string, content: MetaValue, otherAttrs?: MetaAttributes) {
    this._metaName.set(name, { content, ...otherAttrs });
  }

  /**
   * @inheritdoc
   */
  getMetaName(name: string) {
    return this._metaName.get(name) || super.getMetaName(name);
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
    property: string,
    content: MetaValue,
    otherAttrs?: MetaAttributes
  ) {
    this._metaProperty.set(property, { content, ...otherAttrs });
  }

  /**
   * @inheritdoc
   */
  getMetaProperty(property: string) {
    return this._metaProperty.get(property) || super.getMetaProperty(property);
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
  setLink(rel: string, href: MetaValue, otherAttrs?: MetaAttributes) {
    this._link.set(rel, { href, ...otherAttrs });
  }

  /**
   * @inheritdoc
   */
  getLink(rel: string) {
    return this._link.get(rel) || super.getLink(rel);
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
