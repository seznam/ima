import PageManager from './PageManager';

/**
 * An Object used to configure a route
 * 
 * @typedef {{
 *            onlyUpdate: (
 *              boolean|
 *              function(
 *                (string|function(new: Controller)),
 *                function(new: React.Component,
 *                 Object<string, *>,
 *                 ?Object<string, *>
 *               )
 *              ): boolean
 *            ),
 *            autoScroll: boolean,
 *            allowSPA: boolean,
 *            documentView: ?function(new: AbstractDocumentView),
 *            managedRootView: ?function(new: React.Component),
 *            viewAdapter: ?function(new: React.Component)
 *          }} RouteOptions
 */

/**
 * An object representing a page that's currently managed by PageManager
 * 
 * @typedef {{
 *            controller: ?(string|function(new: Controller)),
 *            controllerInstance: ?Controller,
 *            decoratedController: ?Controller,
 *            view: ?React.Component,
 *            viewInstance: ?React.Element,
 *            options: ?RouteOptions,
 *            params: ?Object<string, string>,
 *            state: {
 *              activated: boolean
 *            }
 *          }} ManagedPage
 */

/**
 * Page manager for controller.
 */
export default class AbstractPageManager extends PageManager {
  /**
   * Initializes the page manager.
   *
   * @param {PageFactory} pageFactory Factory used by the page manager to
   *        create instances of the controller for the current route, and
   *        decorate the controllers and page state managers.
   * @param {PageRenderer} pageRenderer The current renderer of the page.
   * @param {PageStateManager} pageStateManager The current page state
   *        manager.
   * @param {Array<PageManagerHandler>} pageManagerHandlers List of handlers
   *        that will be called before and after managing a page life cycle.
   */
  constructor(pageFactory, pageRenderer, pageStateManager, pageManagerHandlers) {
    super();

    if (!Array.isArray(pageManagerHandlers)) {
      pageManagerHandlers = [pageManagerHandlers];
    }

    /**
     * Factory used by the page manager to create instances of the
     * controller for the current route, and decorate the controllers and
     * page state managers.
     *
     * @protected
     * @type {PageFactory}
     */
    this._pageFactory = pageFactory;

    /**
     * The current renderer of the page.
     *
     * @protected
     * @type {PageRenderer}
     */
    this._pageRenderer = pageRenderer;

    /**
     * The current page state manager.
     *
     * @protected
     * @type {PageStateManager}
     */
    this._pageStateManager = pageStateManager;

    /**
     * Details of the currently managed page.
     *
     * @protected
     * @type {ManagedPage}
     */
    this._managedPage = {};

    /**
     * Snapshot of the previously managed page before it was replaced with
     * a new one
     *
     * @protected
     * @type {ManagedPage}
     */
    this._previousManagedPage = {};

    /**
     * List of handlers that will be called before and after managing a page 
     * life cycle.
     *
     * @protected
     * @type {Array<PageManagerHandler>}
     */
    this._pageManagerHandlers = pageManagerHandlers;
  }

  /**
   * @inheritdoc
   */
  init() {
    this._clearManagedPageValue();
    this._pageStateManager.onChange = newState => {
      this._onChangeStateHandler(newState);
    };
  }

  /**
   * @inheritdoc
   */
  manage(controller, view, options, params = {}) {
    this._storeManagedPageSnapshot();

    if (this._hasOnlyUpdate(controller, view, options)) {
      this._managedPage.params = params;
      this._runPreManageHandlers(this._managedPage);

      return this._updatePageSource();
    }

    // Construct new managedPage value
    const pageFactory = this._pageFactory;
    const controllerInstance = pageFactory.createController(controller);
    const decoratedController = pageFactory.decorateController(
      controllerInstance
    );
    const viewInstance = pageFactory.createView(view);

    this._clearManagedPageValue();
    const newManagedPage = this._constructManagedPageValue(
      controller,
      view,
      options,
      params,
      controllerInstance,
      decoratedController,
      viewInstance
    );

    // Run pre-manage handlers before affecting anything
    this._runPreManageHandlers(newManagedPage);

    // Deactivate the old instances and clearing state
    this._deactivatePageSource();
    this._destroyPageSource();

    this._pageStateManager.clear();
    this._clearComponentState(options);

    // Store the new managedPage object and initialize controllers and 
    // extensions
    this._managedPage = newManagedPage
    this._initPageSource();

    return this._loadPageSource();
  }

  /**
   * @inheritdoc
   */
  destroy() {
    this._pageStateManager.onChange = null;

    this._deactivatePageSource();
    this._destroyPageSource();

    this._pageStateManager.clear();

    this._clearManagedPageValue();
  }

  /**
   * @protected
   * @param {(string|function)} controller
   * @param {(string|function)} view
   * @param {RouteOptions} options
   * @param {Object<string, string>} params The route parameters.
   * @param {AbstractController} controllerInstance
   * @param {ControllerDecorator} decoratedController
   * @param {React.Component} viewInstance
   * @returns {ManagedPage}
   */
  _constructManagedPageValue(
    controller,
    view,
    options,
    params,
    controllerInstance,
    decoratedController,
    viewInstance
  ) {
    return {
      controller,
      controllerInstance,
      decoratedController,
      view,
      viewInstance,
      options,
      params,
      state: {
        activated: false
      }
    };
  }

  /**
   * Creates a cloned version of currently managed page and stores it in
   * a helper property.
   * Snapshot is used in manager handlers to easily determine differences
   * between the current and the previous state.
   *
   * @protected
   * @returns {ManagedPage}
   */
  _storeManagedPageSnapshot() {
    this._previousManagedPage = Object.assign({}, this._managedPage);

    return this._previousManagedPage;
  }

  /**
   * Clear value from managed page.
   *
   * @protected
   */
  _clearManagedPageValue() {
    this._managedPage = {
      controller: null,
      controllerInstance: null,
      decoratedController: null,
      view: null,
      viewInstance: null,
      options: null,
      params: null,
      state: {
        activated: false
      }
    };
  }

  /**
   * Removes properties we do not want to propagate outside of the page manager
   *
   * @protected
   * @param {ManagedPage} value The managed page object to strip down
   * @returns {{
   *            controller: ?(string|function(new: Controller)),
   *            view: ?React.Component,
   *            options: ?RouteOptions,
   *            params: ?Object<string, string>
   *          }}
   */
  _stripManagedPageValueForPublic(value) {
    const { controller, view, options, params } = value;

    return { controller, view, options, params };
  }

  /**
   * Set page state manager to extension which has restricted rights to set
   * global state.
   *
   * @param {ima.extension.Extension} extension
   * @param {Object<string, *>} extensionState
   */
  _setRestrictedPageStateManager(extension, extensionState) {
    let stateKeys = Object.keys(extensionState);
    let allowedKey = extension.getAllowedStateKeys();
    let allAllowedStateKeys = stateKeys.concat(allowedKey);

    let pageFactory = this._pageFactory;
    let decoratedPageStateManager = pageFactory.decoratePageStateManager(
      this._pageStateManager,
      allAllowedStateKeys
    );

    extension.setPageStateManager(decoratedPageStateManager);
  }

  /**
   * Initialize page source so call init method on controller and his
   * extensions.
   *
   * @protected
   */
  _initPageSource() {
    this._initController();
    this._initExtensions();
  }

  /**
   * Initializes managed instance of controller with the provided parameters.
   *
   * @protected
   */
  _initController() {
    let controller = this._managedPage.controllerInstance;

    controller.setRouteParams(this._managedPage.params);
    controller.init();
  }

  /**
   * Initialize extensions for managed instance of controller with the
   * provided parameters.
   *
   * @protected
   */
  _initExtensions() {
    let controller = this._managedPage.controllerInstance;

    for (let extension of controller.getExtensions()) {
      extension.setRouteParams(this._managedPage.params);
      extension.init();
    }
  }

  /**
   * Clears partialState of extensions for managed instance of controller.
   *
   * @protected
   */
  _clearPartialState() {
    const controller = this._managedPage.controllerInstance;

    for (let extension of controller.getExtensions()) {
      extension.clearPartialState();
    }
  }

  /**
   * Load page source so call load method on controller and his extensions.
   * Merge loaded state and render it.
   *
   * @protected
   * @return {Object<string, (Promise<*>|*)>}
   */
  _loadPageSource() {
    let controllerState = this._getLoadedControllerState();
    let extensionsState = this._getLoadedExtensionsState(controllerState);
    let loadedPageState = Object.assign({}, extensionsState, controllerState);

    return this._pageRenderer
      .mount(
        this._managedPage.decoratedController,
        this._managedPage.view,
        loadedPageState,
        this._managedPage.options
      )
      .then(response => {
        this._clearPartialState();
        this._runPostManageHandlers();

        return response;
      });
  }

  /**
   * Load controller state from managed instance of controller.
   *
   * @protected
   * @return {Object<string, (Promise<*>|*)>}
   */
  _getLoadedControllerState() {
    let controller = this._managedPage.controllerInstance;
    let controllerState = controller.load();

    controller.setPageStateManager(this._pageStateManager);

    return controllerState;
  }

  /**
   * Load extensions state from managed instance of controller.
   *
   * @protected
   * @param {Object<string, *>} controllerState
   * @return {Object<string, (Promise<*>|*)>}
   */
  _getLoadedExtensionsState(controllerState) {
    const controller = this._managedPage.controllerInstance;
    let extensionsState = Object.assign({}, controllerState);

    for (let extension of controller.getExtensions()) {
      extension.setPartialState(extensionsState);
      const extensionState = extension.load();

      this._setRestrictedPageStateManager(extension, extensionState);

      Object.assign(extensionsState, extensionState);
    }

    return extensionsState;
  }

  /**
   * Activate page source so call activate method on controller and his
   * extensions.
   *
   * @protected
   */
  _activatePageSource() {
    let controller = this._managedPage.controllerInstance;
    let isNotActivated = !this._managedPage.state.activated;

    if (controller && isNotActivated) {
      this._activateController();
      this._activateExtensions();
      this._managedPage.state.activated = true;
    }
  }

  /**
   * Activate managed instance of controller.
   *
   * @protected
   */
  _activateController() {
    let controller = this._managedPage.controllerInstance;

    controller.activate();
  }

  /**
   * Activate extensions for managed instance of controller.
   *
   * @protected
   */
  _activateExtensions() {
    let controller = this._managedPage.controllerInstance;

    for (let extension of controller.getExtensions()) {
      extension.activate();
    }
  }

  /**
   * Update page source so call update method on controller and his
   * extensions. Merge updated state and render it.
   *
   * @protected
   * @return {Promise<{status: number, content: ?string}>}
   */
  _updatePageSource() {
    let updatedControllerState = this._getUpdatedControllerState();
    let updatedExtensionState = this._getUpdatedExtensionsState(
      updatedControllerState
    );
    let updatedPageState = Object.assign(
      {},
      updatedExtensionState,
      updatedControllerState
    );

    return this._pageRenderer
      .update(this._managedPage.decoratedController, updatedPageState)
      .then(response => {
        this._clearPartialState();
        this._runPostManageHandlers();

        return response;
      });
  }

  /**
   * Return updated controller state for current page controller.
   *
   * @protected
   * @return {Object<string, (Promise<*>|*)>}
   */
  _getUpdatedControllerState() {
    let controller = this._managedPage.controllerInstance;
    let lastRouteParams = controller.getRouteParams();

    controller.setRouteParams(this._managedPage.params);

    return controller.update(lastRouteParams);
  }

  /**
   * Return updated extensions state for current page controller.
   *
   * @protected
   * @param {Object<string, *>} controllerState
   * @return {Object<string, (Promise|*)>}
   */
  _getUpdatedExtensionsState(controllerState) {
    const controller = this._managedPage.controllerInstance;
    let extensionsState = Object.assign({}, controllerState);

    for (let extension of controller.getExtensions()) {
      const lastRouteParams = extension.getRouteParams();
      extension.setRouteParams(this._managedPage.params);
      extension.setPartialState(extensionsState);
      const extensionState = extension.update(lastRouteParams);

      this._setRestrictedPageStateManager(extension, extensionState);

      Object.assign(extensionsState, extensionState);
    }

    return extensionsState;
  }

  /**
   * Deactivate page source so call deactivate method on controller and his
   * extensions.
   *
   * @protected
   */
  _deactivatePageSource() {
    let controller = this._managedPage.controllerInstance;
    let isActivated = this._managedPage.state.activated;

    if (controller && isActivated) {
      this._deactivateExtensions();
      this._deactivateController();
    }
  }

  /**
   * Deactivate last managed instance of controller only If controller was
   * activated.
   *
   * @protected
   */
  _deactivateController() {
    let controller = this._managedPage.controllerInstance;

    controller.deactivate();
  }

  /**
   * Deactivate extensions for last managed instance of controller only if
   * they were activated.
   *
   * @protected
   */
  _deactivateExtensions() {
    let controller = this._managedPage.controllerInstance;

    for (let extension of controller.getExtensions()) {
      extension.deactivate();
    }
  }

  /**
   * Destroy page source so call destroy method on controller and his
   * extensions.
   *
   * @protected
   */
  _destroyPageSource() {
    let controller = this._managedPage.controllerInstance;

    if (controller) {
      this._destroyExtensions();
      this._destroyController();
    }
  }

  /**
   * Destroy last managed instance of controller.
   *
   * @protected
   */
  _destroyController() {
    let controller = this._managedPage.controllerInstance;

    controller.destroy();
    controller.setPageStateManager(null);
  }

  /**
   * Destroy extensions for last managed instance of controller.
   *
   * @protected
   */
  _destroyExtensions() {
    let controller = this._managedPage.controllerInstance;

    for (let extension of controller.getExtensions()) {
      extension.destroy();
      extension.setPageStateManager(null);
    }
  }

  /**
   * The method clear state on current renderred component to DOM.
   *
   * @param {RouteOptions} options The current route options.
   */
  _clearComponentState(options) {
    let managedOptions = this._managedPage.options;

    if (
      managedOptions &&
      managedOptions.documentView === options.documentView &&
      managedOptions.managedRootView === options.managedRootView &&
      managedOptions.viewAdapter === options.viewAdapter
    ) {
      this._pageRenderer.clearState();
    } else {
      this._pageRenderer.unmount();
    }
  }

  /**
   * On change event handler set state to view.
   *
   * @param {Object<string, *>} state
   */
  _onChangeStateHandler(state) {
    let controller = this._managedPage.controllerInstance;

    if (controller) {
      this._pageRenderer.setState(state);
    }
  }

  /**
   * Return true if manager has to update last managed controller and view.
   *
   * @protected
   * @param {string|function} controller
   * @param {string|function} view
   * @param {RouteOptions} options
   * @return {boolean}
   */
  _hasOnlyUpdate(controller, view, options) {
    if (options.onlyUpdate instanceof Function) {
      return options.onlyUpdate(
        this._managedPage.controller,
        this._managedPage.view
      );
    }

    return (
      options.onlyUpdate &&
      this._managedPage.controller === controller &&
      this._managedPage.view === view
    );
  }

  /**
   *
   *
   * @protected
   * @param {ManagedPage} newManagedPage
   */
  _runPreManageHandlers(newManagedPage) {
    // TODO implement me!
  }

  /**
   *
   *
   * @protected
   */
  _runPostManageHandlers() {
    // TODO implement me!
  }
}
