import ns from 'core/namespace/ns.js';

ns.namespace('Core.Interface');

/**
 * Interface for SEO.
 *
 * @class Handler
 * @namespace Core.Interface
 * @module Core
 * @submodule Core.Interface
 */
class Seo {

	/**
	 * Set page title.
	 *
	 * @method setPageTitle
	 */
	setTitle() {
	}

	/**
	 * Get page title.
	 *
	 * @method getPageTitle
	 */
	getTitle() {
	}

	/**
	 * Set data for meta tag with attribute name.
	 *
	 * @method setMetaName
	 */
	setMetaName() {
	}

	/**
	 * Returns data for meta tag with attribute name.
	 *
	 * @method getMetaName
	 */
	getMetaName() {
	}

	/**
	 * Returns storage for meta tags with attribute name.
	 *
	 * @method getMetaNameStorage
	 */
	getMetaNameStorage() {
	}

	/**
	 * Set data for meta tag with attribute property.
	 *
	 * @method setMetaProperty
	 */
	setMetaProperty() {
	}

	/**
	 * Returns data for meta tag with attribute property.
	 *
	 * @method getMetaProperty
	 */
	getMetaProperty() {
	}

	/**
	 * Returns data for meta tags with attribute property.
	 *
	 * @method getMetaPropertyStorage
	 */
	getMetaPropertyStorage() {
	}
}

ns.Core.Interface.Seo = Seo;