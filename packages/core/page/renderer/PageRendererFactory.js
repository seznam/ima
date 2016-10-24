import ns from '../../namespace';
import AbstractDocumentView from '../AbstractDocumentView';
import ObjectContainer from '../../ObjectContainer';
import ViewAdapter from './ViewAdapter';

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
	 */
	constructor(oc, React) {

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
		let documentViewComponent = this._resolveClassConstructor(
			documentView
		);

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
	 * Returns the class constructor of the specified managed root view
	 * component. Managed root view may be specified as a namespace
	 * path or as a class constructor.
	 *
	 * @method getManagedRootView
	 * @param {(React.Component|string)} managedRootView The namespace path
	 *        pointing to the managed root view component, or the constructor
	 *        of the React component.
	 * @return {React.Component} The constructor of the managed root view
	 *         component.
	 */
	getManagedRootView(managedRootView) {
		let managedRootViewComponent = this._resolveClassConstructor(
			managedRootView
		);

		if ($Debug) {
			let componentPrototype = managedRootViewComponent.prototype;

			if (!(componentPrototype instanceof this._React.Component)) {
				throw new Error('The managed root view component must extend ' +
						'React.Component');
			}
		}

		return managedRootViewComponent;
	}

	/**
	 * Returns the class constructor of the specified view component.
	 * View may be specified as a namespace path or as a class
	 * constructor.
	 *
	 * @method _resolveClassConstructor
	 * @param {(React.Component|string)} view The namespace path
	 *        pointing to the view component, or the constructor
	 *        of the React.Component.
	 * @return {React.Component} The constructor of the view
	 *         component.
	 */
	_resolveClassConstructor(view) {
		if (typeof view === 'string') {
			view = ns.get(view);
		}

		return view;
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
	 * @return {React.Element} View adapter handling passing the controller's
	 *         state to an instance of the specified page view through
	 *         properties.
	 */
	wrapView(props) {
		return this._React.createElement(ViewAdapter, props);
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
