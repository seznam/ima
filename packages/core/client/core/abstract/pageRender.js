import ns from 'imajs/client/core/namespace';
import IMAError from 'imajs/client/core/imaError';
import PageRenderInterface from 'imajs/client/core/interface/pageRender';

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
 * @requires Vendor.$Helper
 * @requires Vendor.React
 */
export default class PageRender extends PageRenderInterface {

	/**
	 * Initializes the abstract page renderer.
	 *
	 * @constructor
	 * @method constructor
	 * @param {Core.Page.Render.Factory} factory Factory for receive $Utils to
	 *        view.
	 * @param {Vendor.$Helper} Helper The IMA.js helper methods.
	 * @param {Vendor.ReactDOM} ReactDOM React framework instance, will be used to
	 *        render the page.
	 * @param {Object<string, *>} settings Application settings for the current
	 *        application environment.
	 */
	constructor(factory, Helper, ReactDOM, settings) {
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
		 * @type {Vendor.$Helper}
		 */
		this._Helper = Helper;

		/**
		 * Rect framework instance, used to render the page.
		 *
		 * @protected
		 * @property _ReactDOM
		 * @type {Vendor.ReactDOM}
		 */
		this._ReactDOM = ReactDOM;

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
	 * @inheritDoc
	 * @override
	 * @method mount
	 * @abstract
	 * @param {Core.Abstract.Controller} controller
	 * @param {Vendor.React.Component} view
	 * @param {Object<string, *>} loadedPageState
	 * @return {Promise}
	 */
	mount(controller, view, loadedPageState) { // jshint ignore:line
		throw new IMAError('The mount() method is abstract and must be ' +
				'overridden.');
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method update
	 * @param {Core.Abstract.Controller} controller
	 * @param {Object<string, *>} updatedPageState
	 * @return {Promise}
	 */
	update(controller, updatedPageState) {
		throw new IMAError('The update() method is abstract and must be ' +
				'overridden.');
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method unmount
	 */
	unmount() {
		throw new IMAError('The unmount() method is abstract and must be ' +
				'overridden.');
	}

	/**
	 * @inheritDoc
	 * @override
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
