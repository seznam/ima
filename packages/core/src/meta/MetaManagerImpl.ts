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
   * @inheritDoc
   */
  setTitle(title: string) {
    this._title = title;
  }

  /**
   * @inheritDoc
   */
  getTitle() {
    return this._title;
  }

  /**
   * @inheritDoc
   */
  setMetaName(name: string, content: MetaValue, otherAttrs?: MetaAttributes) {
    this._metaName.set(name, { content, ...otherAttrs });
  }

  /**
   * @inheritDoc
   */
  getMetaName(name: string) {
    return this._metaName.get(name) || { content: '' };
  }

  /**
   * @inheritDoc
   */
  getMetaNames() {
    return Array.from(this._metaName.keys());
  }

  /**
   * @inheritDoc
   */
  setMetaProperty(
    property: string,
    content: MetaValue,
    otherAttrs?: MetaAttributes
  ) {
    this._metaProperty.set(property, { content, ...otherAttrs });
  }

  /**
   * @inheritDoc
   */
  getMetaProperty(property: string) {
    return this._metaProperty.get(property) || { content: '' };
  }

  /**
   * @inheritDoc
   */
  getMetaProperties() {
    return Array.from(this._metaProperty.keys());
  }

  /**
   * @inheritDoc
   */
  setLink(rel: string, href: MetaValue, otherAttrs?: MetaAttributes) {
    this._link.set(rel, { href, ...otherAttrs });
  }

  /**
   * @inheritDoc
   */
  getLink(rel: string) {
    return this._link.get(rel) || { href: '' };
  }

  /**
   * @inheritDoc
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
