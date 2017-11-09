/**
 * The Meta manager is a utility for managing various page attributes related
 * to the SEO (search engine optimization) and social network integration.
 *
 * The Meta manager is used to manage the following:
 * - page title, set using the contents of the {@code &lt;title&gt;} element
 * - page links, linking related documents and meta-information, added to the
 *   using {@code &lt;link&gt;} elements
 * - page meta information:
 *   - the generic named meta information added to the page via
 *     {@code &lt;meta&gt;} elements with the {@code name} attribute, for
 *     example the {@code keywords}.
 *   - specialized meta information added to the page via {@code &lt;meta&gt;}
 *     elements with the {@code property} attribute, for example the OG meta
 *     tags ({@code og:type}, {@code og:image}, etc.).
 *
 * @interface
 */
export default class MetaManager {
  /**
	 * Sets the page title.
	 *
	 * @param {string} title The new page title.
	 */
  setTitle(title) {}

  /**
	 * Returns the page title. The method returns an empty string if no page
	 * title has been set yet.
	 *
	 * Note that the page title is cached internally by the meta manager and
	 * may therefore differ from the current document title if it has been
	 * modified by a 3rd party code.
	 *
	 * @return {string} The current page title.
	 */
  getTitle() {}

  /**
	 * Set the specified named meta information property.
	 *
	 * @param {string} name Meta information property name, for example
	 *        {@code keywords}.
	 * @param {string} value The meta information value.
	 */
  setMetaName(name, value) {}

  /**
	 * Returns the value of the specified named meta information property. The
	 * method returns an empty string for missing meta information (to make the
	 * returned value React-friendly).
	 *
	 * @param {string} name The name of the named meta information property.
	 * @return {string} The value of the generic meta information, or an empty
	 *         string.
	 */
  getMetaName(name) {}

  /**
	 * Returns the names of the currently specified named meta information
	 * properties.
	 *
	 * @return {string[]} The names of the currently specified named meta
	 *         information properties.
	 */
  getMetaNames() {}

  /**
	 * Sets the specified specialized meta information property.
	 *
	 * @param {string} name Name of the specialized meta information property.
	 * @param {string} value The value of the meta information property.
	 */
  setMetaProperty(name, value) {}

  /**
	 * Returns the value of the specified specialized meta information
	 * property. The method returns an empty string for missing meta
	 * information (to make the returned value React-friendly).
	 *
	 * @param {string} name The name of the specialized meta information
	 *        property.
	 * @return {string} The value of the specified meta information, or an
	 *         empty string.
	 */
  getMetaProperty(name) {}

  /**
	 * Returns the names of the currently specified specialized meta
	 * information properties.
	 *
	 * @return {string[]} The names of the currently specified specialized meta
	 *         information properties.
	 */
  getMetaProperties() {}

  /**
	 * Sets the specified specialized link information.
	 *
	 * @param {string} relation The relation of the link target to the current
	 *        page.
	 * @param {string} reference The reference to the location of the related
	 *        document, e.g. a URL.
	 */
  setLink(relation, reference) {}

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
  getLink(relation) {}

  /**
	 * Returns the relations of the currently set related documents linked to
	 * the current page.
	 *
	 * @return {string[]}
	 */
  getLinks() {}
}
