export type MetaValue = number | boolean | string | null | undefined;
export type MetaAttributes = Record<string, MetaValue>;

export type MetaManagerRecordKeys = 'property' | 'content' | 'href';
export type MetaManagerRecord<K extends MetaManagerRecordKeys> = {
  [key in K]: MetaValue;
} & MetaAttributes;

/**
 * The Meta manager is a utility for managing various page attributes related
 * to the SEO (search engine optimization) and social network integration.
 *
 * The Meta manager is used to manage the following:
 * - page title, set using the contents of the `&lt;title&gt;` element
 * - page links, linking related documents and meta-information, added to the
 *   using `&lt;link&gt;` elements
 * - page meta information:
 *   - the generic named meta information added to the page via
 *     `&lt;meta&gt;} elements with the `name` attribute, for
 *     example the `keywords`.
 *   - specialized meta information added to the page via `&lt;meta&gt;`
 *     elements with the `property` attribute, for example the OG meta
 *     tags (`og:type`, `og:image`, etc.).
 */
export abstract class MetaManager {
  /**
   * Sets the page title.
   *
   * @param title The new page title.
   */
  setTitle(title: string): MetaManager {
    return this;
  }

  /**
   * Returns the page title. The method returns an empty string if no page
   * title has been set yet.
   *
   * Note that the page title is cached internally by the meta manager and
   * may therefore differ from the current document title if it has been
   * modified by a 3rd party code.
   *
   * @return The current page title.
   */
  getTitle(): string {
    return '';
  }

  /**
   * Set the specified named meta information property.
   *
   * @param name Meta information property name, for example
   *        `keywords`.
   * @param content The meta information content.
   * @parram attr Additional optional meta attributes.
   */
  setMetaName(
    name: string,
    content: MetaValue,
    attr?: MetaAttributes
  ): MetaManager {
    return this;
  }

  /**
   * Returns the value of the specified named meta information property. The
   * method returns an empty string for missing meta information (to make the
   * returned value React-friendly).
   *
   * @param name The name of the named meta information property.
   * @return The value of the generic meta information, or an empty string.
   */
  getMetaName(name: string): MetaManagerRecord<'content'> {
    return { content: '' };
  }

  /**
   * Returns the names of the currently specified named meta information
   * properties.
   *
   * @return The names of the currently specified named meta
   *         information properties.
   */
  getMetaNames(): string[] {
    return [];
  }

  /**
   * Return [key, value] pairs of named meta information.
   *
   * @return [key, value] pairs of named meta information.
   */
  getMetaNamesIterator():
    | IterableIterator<[string, MetaManagerRecord<'content'>]>
    | never[] {
    return [];
  }

  /**
   * Sets the specified specialized meta information property.
   *
   * @param name Name of the specialized meta information property.
   * @param property The value of the meta information property.
   * @parram attr Additional optional meta attributes.
   */
  setMetaProperty(
    name: string,
    property: MetaValue,
    attr?: MetaAttributes
  ): MetaManager {
    return this;
  }

  /**
   * Returns the value of the specified specialized meta information
   * property. The method returns an empty string for missing meta
   * information (to make the returned value React-friendly).
   *
   * @param name The name of the specialized meta information
   *        property.
   * @return The value of the specified meta information, or an
   *         empty string.
   */
  getMetaProperty(name: string): MetaManagerRecord<'property'> {
    return { property: '' };
  }

  /**
   * Returns the names of the currently specified specialized meta
   * information properties.
   *
   * @return The names of the currently specified specialized meta
   *         information properties.
   */
  getMetaProperties(): string[] {
    return [];
  }

  /**
   * Return [key, value] pairs of meta information properties.
   *
   * @return [key, value] pairs of meta information properties.
   */
  getMetaPropertiesIterator():
    | IterableIterator<[string, MetaManagerRecord<'property'>]>
    | never[] {
    return [];
  }

  /**
   * Sets the specified specialized link information.
   *
   * @param relation The relation of the link target to the current
   *        page.
   * @param href The reference to the location of the related
   *        document, e.g. a URL.
   * @parram attr Additional optional link attributes.
   */
  setLink(
    relation: string,
    href: MetaValue,
    attr?: MetaAttributes
  ): MetaManager {
    return this;
  }

  /**
   * Return the reference to the specified related linked document. The
   * method returns an empty string for missing meta information (to make the
   * returned value React-friendly).
   *
   * @param relation The relation of the link target to the current
   *        page.
   * @return The reference to the location of the related document,
   *         e.g. a URL.
   */
  getLink(relation: string): MetaManagerRecord<'href'> {
    return { href: '' };
  }

  /**
   * Returns the relations of the currently set related documents linked to
   * the current page.
   */
  getLinks(): string[] {
    return [];
  }

  /**
   * Return [key, value] pairs of currently set links.
   *
   * @return [key, value] pairs of currently set links.
   */
  getLinksIterator():
    | IterableIterator<[string, MetaManagerRecord<'href'>]>
    | never[] {
    return [];
  }

  /**
   * Resets the stored meta names, properties and links.
   */
  clearMetaAttributes(): void {
    return;
  }
}
