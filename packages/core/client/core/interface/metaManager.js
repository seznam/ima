import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core.Interface');

/**
 * The Meta manager is a utility for managing various page attributes related to
 * the SEO (search engine optimization).
 *
 * The Meta manager is used to manage the following:
 * - page title, added to the page via the {@code &lt;title&gt;} element
 * - page meta information:
 *   - the generic meta information added to the page via {@code &lt;meta&gt;}
 *     elements with the {@code name} attribute, for example the
 *     {@code keywords}.
 *   - specialized meta information added to the page via {@code &lt;meta&gt;}
 *     elements with the {@code property} attribute, for example the OG meta
 *     tags ({@code og:type}, {@code og:image}, etc.).
 *
 * @interface Handler
 * @namespace Core.Interface
 * @module Core
 * @submodule Core.Interface
 */
export default class MetaManager {
	/**
	 * Sets the page title.
	 *
	 * @method setTitle
	 * @param {string} title The new page title.
	 */
	setTitle(title) {}

	/**
	 * Returns the page title. The method returns an empty string if no page
	 * title has been set yet.
	 *
	 * @method getTitle
	 * @return {string} The paget title currently stored in this meta manager.
	 */
	getTitle() {}

	/**
	 * Set the specified generic meta information.
	 *
	 * @method setMetaName
	 * @param {string} name Meta information name, for example {@code keywords}.
	 * @param {string} value The meta information value.
	 */
	setMetaName(name, value) {}

	/**
	 * Returns the value of the specified generic meta information. The method
	 * returns an empty string for missing meta information (to make the returned
	 * value React-friendly).
	 *
	 * @method getMetaName
	 * @param {string} name The name of the generic meta information.
	 * @return {string} The value of the generic meta information, or an empty
	 *         string.
	 */
	getMetaName(name) {}

	/**
	 * Returns the names of the currently known generic meta information.
	 *
	 * @method getMetaNameStorage
	 * @return {string[]} The names of the currently known generic meta
	 *         information.
	 */
	getMetaNameStorage() {}

	/**
	 * Sets the specified specialized meta information.
	 *
	 * @method setMetaProperty
	 * @param {string} name Name of the specialized meta information.
	 * @param {string} value The value of the meta information.
	 */
	setMetaProperty(name, value) {}

	/**
	 * Returns the value of the specified specialized meta information. The
	 * method returns an empty string for missing meta information (to make the
	 * returned value React-friendly).
	 *
	 * @method getMetaProperty
	 * @param {string} name The name of the specialized meta information.
	 * @return {string} The value of the specified meta information, or an empty
	 *         string.
	 */
	getMetaProperty(name) {}

	/**
	 * Returns the names of the currently known specialized meta information.
	 *
	 * @method getMetaPropertyStorage
	 * @return {string[]} The names of the currently known specialized meta
	 *         information.
	 */
	getMetaPropertyStorage() {}
}

ns.Core.Interface.MetaManager = MetaManager;
