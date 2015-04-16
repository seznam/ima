import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core.Abstract');

/**
 * Partial implementation of the {@codelink Core.Interface.View} interface,
 * providing basic handling of the view lifecycle and rendering the view using
 * the React framework.
 *
 * @abstract
 * @class View
 * @implements Core.Interface.View
 * @namespace Core.Abstract
 * @module Core
 * @submodule Core.Abstract
 *
 * @requires Vendor.React
 */
class View extends ns.Core.Interface.View {
	/**
	 * Initializes the view instance.
	 *
	 * @constructor
	 * @method constructor
	 * @param {Vendor.React} React The React framework, used to create the view
	 * 				React component and render it to a React element.
	 * @param {Object} utils component utils
	 */
	constructor(React, utils) {
		super();

		/**
		 * The React framework, used to create the view React component and render
		 * it to a React element.
		 *
		 * @property _React
		 * @protected
		 * @type {Vendor.React}
		 */
		this._React = React;

		/**
		 * @property utils
		 * @type {Object}
		 * @default utils
		 */
		this.utils = utils;


		/**
		 * The React view factory as a React class component. This field is
		 * initialized in the {@codelink init} method using the
		 * {@code React.createClass} utility.
		 *
		 * It is recommended to mix into the React view the {@codelink _viewMixin}
		 * mixin, initialized in the {@codelink Core.Abstract.View.init} method to
		 * handle the view's and controller's lifecycle properly.
		 *
		 * @property _view
		 * @protected
		 * @type {Vendor.React.ReactComponent}
		 */
		this._view = null;

		/**
		 * Mixing for the {@codelink _view} React compomnent. This mixin is
		 * initialized in the {@codelink init} method and must be initialized
		 * before the {@codelink _view} field (if it is to be used by it).
		 *
		 * This mixin provides basic handling of the view lifecycle and its
		 * relation to the lifecycle of the bound controller.
		 *
		 * @property _viewMixin
		 * @protected
		 * @type {Object<string, function(...*): *>}
		 * @default {}
		 */
		this._viewMixin = {};
	}

	/**
	 * Initializes this view for use with the provided controller. This method is
	 * usually called automatically by the platform before rendering this view.
	 *
	 * Implementation note: This method must be overridden, the overriding
	 * implementation must set the {@codelink _view} field.
	 *
	 * The overriding implemention may either call this method and use the
	 * {@codelink _viewMixin} field as a mixing of the created {@codelink _view}
	 * component, or create its own implementations of the React component
	 * methods {@codelink getInitialState} (should return the state from the
	 * controller) and {@codelink componentWillUnmount} (must call the
	 * {@codelink deinit()} method of the controller).
	 *
	 * @override
	 * @method init
	 * @param {Function} getInitialState
	 */
	init(getInitialState) {
		this._viewMixin = {
			getInitialState() {
				return getInitialState();
			}
		};
	}

	/**
	 * Renders this view into a React element and returns the created React
	 * element. This method creates a new React element every time it is called.
	 *
	 * @inheritdoc
	 * @override
	 * @method getReactView
	 * @return {Vendor.React.ReactElement} This view rendered to a React element.
	 */
	getReactView() {
		return this._React.createElement(this._view, null);
	}
}

ns.Core.Abstract.View = View;
