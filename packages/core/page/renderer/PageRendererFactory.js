import ns from '../../namespace';
import AbstractDocumentView from '../AbstractDocumentView';
import ObjectContainer from '../../ObjectContainer';

ns.namespace('ima.page.renderer');

/**
 * Factory for page render.
 *
 * @class PageRendererFactory
 * @namespace ima.page.renderer
 * @module ima
 * @submodule ima.page
 *
 * @requires ObjectContainer
 */
export default class PageRendererFactory {

	/**
	 * @method constructor
	 * @constructor
	 * @param {ObjectContainer} oc The application's dependency injector - the
	 *        object container.
	 * @param {React} React React framework instance to use to render the page.
	 * @param {React.Component} ViewAdapter An adapter component
	 *        providing the current page controller's state to the page view
	 *        component through its properties.
	 */
	constructor(oc, React, ViewAdapter) {

		/**
		 * The application's dependency injector - the object container.
		 *
		 * @property _oc
		 * @private
		 * @type {ObjectContainer}
		 */
		this._oc = oc;

		/**
		 * Rect framework instance, used to render the page.
		 *
		 * @protected
		 * @property _React
		 * @type {React}
		 */
		this._React = React;

		/**
		 * @private
		 * @property _ViewAdapter
		 * @type {React.Component}
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
	 * Returns the class constructor of the specified document view component.
	 * Document view may be specified as a namespace path or as a class
	 * constructor.
	 *
	 * @method getDocumentView
	 * @param {(React.Component|string)} documentView The namespace path
	 *        pointing to the document view component, or the constructor of
	 *        the document view component.
	 * @return {React.Component} The constructor of the document view
	 *         component.
	 */
	getDocumentView(documentView) {
		var documentViewComponent;
		if (typeof documentView === 'string') {
			documentViewComponent = ns.get(documentView);
		} else {
			documentViewComponent = documentView;
		}

		if ($Debug) {
			let componentPrototype = documentViewComponent.prototype;

			if (!(componentPrototype instanceof AbstractDocumentView)) {
				throw new Error('The document view component must extend ' +
						'ima/page/AbstractDocumentView class');
			}
		}

		return documentViewComponent;
	}

	/**
	 * Wraps the provided view into the view adapter so it can access the state
	 * passed from controller through the {@code props} property instead of the
	 * {@code state} property.
	 *
	 * @method wrapView
	 * @param {{
	 *          view: React.Component,
	 *          state: Object<string, *>,
	 *          $Utils: Object<string, *>
	 *        }} props The initial props to pass to the view.
	 * @return {React.Component} View adapter handling passing the
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
	 * @param {(string|React.Component)} view The react component for which a
	 *        factory function should be created.
	 * @return {function(Object<string, *>): React.Element} The created factory
	 *         function. The factory accepts an object containing the
	 *         component's properties as the argument and returns a rendered
	 *         component.
	 */
	reactCreateFactory(view) {
		return this._React.createFactory(view);
	}
}

ns.ima.page.renderer.PageRendererFactory = PageRendererFactory;
