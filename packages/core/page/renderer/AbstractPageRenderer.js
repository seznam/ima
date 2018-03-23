import BlankManagedRootView from './BlankManagedRootView';
import PageRenderer from './PageRenderer';
import ViewAdapter from './ViewAdapter';
import GenericError from '../../error/GenericError';

/**
 * Base class for implementations of the {@linkcode PageRenderer} interface.
 */
export default class AbstractPageRenderer extends PageRenderer {
  /**
   * Initializes the abstract page renderer.
   *
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
     * @type {PageRendererFactory}
     */
    this._factory = factory;

    /**
     * The IMA.js helper methods.
     *
     * @protected
     * @type {Vendor.$Helper}
     */
    this._Helper = Helper;

    /**
     * Rect framework instance, used to render the page.
     *
     * @protected
     * @type {Vendor.ReactDOM}
     */
    this._ReactDOM = ReactDOM;

    /**
     * Application setting for the current application environment.
     *
     * @protected
     * @type {Object<string, *>}
     */
    this._settings = settings;

    /**
     * @protected
     * @type {?React.Component}
     */
    this._reactiveView = null;
  }

  /**
   * @inheritdoc
   * @abstract
   */
  mount() {
    throw new GenericError(
      'The mount() method is abstract and must be overridden.'
    );
  }

  /**
   * @inheritdoc
   */
  update() {
    throw new GenericError(
      'The update() method is abstract and must be overridden.'
    );
  }

  /**
   * @inheritdoc
   */
  unmount() {
    throw new GenericError(
      'The unmount() method is abstract and must be overridden.'
    );
  }

  /**
   * @inheritdoc
   */
  clearState() {
    if (this._reactiveView && this._reactiveView.state) {
      let emptyState = Object.keys(this._reactiveView.state).reduce(
        (state, key) => {
          state[key] = undefined;

          return state;
        },
        {}
      );

      this._reactiveView.setState(emptyState);
    }
  }

  /**
   * @inheritdoc
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

  /**
   * Returns wrapped page view component with managed root view and view adapter.
   *
   * @param {ControllerDecorator} controller
   * @param {function(new: React.Component)} view
   * @param {{
   *          onlyUpdate: (
   *            boolean|
   *            function(
   *              (string|function(new: Controller, ...*)),
   *              (
   *                string|
   *                function(
   *                  new: React.Component,
   *                  Object<string, *>,
   *                  ?Object<string, *>
   *                )
   *              )
   *            ): boolean
   *          ),
   *          autoScroll: boolean,
   *          allowSPA: boolean,
   *          documentView: ?function(new: AbstractDocumentView),
   *          managedRootView: ?function(new: React.Component)
   *        }} routeOptions The current route options.
   */
  _getWrappedPageView(controller, view, routeOptions) {
    let managedRootView = this._factory.getManagedRootView(
      routeOptions.managedRootView ||
        this._settings.$Page.$Render.managedRootView ||
        BlankManagedRootView
    );
    let props = this._generateViewProps(
      managedRootView,
      Object.assign({}, controller.getState(), { $pageView: view })
    );

    return this._factory.wrapView(
      this._settings.$Page.$Render.viewAdapter || ViewAdapter,
      props
    );
  }

  /**
   * Returns the class constructor of the specified document view component.
   *
   * @param {(function(new: React.Component)|string)} documentView The
   *        namespace path pointing to the document view component, or the
   *        constructor of the document view component.
   * @return {function(new: React.Component)} The constructor of the document
   *         view component.
   */
  _getDocumentView(routeOptions) {
    return this._factory.getDocumentView(
      routeOptions.documentView || this._settings.$Page.$Render.documentView
    );
  }
}
