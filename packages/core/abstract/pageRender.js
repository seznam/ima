import ns from 'ima/namespace';
import IMAError from 'ima/error/genericError';
import PageRenderInterface from 'ima/interface/pageRender';

ns.namespace('Ima.Abstract');

/**
 * Base class for implementations of the
 * {@codelink Ima.Interface.PageRenderer} interface.
 *
 * @class PageRender
 * @implements Ima.Interface.PageRender
 * @namespace Ima.Abstract
 * @module Ima
 * @submodule Ima.Abstract
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
	 * @param {Ima.Page.Render.Factory} factory Factory for receive $Utils to
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
		 * @type {Ima.Page.Render.Factory}
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
	 * @inheritdoc
	 * @abstract
	 * @method mount
	 */
	mount(controller, view, pageResources) {
		throw new IMAError('The mount() method is abstract and must be ' +
				'overridden.');
	}

	/**
	 * @inheritdoc
	 * @method update
	 */
	update(controller, resourcesUpdate) {
		throw new IMAError('The update() method is abstract and must be ' +
				'overridden.');
	}

	/**
	 * @inheritdoc
	 * @method unmount
	 */
	unmount() {
		throw new IMAError('The unmount() method is abstract and must be ' +
				'overridden.');
	}

	/**
	 * @inheritdoc
	 * @method setState
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
	 * @param {function(new:Vendor.React.Component, Object<string, *>)} view
	 *        The page view React component to wrap.
	 * @param {Object<string, *>=} [state={}]
	 * @return {Object<string, *>}
	 */
	_generateViewProps(view, state = {}) {
		var props = {
			view,
			state,
			$Utils: this._factory.getUtils()
		};

		return props;
	}
}

ns.Ima.Abstract.PageRender = PageRender;
