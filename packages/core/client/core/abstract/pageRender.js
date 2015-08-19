import ns from 'imajs/client/core/namespace';
import IMAError from 'imajs/client/core/imaError';

ns.namespace('Core.Abstract');

/**
 * Base class for implementations of the
 * {@codelink Core.Interface.PageRenderer} interface.
 *
 * @class PageRender
 * @implements Core.Interface.PageRender
 * @namespace Core.Abstract
 * @module Core
 * @submodule Core.Abstract
 *
 * @requires Vendor.Helper
 * @requires Vendor.React
 * @requires Core.Interface.Animate
 */
export default class PageRender extends ns.Core.Interface.PageRender {

	/**
	 * Initializes the abstract page renderer.
	 *
	 * @constructor
	 * @method constructor
	 * @param {Core.Page.Render.Factory} factory Factory for receive $Utils to view.
	 * @param {Vendor.Helper} Helper The IMA.js helper methods.
	 * @param {Vendor.React} React React framework instance, will be used to
	 *        render the page.
	 * @param {Object<string, *>} settings Application settings for the current
	 *        application environment.
	 */
	constructor(factory, Helper, React, settings) {
		super();

		/**
		 * Factory for receive $Utils to view.
		 *
		 * @protected
		 * @property _factory
		 * @type {Core.Page.Render.Factory}
		 */
		this._factory = factory;

		/**
		 * The IMA.js helper methods.
		 *
		 * @protected
		 * @property _Helper
		 * @type {Vendor.Helper}
		 */
		this._Helper = Helper;

		/**
		 * Rect framework instance, used to render the page.
		 *
		 * @protected
		 * @property _react
		 * @type {Vendor.React}
		 */
		this._React = React;

		/**
		 * Application setting for the current application environment.
		 *
		 * @protected
		 * @property _setting
		 * @type {Object<string, *>}
		 */
		this._settings = settings;

		/**
		 * @protected
		 * @property _reactiveView
		 * @type {Vendor.React.Component}
		 * @default null
		 */
		this._reactiveView = null;

	}

	/**
	 * Renders the page using the provided controller and view. The actual
	 * behavior of this method differs at the client and the at server in the
	 * following way:
	 *
	 * On server, the method renders the page to a string containing HTML markup
	 * to send to the client.
	 *
	 * On client, the method renders the page into DOM, re-using the DOM created
	 * from the HTML markup send by the server if possible.
	 *
	 * @inheritDoc
	 * @override
	 * @method mount
	 * @abstract
	 * @param {Core.Abstract.Controller} controller
	 * @param {Vendor.React.Component} view
	 * @return {Promise}
	 */
	mount(controller, view) { // jshint ignore:line
		throw new IMAError('The mount() method is abstract and must be overridden.');
	}

	/**
	 * Only update controller state and React view not call constructor.
	 *
	 * It is useful for same controller and view, where only change url params.
	 * Then it is possible to reuse same controller and view.
	 *
	 * @inheritDoc
	 * @override
	 * @method update
	 * @param {Core.Decorator.Controller} controller
	 * @param {Object<string, string>=} [params={}] Last route params.
	 * @return {Promise}
	 */
	update(controller, params = {}) {
		throw new IMAError('The update() method is abstract and must be overridden.');
	}

	/**
	 * Unmount view from the DOM. Then React always call constructor
	 * for new mounting view.
	 *
	 * @inheritDoc
	 * @override
	 * @method unmount
	 */
	unmount() {
		throw new IMAError('The unmount() method is abstract and must be overridden.');
	}

	/**
	 * Set state to reactive react component.
	 *
	 * @method setState
	 * @param {Object<string, *>=} [state={}]
	 */
	setState(state = {}) {
		if (this._reactiveView) {
			this._reactiveView.setState(state);
		}
	}

	/**
	 * Generate properties for view from state.
	 *
	 * @protected
	 * @method _generateViewProps
	 * @param {Object<string, *>=} [state={}]
	 * @return {Object<string, *>}
	 */
	_generateViewProps(state = {}) {
		state.$Utils = this._factory.getUtils();

		return state;
	}
}

ns.Core.Abstract.PageRender = PageRender;
