import ns from 'imajs/client/core/namespace';

ns.namespace('Core.Page.Render');

/**
 * Factory for page render.
 *
 * @class Factory
 * @namespace Core.Page.Render
 * @module Core
 * @submodule Core.Page
 *
 * @requires Core.ObjectContainer
 */
export default class Factory {

	/**
	 * @method constructor
	 * @constructor
	 * @param {Core.ObjectContainer} oc
	 */
	constructor(oc) {

		/**
		 * @property _oc
		 * @private
		 * @type {Core.ObjectContainer}
		 */
		this._oc = oc;
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
	 * @param {function(new:Vendor.React.Component, Object<string, *>)} view The
	 *        page view React component to wrap.
	 * @param {Object<string, *>} state The initial state to pass to the view.
	 * @return {Vendor.React.Component} View adapter handling passing the
	 *         controller's state to an instance of the specified page view
	 *         through properties.
	 */
	wrapView(view, state) {
		const ViewAdapter = ns.Core.Page.Render.ViewAdapter;
		return ns.Vendor.React.createElement(ViewAdapter, {
			view,
			state
		});
	}
}

ns.Core.Page.Render.Factory = Factory;
