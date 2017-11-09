import AbstractDocumentView from '../AbstractDocumentView';

/**
 * Factory for page render.
 */
export default class PageRendererFactory {
  /**
	 * Initializes the factory used by the page renderer.
	 *
	 * @param {ObjectContainer} oc The application's dependency injector - the
	 *        object container.
	 * @param {React} React The React framework instance to use to render the
	 *        page.
	 */
  constructor(oc, React) {
    /**
		 * The application's dependency injector - the object container.
		 *
		 * @type {ObjectContainer}
		 */
    this._oc = oc;

    /**
		 * Rect framework instance, used to render the page.
		 *
		 * @protected
		 * @type {React}
		 */
    this._React = React;
  }

  /**
	 * Return object of services which are defined for alias $Utils.
	 */
  getUtils() {
    return this._oc.get('$Utils');
  }

  /**
	 * Returns the class constructor of the specified document view component.
	 * Document view may be specified as a namespace path or as a class
	 * constructor.
	 *
	 * @param {(function(new: React.Component)|string)} documentView The
	 *        namespace path pointing to the document view component, or the
	 *        constructor of the document view component.
	 * @return {function(new: React.Component)} The constructor of the document
	 *         view component.
	 */
  getDocumentView(documentView) {
    let documentViewComponent = this._resolveClassConstructor(documentView);

    if ($Debug) {
      let componentPrototype = documentViewComponent.prototype;

      if (!(componentPrototype instanceof AbstractDocumentView)) {
        throw new Error(
          'The document view component must extend ' +
            'ima/page/AbstractDocumentView class'
        );
      }
    }

    return documentViewComponent;
  }

  /**
	 * Returns the class constructor of the specified managed root view
	 * component. Managed root view may be specified as a namespace
	 * path or as a class constructor.
	 *
	 * @param {(function(new: React.Component)|string)} managedRootView The
	 *        namespace path pointing to the managed root view component, or
	 *        the constructor of the React component.
	 * @return {function(new: React.Component)} The constructor of the managed
	 *         root view component.
	 */
  getManagedRootView(managedRootView) {
    let managedRootViewComponent = this._resolveClassConstructor(
      managedRootView
    );

    if ($Debug) {
      let componentPrototype = managedRootViewComponent.prototype;

      if (!(componentPrototype instanceof this._React.Component)) {
        throw new Error(
          'The managed root view component must extend ' + 'React.Component'
        );
      }
    }

    return managedRootViewComponent;
  }

  /**
	 * Returns the class constructor of the specified view component.
	 * View may be specified as a namespace path or as a class
	 * constructor.
	 *
	 * @param {(function(new: React.Component)|string)} view The namespace path
	 *        pointing to the view component, or the constructor
	 *        of the {@code React.Component}.
	 * @return {function(new: React.Component)} The constructor of the view
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
	 * @param {(function(new: React.Component)|string)} view The namespace path
	 *        pointing to the view component, or the constructor
	 *        of the {@code React.Component}.
	 * @param {{
	 *          view: React.Component,
	 *          state: Object<string, *>,
	 *          $Utils: Object<string, *>
	 *        }} props The initial props to pass to the view.
	 * @return {React.Element} View adapter handling passing the controller's
	 *         state to an instance of the specified page view through
	 *         properties.
	 */
  wrapView(view, props) {
    return this._React.createElement(
      this._resolveClassConstructor(view),
      props
    );
  }

  /**
	 * Return a function that produces ReactElements of a given type.
	 * Like React.createElement.
	 *
	 * @param {(string|function(new: React.Component))} view The react
	 *        component for which a factory function should be created.
	 * @return {function(Object<string, *>): React.Element} The created factory
	 *         function. The factory accepts an object containing the
	 *         component's properties as the argument and returns a rendered
	 *         component.
	 */
  createReactElementFactory(view) {
    return this._React.createFactory(view);
  }
}
