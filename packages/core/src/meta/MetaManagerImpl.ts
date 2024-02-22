import {
  MetaManager,
  MetaAttributes,
  MetaManagerRecord,
  MetaValue,
} from './MetaManager';

/**
 * Default implementation of the {@link MetaManager} interface.
 */
export class MetaManagerImpl extends MetaManager {
  protected _title: string;
  protected _metaName: Map<string, MetaManagerRecord<'content'>>;
  protected _metaProperty: Map<string, MetaManagerRecord<'content'>>;
  protected _link: Map<string, MetaManagerRecord<'href'>>;

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
  setTitle(title: string): this {
    this._title = title;

    return this;
  }

  /**
   * @inheritDoc
   */
  getTitle(): string {
    return this._title;
  }

  /**
   * @inheritDoc
   */
  setMetaName(name: string, content: MetaValue, attr?: MetaAttributes): this {
    this._metaName.set(name, { content, ...attr });

    return this;
  }

  /**
   * @inheritDoc
   */
  getMetaName(name: string): MetaManagerRecord<'content'> {
    return this._metaName.get(name) || super.getMetaName(name);
  }

  /**
   * @inheritDoc
   */
  getMetaNames(): string[] {
    return Array.from(this._metaName.keys());
  }

  /**
   * @inheritDoc
   */
  getMetaNamesIterator(): IterableIterator<
    [string, MetaManagerRecord<'content'>]
  > {
    return this._metaName.entries();
  }

  /**
   * @inheritDoc
   */
  setMetaProperty(
    property: string,
    content: MetaValue,
    attr?: MetaAttributes
  ): this {
    this._metaProperty.set(property, { content, ...attr });

    return this;
  }

  /**
   * @inheritDoc
   */
  getMetaProperty(property: string): MetaManagerRecord<'content'> {
    return this._metaProperty.get(property) || super.getMetaProperty(property);
  }

  /**
   * @inheritDoc
   */

  getMetaProperties(): string[] {
    return Array.from(this._metaProperty.keys());
  }

  /**
   * @inheritDoc
   */
  getMetaPropertiesIterator(): IterableIterator<
    [string, MetaManagerRecord<'content'>]
  > {
    return this._metaProperty.entries();
  }

  /**
   * @inheritDoc
   */
  setLink(relation: string, href: MetaValue, attr?: MetaAttributes): this {
    this._link.set(relation, { href, ...attr });

    return this;
  }

  /**
   * @inheritDoc
   */
  getLink(relation: string): MetaManagerRecord<'href'> {
    return this._link.get(relation) || super.getLink(relation);
  }

  /**
   * @inheritDoc
   */
  getLinks(): string[] {
    return Array.from(this._link.keys());
  }

  /**
   * @inheritDoc
   */
  getLinksIterator(): IterableIterator<[string, MetaManagerRecord<'href'>]> {
    return this._link.entries();
  }

  /**
   * @inheritdoc
   */
  clearMetaAttributes(): void {
    this._title = '';
    this._metaProperty.clear();
    this._metaName.clear();
    this._link.clear();
  }
}
