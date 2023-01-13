import MetaManager, {
  MetaAttributes,
  MetaManagerRecord,
  MetaValue,
} from './MetaManager';

/**
 * Default implementation of the {@link MetaManager} interface.
 */
export default class MetaManagerImpl extends MetaManager {
  protected _title: MetaManagerRecord;
  protected _metaName: Map<string, MetaManagerRecord>;
  protected _metaProperty: Map<string, MetaManagerRecord>;
  protected _link: Map<string, MetaManagerRecord>;

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
  setTitle(title: string, attr?: MetaAttributes): void {
    this._title = this.#createRecord(title, attr);
  }

  /**
   * @inheritDoc
   */
  getTitle(): MetaManagerRecord {
    return this._title;
  }

  /**
   * @inheritDoc
   */
  setMetaName(name: string, value: string, attr?: MetaAttributes): void {
    this._metaName.set(name, this.#createRecord(value, attr));
  }

  /**
   * @inheritDoc
   */
  getMetaName(name: string): MetaManagerRecord {
    return this._metaName.get(name) || '';
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
  setMetaProperty(name: string, value: MetaValue, attr?: MetaAttributes): void {
    this._metaProperty.set(name, this.#createRecord(value, attr));
  }

  /**
   * @inheritDoc
   */
  getMetaProperty(name: string): MetaManagerRecord {
    return this._metaProperty.get(name) || '';
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
  setLink(relation: string, value: string, attr?: MetaAttributes): void {
    this._link.set(relation, this.#createRecord(value, attr));
  }

  /**
   * @inheritDoc
   */
  getLink(relation: string): MetaManagerRecord {
    return this._link.get(relation) || '';
  }

  /**
   * @inheritDoc
   */
  getLinks(): string[] {
    return Array.from(this._link.keys());
  }

  #createRecord(value: MetaValue, attr?: MetaAttributes): MetaManagerRecord {
    let record: MetaManagerRecord;

    if (attr) {
      record = { value: value, ...attr };
    } else {
      record = value;
    }

    return record;
  }
}
