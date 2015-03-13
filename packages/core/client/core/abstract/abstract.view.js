import ns from 'core/namespace/ns.js';

ns.namespace('Core.Abstract');

/**
 * Abstract class for View.
 * @class View
 * @extends Core.Interface.View
 * @namespace Core.Abstract
 * @module Core
 * @submodule Core.Abstract
 *
 * @requires Vendor.React
 */
class View extends ns.Core.Interface.View {

	/**
	 * @constructor
	 * @method constructor
	 * @param {Vendor.React} react
	 */
	constructor(react) {
		super();

		/**
		 * @property _react
		 * @protected
		 * @type Vendor.React
		 */
		this._react = react;

		/**
		 * @property _view
		 * @protected
		 * @type Vendor.ReactComponent
		 * @default null
		 */
		this._view = null;

		/**
		 * Abstract config for react component.
		 *
		 * @property _viewConfig
		 * @type {Object}
		 * @default {}
		 * */
		this._viewConfig = {};

	}

	/**
	 * View initialization.
	 *
	 * @method init
	 * @param {Core.Abstract.Controller} controller
	 */
	init(controller) { // jshint ignore:line

		this._viewConfig = {
			getInitialState() {
				return controller.getState();
			},
			componentWillUnmount() {
				controller.deinit();
			}
		};
	}

	/**
	 * @method getView
	 * @return {Vendor.ReactComponent} - reactive view 
	 */
	getView() {
		return this._react.createElement(this._view, null);
	}
}

ns.Core.Abstract.View = View;