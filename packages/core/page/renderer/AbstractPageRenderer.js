import ns from '../../namespace';
import PageRenderer from './PageRenderer';
import PageRendererFactory from './PageRendererFactory';
import GenericError from '../../error/GenericError';

ns.namespace('ima.page.renderer');

/**
 * Base class for implementations of the {@linkcode PageRenderer} interface.
 *
 * @class AbstractPageRenderer
 * @implements PageRenderer
 * @namespace ima.page.renderer
 * @module ima
 * @submodule ima.page
 *
 * @requires vendor.$Helper
 * @requires ReactDOM
 */
export default class AbstractPageRenderer extends PageRenderer {

	/**
	 * Initializes the abstract page renderer.
	 *
	 * @constructor
	 * @method constructor
	 * @param {PageRendererFactory} factory Factory for receive $Utils to view.
	 * @param {vendor.$Helper} Helper The IMA.js helper methods.
	 * @param {vendor.ReactDOM} ReactDOM React framework instance, will be used
	 *        to render the page.
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
		 * @type {PageRendererFactory}
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
		 * @type {React.Component}
		 * @default null
		 */
		this._reactiveView = null;

	}

	/**
	 * @inheritdoc
	 * @abstract
	 * @method mount
	 */
	mount(controller, view, pageResources, routeOptions) {
		throw new GenericError('The mount() method is abstract and must be ' +
				'overridden.');
	}

	/**
	 * @inheritdoc
	 * @method update
	 */
	update(controller, resourcesUpdate) {
		throw new GenericError('The update() method is abstract and must be ' +
				'overridden.');
	}

	/**
	 * @inheritdoc
	 * @method unmount
	 */
	unmount() {
		throw new GenericError('The unmount() method is abstract and must ' +
				'be overridden.');
	}

	/**
	 * @inheritdoc
	 * @method setState
	 */
	clearState() {
		if (this._reactiveView &&
				this._reactiveView.state) {

			let emptyState = Object
				.keys(this._reactiveView.state)
				.reduce((state, key) => {
					state[key] = null;

					return state;
				}, {});

			this._reactiveView.setState(emptyState);
		}
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
	 * @param {function(new:React.Component, Object<string, *>)} view The page
	 *        view React component to wrap.
	 * @param {Object<string, *>=} [state={}]
	 * @return {Object<string, *>}
	 */
	_generateViewProps(view, state = {}) {
		let props = {
			view,
			state,
			$Utils: this._factory.getUtils()
		};

		return props;
	}
}

ns.ima.page.renderer.AbstractPageRenderer = AbstractPageRenderer;
