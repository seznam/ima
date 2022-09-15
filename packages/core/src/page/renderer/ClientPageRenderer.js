/* @if server **
export default class ClientPageRenderer {};
/* @else */
import AbstractPageRenderer from './AbstractPageRenderer';
import Events from './Events';
import Types from './Types';

/**
 * Client-side page renderer. The renderer attempts to reuse the markup sent by
 * server if possible.
 */
export default class ClientPageRenderer extends AbstractPageRenderer {
  /**
   * Initializes the client-side page renderer.
   *
   * @param {PageRendererFactory} factory Factory for receive $Utils to view.
   * @param {vendor.$Helper} Helper The IMA.js helper methods.
   * @param {vendor.ReactDOM} ReactDOM React framework instance to use to
   *        render the page on the client side.
   * @param {Dispatcher} dispatcher Dispatcher fires events to app.
   * @param {Object<string, *>} settings The application setting for the
   *        current application environment.
   * @param {Window} window Helper for manipulating the global object
   *        (`window`) regardless of the client/server-side
   *        environment.
   */
  constructor(factory, Helper, ReactDOM, dispatcher, settings, window) {
    super(factory, Helper, ReactDOM, dispatcher, settings);

    /**
     * Flag signalling that the page is being rendered for the first time.
     *
     * @type {boolean}
     */
    this._firstTime = true;

    /**
     * Helper for manipulating the global object (`window`)
     * regardless of the client/server-side environment.
     *
     * @type {Window}
     */
    this._window = window;

    /**
     * The HTML element containing the current application view for the
     * current route.
     *
     * @type {?HTMLElement}
     */
    this._viewContainer = null;
  }

  /**
   * @inheritdoc
   */
  async mount(controller, view, pageResources, routeOptions) {
    let separatedData = this._separatePromisesAndValues(pageResources);
    let defaultPageState = separatedData.values;
    let loadedPromises = separatedData.promises;

    if (!this._firstTime) {
      this._setStateWithoutRendering(controller, defaultPageState);
      await this._renderToDOM(controller, view, routeOptions);
      this._patchPromisesToState(controller, loadedPromises);
    }

    return this._Helper
      .allPromiseHash(loadedPromises)
      .then(async fetchedResources => {
        let pageState = Object.assign({}, defaultPageState, fetchedResources);

        if (this._firstTime) {
          controller.setState(pageState);
          await this._renderToDOM(controller, view, routeOptions);
          this._firstTime = false;
        }

        controller.setMetaParams(pageState);
        this._updateMetaAttributes(controller.getMetaManager());

        return {
          content: null,
          status: controller.getHttpStatus(),
          pageState,
        };
      })
      .catch(error => this._handleError(error));
  }

  /**
   * @inheritdoc
   */
  update(controller, view, resourcesUpdate) {
    let separatedData = this._separatePromisesAndValues(resourcesUpdate);
    let defaultPageState = separatedData.values;
    let updatedPromises = separatedData.promises;

    controller.setState(defaultPageState);
    this._patchPromisesToState(controller, updatedPromises);

    return this._Helper
      .allPromiseHash(updatedPromises)
      .then(fetchedResources => {
        controller.setMetaParams(controller.getState());
        this._updateMetaAttributes(controller.getMetaManager());

        return {
          content: null,
          status: controller.getHttpStatus(),
          pageState: Object.assign({}, defaultPageState, fetchedResources),
        };
      })
      .catch(error => this._handleError(error));
  }

  /**
   * @inheritdoc
   */
  unmount() {
    if (this._reactiveView) {
      if (this._ReactDOM.unmountComponentAtNode(this._viewContainer)) {
        this._reactiveView = null;
        this._dispatcher.fire(Events.UNMOUNTED, { type: Types.UNMOUNT }, true);
      }
    }
  }

  /**
   * Show error to console in $Debug mode and re-throw that error
   * for other error handler.
   *
   * @param {Error} error
   * @throws {Error} Re-throws the handled error.
   */
  _handleError(error) {
    if ($Debug) {
      console.error('Render Error:', error);
    }

    throw error;
  }

  /**
   * Patch promise values to controller state.
   *
   * @param {ControllerDecorator} controller
   * @param {Object<string, Promise<*>>} patchedPromises
   */
  _patchPromisesToState(controller, patchedPromises) {
    for (let resourceName of Object.keys(patchedPromises)) {
      patchedPromises[resourceName]
        .then(resource => {
          controller.setState({
            [resourceName]: resource,
          });
        })
        .catch(error => this._handleError(error));
    }

    this._startBatchTransactions(controller, patchedPromises);
  }

  /**
   * Batch patch promise values to controller state.
   *
   * @param {ControllerDecorator} controller
   * @param {Object<string, Promise<*>>} patchedPromises
   */
  _startBatchTransactions(controller, patchedPromises) {
    let hasResourcesLoaded = false;
    const options = {
      timeout: 100,
    };
    const requestIdleCallback = this._window.getWindow().requestIdleCallback
      ? this._window.getWindow().requestIdleCallback
      : callback => setTimeout(callback, 0);
    const handler = () => {
      controller.commitStateTransaction();

      if (!hasResourcesLoaded) {
        controller.beginStateTransaction();
        setTimeout(() => {
          requestIdleCallback(handler, options);
        }, 1000 / 60);
      }
    };

    controller.beginStateTransaction();
    requestIdleCallback(handler, options);

    this._Helper
      .allPromiseHash(patchedPromises)
      .then(() => {
        hasResourcesLoaded = true;
      })
      .catch(() => {
        hasResourcesLoaded = true;
      });
  }

  // TODO IMA@18
  /**
   * The method is hacky for IMA@17 and we must rewrite logic for IMA@18.
   *
   * @param {Controller} controller
   * @param {Object<string, *>} defaultPageState
   */
  _setStateWithoutRendering(controller, defaultPageState) {
    const patchState = this._patchStateToClearPreviousState(defaultPageState);

    const reactiveView = this._reactiveView;
    this._reactiveView = null;

    controller.setState(patchState);
    this._reactiveView = reactiveView;
  }

  /**
   *
   *
   * @param {Object<string, *>} state
   * @returns {Object<string, *>}
   */
  _patchStateToClearPreviousState(state) {
    if (!this._reactiveView || !this._reactiveView.state) {
      return state;
    }

    Object.keys(this._reactiveView.state).forEach(key => {
      state[key] = state[key] !== undefined ? state[key] : undefined;
    });

    return state;
  }

  /**
   * Renders the current route to DOM.
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
   *          documentView: ?function(new: AbstractDocumentView),
   *          managedRootView: ?function(new: React.Component)
   *        }} routeOptions The current route options.
   * @return {Promise<undefined>}
   */
  _renderToDOM(controller, view, routeOptions) {
    let reactElementView = this._getWrappedPageView(
      controller,
      view,
      routeOptions
    );

    let documentView = this._getDocumentView(routeOptions);
    let masterElementId = documentView.masterElementId;
    this._viewContainer = this._window.getElementById(masterElementId);

    if (!this._viewContainer) {
      const errorMessage =
        `ima.core.page.renderer.ClientPageRenderer:_renderToDOM: ` +
        `Element with ID "${masterElementId}" was not found in the DOM. ` +
        `Maybe the DOM is not in the interactive mode yet.`;

      if ($Debug) {
        console.warn(errorMessage);
      }

      this._dispatcher.fire(Events.ERROR, { message: errorMessage }, true);

      return Promise.resolve();
    }

    if (this._viewContainer.children.length) {
      return new Promise(resolve => setTimeout(resolve, 1000 / 60)).then(() => {
        this._reactiveView = this._ReactDOM.hydrate(
          reactElementView,
          this._viewContainer,
          () => {
            this._dispatcher.fire(
              Events.MOUNTED,
              { type: Types.HYDRATE },
              true
            );
          }
        );
      });
    } else {
      this._reactiveView = this._ReactDOM.render(
        reactElementView,
        this._viewContainer,
        () => {
          this._dispatcher.fire(Events.MOUNTED, { type: Types.RENDER }, true);
        }
      );

      return Promise.resolve();
    }
  }

  /**
   * Separate promises and values from provided data map. Values will be use
   * for default page state. Promises will be patched to state after their
   * resolve.
   *
   * @param {Object<string, *>} dataMap A map of data.
   * @return {{
   *           promises: Object<string, Promise<*>>,
   *           values: Object<string, *>
   *         }} Return separated promises and other values.
   */
  _separatePromisesAndValues(dataMap) {
    let promises = {};
    let values = {};

    for (let field of Object.keys(dataMap)) {
      let value = dataMap[field];

      if (value instanceof Promise) {
        promises[field] = value;
      } else {
        values[field] = value;
      }
    }

    return { promises, values };
  }

  /**
   * Updates the title and the contents of the meta elements used for SEO.
   *
   * @param {MetaManager} metaManager meta attributes storage providing the
   *        new values for page meta elements and title.
   */
  _updateMetaAttributes(metaManager) {
    this._window.setTitle(metaManager.getTitle());

    this._updateMetaNameAttributes(metaManager);
    this._updateMetaPropertyAttributes(metaManager);
    this._updateMetaLinkAttributes(metaManager);
  }

  /**
   * Updates the contents of the generic meta elements used for SEO.
   *
   * @param {MetaManager} metaManager meta attributes storage providing the
   *        new values for page meta elements and title.
   */
  _updateMetaNameAttributes(metaManager) {
    let metaTagKey = null;
    let metaTag;

    for (metaTagKey of metaManager.getMetaNames()) {
      metaTag = this._window.querySelector(`meta[name="${metaTagKey}"]`);

      if (metaTag) {
        metaTag.content = metaManager.getMetaName(metaTagKey);
      }
    }
  }

  /**
   * Updates the contents of the specialized meta elements used for SEO.
   *
   * @param {MetaManager} metaManager meta attributes storage providing the
   *        new values for page meta elements and title.
   */
  _updateMetaPropertyAttributes(metaManager) {
    let metaTagKey = null;
    let metaTag;

    for (metaTagKey of metaManager.getMetaProperties()) {
      metaTag = this._window.querySelector(`meta[property="${metaTagKey}"]`);

      if (metaTag) {
        metaTag.content = metaManager.getMetaProperty(metaTagKey);
      }
    }
  }

  /**
   * Updates the href of the specialized link elements used for SEO.
   *
   * @param {MetaManager} metaManager meta attributes storage providing the
   *        new values for page meta elements and title.
   */
  _updateMetaLinkAttributes(metaManager) {
    let linkTagKey = null;
    let linkTag;

    for (linkTagKey of metaManager.getLinks()) {
      linkTag = this._window.querySelector(`link[rel="${linkTagKey}"]`);

      if (linkTag && linkTag.href) {
        linkTag.href = metaManager.getLink(linkTagKey);
      }
    }
  }
}
// @endif
