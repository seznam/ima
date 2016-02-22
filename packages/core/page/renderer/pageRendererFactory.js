import ns from 'ima/namespace';

ns.namespace('Ima.Page.Renderer');

/**
 * Factory for page render.
 *
 * @class PageRendererFactory
 * @namespace Ima.Page.Renderer
 * @module Ima
 * @submodule Ima.Page
 *
 * @requires Ima.ObjectContainer
 */
export default class PageRendererFactory {

	/**
	 * @method constructor
	 * @constructor
	 * @param {Ima.ObjectContainer} oc
	 * @param {Vendor.React} React React framework instance to use to render
	 *        the page.
	 * @param {Vendor.React.Component} ViewAdapter An adapter component
	 *        providing the current page controller's state to the page view
	 *        component through its properties.
	 */
	constructor(oc, React, ViewAdapter) {

		/**
		 * @property _oc
		 * @private
		 * @type {Ima.ObjectContainer}
		 */
		this._oc = oc;

		/**
		 * Rect framework instance, used to render the page.
		 *
		 * @protected
		 * @property _React
		 * @type {Vendor.React}
		 */
		this._React = React;

		/**
		 * @private
		 * @property _ViewAdapter
		 * @type {Vendor.React.Component}
		 */
		this._ViewAdapter = ViewAdapter;
	}

	/**
	 * Return object of services which are defined for alias $Utils.
	 *
	 * @method getUtils
	 */
	getUtils() {
		return this._oc.get('$Utils');
	}

	/**
	 * Wraps the provided view into the view adapter so it can access the state
	 * passed from controller through the {@code props} property instead of the
	 * {@code state} property.
	 *
	 * @method wrapView
	 * @param {{view: ns.Vendor.React.Component, state: Object<string, *>, $Utils: Object<string, *>}} props
	 *        The initial props to pass to the view.
	 * @return {Vendor.React.Component} View adapter handling passing the
	 *         controller's state to an instance of the specified page view
	 *         through properties.
	 */
	wrapView(props) {
		return this._React.createElement(this._ViewAdapter, props);
	}

	/**
	 * Return a function that produces ReactElements of a given type.
	 * Like React.createElement.
	 *
	 * @method reactCreateFactory
	 * @param {(string|ReactClass)} view
	 */
	reactCreateFactory(view) {
		return this._React.createFactory(view);
	}
}

ns.Ima.Page.Renderer.PageRendererFactory = PageRendererFactory;
