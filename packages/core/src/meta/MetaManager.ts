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
export default abstract class MetaManager {
  /**
   * Sets the page title.
   *
   * @param title The new page title.
   */
  abstract setTitle(title: string): void;

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
  abstract getTitle(): string;

  /**
   * Set the specified named meta information property.
   *
   * @param name Meta information property name, for example
   *        `keywords`.
   * @param value The meta information value.
   */
  abstract setMetaName(name: string, value: string): void;

  /**
   * Returns the value of the specified named meta information property. The
   * method returns an empty string for missing meta information (to make the
   * returned value React-friendly).
   *
   * @param name The name of the named meta information property.
   * @return The value of the generic meta information, or an empty string.
   */
  abstract getMetaName(name: string): string;

  /**
   * Returns the names of the currently specified named meta information
   * properties.
   *
   * @return The names of the currently specified named meta
   *         information properties.
   */
  abstract getMetaNames(): string[];

  /**
   * Sets the specified specialized meta information property.
   *
   * @param name Name of the specialized meta information property.
   * @param value The value of the meta information property.
   */
  abstract setMetaProperty(name: string, value: string): void;

  /**
   * Returns the value of the specified specialized meta information
   * property. The method returns an empty string for missing meta
   * information (to make the returned value React-friendly).
   *
   * @param name The name of the specialized meta information
   *        property.
   * @return {string} The value of the specified meta information, or an
   *         empty string.
   */
  abstract getMetaProperty(name: string): string;

  /**
   * Returns the names of the currently specified specialized meta
   * information properties.
   *
   * @return {string[]} The names of the currently specified specialized meta
   *         information properties.
   */
  abstract getMetaProperties(): string[];

  /**
   * Sets the specified specialized link information.
   *
   * @param {string} relation The relation of the link target to the current
   *        page.
   * @param {string} reference The reference to the location of the related
   *        document, e.g. a URL.
   */
  abstract setLink(relation: string, reference: string): void;

  /**
   * Return the reference to the specified related linked document. The
   * method returns an empty string for missing meta information (to make the
   * returned value React-friendly).
   *
   * @param {string} relation The relation of the link target to the current
   *        page.
   * @return {string} The reference to the location of the related document,
   *         e.g. a URL.
   */
  abstract getLink(relation: string): string;

  /**
   * Returns the relations of the currently set related documents linked to
   * the current page.
   *
   * @return {string[]}
   */
  abstract getLinks(): string[];
}