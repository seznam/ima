import { PageManager, ManageArgs } from './PageManager';
import { AbstractController } from '../../controller/AbstractController';
import { Controller, IController } from '../../controller/Controller';
import { ControllerDecorator } from '../../controller/ControllerDecorator';
import { Extension } from '../../extension/Extension';
import { AbstractRoute } from '../../router/AbstractRoute';
import { RouteOptions } from '../../router/Router';
import { StringParameters, UnknownParameters } from '../../types';
import { PageHandlerRegistry } from '../handler/PageHandlerRegistry';
import { PageFactory } from '../PageFactory';
import { ManagedPage, PageAction } from '../PageTypes';
import { PageRenderer } from '../renderer/PageRenderer';
import { PageStateManager } from '../state/PageStateManager';

/**
 * Page manager for controller.
 */
export abstract class AbstractPageManager extends PageManager {
  /**
   * Snapshot of the previously managed page before it was replaced with
   * a new one
   */
  private _previousManagedPage: ManagedPage = {};
  /**
   * Factory used by the page manager to create instances of the
   * controller for the current route, and decorate the controllers and
   * page state managers.
   */
  private _pageFactory: PageFactory;

  /**
   * Details of the currently managed page.
   */
  protected _managedPage: ManagedPage = {};
  /**
   * The current renderer of the page.
   */
  protected _pageRenderer: PageRenderer;
  /**
   * The current page state manager.
   */
  protected _pageStateManager: PageStateManager;
  /**
   * A registry that holds a list of pre-manage and post-manage handlers.
   */
  protected _pageHandlerRegistry: PageHandlerRegistry;

  /**
   * Initializes the page manager.
   *
   * @param pageFactory Factory used by the page manager to
   *        create instances of the controller for the current route, and
   *        decorate the controllers and page state managers.
   * @param pageRenderer The current renderer of the page.
   * @param pageStateManager The current page state
   *        manager.
   * @param pageHandlerRegistry Instance of HandlerRegistry that
   *        holds a list of pre-manage and post-manage handlers.
   */
  constructor(
    pageFactory: PageFactory,
    pageRenderer: PageRenderer,
    pageStateManager: PageStateManager,
    pageHandlerRegistry: PageHandlerRegistry
  ) {
    super();

    this._pageFactory = pageFactory;

    this._pageRenderer = pageRenderer;

    this._pageStateManager = pageStateManager;

    this._pageHandlerRegistry = pageHandlerRegistry;
  }

  /**
   * @inheritDoc
   */
  init() {
    this._clearManagedPageValue();
    this._pageHandlerRegistry.init();
  }

  /**
   * @inheritDoc
   */
  async manage({
    route,
    controller,
    view,
    options,
    params = {},
    action = {},
  }: ManageArgs) {
    const previousManagedPage = this._storeManagedPageSnapshot();

    if (this._hasOnlyUpdate(controller, view, options)) {
      this._managedPage.params = params;

      await this._runPreManageHandlers(this._managedPage, action);
      const response = await this._updatePageSource();
      await this._runPostManageHandlers(
        this._managedPage,
        this._previousManagedPage,
        action
      );

      return response;
    }

    // Construct new managedPage value
    const pageFactory = this._pageFactory;
    const controllerInstance = pageFactory.createController(
      controller,
      options
    );
    const decoratedController =
      pageFactory.decorateController(controllerInstance);
    const viewInstance = pageFactory.createView(view);
    const newManagedPage = this._constructManagedPageValue(
      controller,
      view,
      route,
      options,
      params,
      controllerInstance,
      decoratedController,
      viewInstance
    );

    // Run pre-manage handlers before affecting anything
    await this._runPreManageHandlers(newManagedPage, action);

    // Deactivate the old instances and clearing state
    await this._deactivatePageSource();
    await this._destroyPageSource();

    this._pageStateManager.clear();
    this._clearComponentState(options);
    this._clearManagedPageValue();

    // Store the new managedPage object and initialize controllers and
    // extensions
    this._managedPage = newManagedPage;
    await this._initPageSource();

    const response = await this._loadPageSource();
    if (response && this._managedPage !== newManagedPage) {
      response.cancelled = true;
    }

    await this._runPostManageHandlers(
      newManagedPage,
      previousManagedPage,
      action
    );

    return response;
  }

  /**
   * @inheritDoc
   */
  async destroy() {
    this._pageHandlerRegistry.destroy();
    this._pageStateManager.onChange = undefined;

    await this._deactivatePageSource();
    await this._destroyPageSource();

    this._pageStateManager.clear();

    this._clearManagedPageValue();
  }

  protected _constructManagedPageValue(
    controller: IController,
    view: unknown,
    route: AbstractRoute,
    options: RouteOptions,
    params: UnknownParameters,
    controllerInstance: AbstractController,
    decoratedController: ControllerDecorator,
    viewInstance: unknown
  ) {
    return {
      controller,
      controllerInstance,
      decoratedController,
      view,
      viewInstance,
      route,
      options,
      params,
      state: {
        activated: false,
      },
    };
  }

  /**
   * Creates a cloned version of currently managed page and stores it in
   * a helper property.
   * Snapshot is used in manager handlers to easily determine differences
   * between the current and the previous state.
   */
  protected _storeManagedPageSnapshot() {
    this._previousManagedPage = Object.assign({}, this._managedPage);

    return this._previousManagedPage;
  }

  /**
   * Clear value from managed page.
   */
  protected _clearManagedPageValue() {
    this._managedPage = {
      controller: undefined,
      controllerInstance: undefined,
      decoratedController: undefined,
      view: undefined,
      viewInstance: undefined,
      route: undefined,
      options: undefined,
      params: undefined,
      state: {
        activated: false,
      },
    };
  }

  /**
   * Removes properties we do not want to propagate outside of the page manager
   *
   * @param value The managed page object to strip down
   */
  protected _stripManagedPageValueForPublic(value: ManagedPage) {
    const { controller, view, route, options, params } = value;

    return { controller, view, route, options, params };
  }

  /**
   * Set page state manager to extension which has restricted rights to set
   * global state.
   */
  _setRestrictedPageStateManager(
    extension: Extension,
    extensionState: UnknownParameters
  ) {
    const stateKeys = Object.keys(extensionState);
    const allowedKey = extension.getAllowedStateKeys();
    const allAllowedStateKeys = stateKeys.concat(allowedKey);

    const pageFactory = this._pageFactory;
    const decoratedPageStateManager = pageFactory.decoratePageStateManager(
      this._pageStateManager,
      allAllowedStateKeys
    );

    extension.setPageStateManager(decoratedPageStateManager);
  }

  /**
   * For defined extension switches to pageStageManager and clears partial state
   * after extension state is loaded.
   */
  _switchToPageStateManagerAfterLoaded(
    extension: Extension,
    extensionState: UnknownParameters
  ) {
    const stateValues = Object.values(extensionState);

    Promise.all(stateValues)
      .then(() => {
        extension.switchToStateManager();
        extension.clearPartialState();
      })
      .catch(() => {
        extension.clearPartialState();
      });
  }

  /**
   * Initialize page source so call init method on controller and his
   * extensions.
   */
  protected async _initPageSource() {
    await this._initController();
    await this._initExtensions();
  }

  /**
   * Initializes managed instance of controller with the provided parameters.
   */
  protected async _initController() {
    const controller = this._managedPage.controllerInstance;

    (controller as Controller).setRouteParams(
      this._managedPage.params as StringParameters
    );
    await (controller as Controller).init();
  }

  /**
   * Initialize extensions for managed instance of controller with the
   * provided parameters.
   */
  protected async _initExtensions() {
    const controller = this._managedPage.controllerInstance;
    for (const extension of (controller as Controller).getExtensions()) {
      extension.setRouteParams(this._managedPage.params as StringParameters);
      await extension.init();
    }
  }

  /**
   * Iterates over extensions of current controller and switches each one to
   * pageStateManager and clears their partial state.
   */
  protected _switchToPageStateManager() {
    const controller = this._managedPage.controllerInstance;

    for (const extension of (controller as Controller).getExtensions()) {
      extension.switchToStateManager();
      extension.clearPartialState();
    }
  }

  /**
   * Load page source so call load method on controller and his extensions.
   * Merge loaded state and render it.
   */
  protected async _loadPageSource() {
    const controllerState = await this._getLoadedControllerState();
    const extensionsState = await this._getLoadedExtensionsState(
      controllerState
    );
    const loadedPageState = Object.assign({}, extensionsState, controllerState);

    const response = await this._pageRenderer.mount(
      this._managedPage.decoratedController as ControllerDecorator,
      this._managedPage.viewInstance,
      loadedPageState,
      this._managedPage.options as RouteOptions
    );

    return response;
  }

  /**
   * Load controller state from managed instance of controller.
   */
  protected async _getLoadedControllerState() {
    const controller = this._managedPage.controllerInstance;
    const controllerState = await (controller as Controller).load();

    (controller as Controller).setPageStateManager(this._pageStateManager);

    return controllerState;
  }

  /**
   * Load extensions state from managed instance of controller.
   */
  protected async _getLoadedExtensionsState(
    controllerState?: UnknownParameters
  ) {
    const controller = this._managedPage.controllerInstance;
    const extensionsState = Object.assign({}, controllerState);

    for (const extension of (controller as Controller).getExtensions()) {
      extension.setPartialState(extensionsState);
      extension.switchToPartialState();
      const extensionState = await extension.load();

      this._switchToPageStateManagerAfterLoaded(extension, extensionState);
      this._setRestrictedPageStateManager(extension, extensionState);

      Object.assign(extensionsState, extensionState);
    }

    return extensionsState;
  }

  /**
   * Activate page source so call activate method on controller and his
   * extensions.
   */
  protected async _activatePageSource() {
    const controller = this._managedPage.controllerInstance;
    const isNotActivated = !(this._managedPage.state as UnknownParameters)
      .activated;

    if (controller && isNotActivated) {
      await this._activateController();
      await this._activateExtensions();
      (this._managedPage.state as UnknownParameters).activated = true;
    }
  }

  /**
   * Activate managed instance of controller.
   */
  protected async _activateController() {
    const controller = this._managedPage.controllerInstance;

    await (controller as Controller).activate();
  }

  /**
   * Activate extensions for managed instance of controller.
   */
  protected async _activateExtensions() {
    const controller = this._managedPage.controllerInstance;

    for (const extension of (controller as Controller).getExtensions()) {
      await extension.activate();
    }
  }

  /**
   * Update page source so call update method on controller and his
   * extensions. Merge updated state and render it.
   */
  protected async _updatePageSource() {
    const updatedControllerState = await this._getUpdatedControllerState();
    const updatedExtensionState = await this._getUpdatedExtensionsState(
      updatedControllerState
    );
    const updatedPageState = Object.assign(
      {},
      updatedExtensionState,
      updatedControllerState
    );

    const response = await this._pageRenderer.update(
      this._managedPage.decoratedController as ControllerDecorator,
      this._managedPage.viewInstance,
      updatedPageState,
      this._managedPage.options as RouteOptions
    );

    return response;
  }

  /**
   * Return updated controller state for current page controller.
   */
  protected _getUpdatedControllerState() {
    const controller = this._managedPage.controllerInstance;
    const lastRouteParams = (controller as Controller).getRouteParams();

    (controller as Controller).setRouteParams(
      this._managedPage.params as UnknownParameters
    );

    return (controller as Controller).update(lastRouteParams);
  }

  /**
   * Return updated extensions state for current page controller.
   */
  protected async _getUpdatedExtensionsState(
    controllerState?: UnknownParameters
  ) {
    const controller = this._managedPage.controllerInstance;
    const extensionsState = Object.assign({}, controllerState);
    const extensionsPartialState = Object.assign(
      {},
      this._pageStateManager.getState(),
      controllerState
    );

    for (const extension of (controller as Controller).getExtensions()) {
      const lastRouteParams = extension.getRouteParams();
      extension.setRouteParams(this._managedPage.params as UnknownParameters);
      extension.setPartialState(extensionsPartialState);
      extension.switchToPartialState();

      const extensionReturnedState = await extension.update(lastRouteParams);

      this._switchToPageStateManagerAfterLoaded(
        extension,
        extensionReturnedState
      );
      this._setRestrictedPageStateManager(extension, extensionReturnedState);

      Object.assign(extensionsState, extensionReturnedState);
      Object.assign(extensionsPartialState, extensionReturnedState);
    }

    return extensionsState;
  }

  /**
   * Deactivate page source so call deactivate method on controller and his
   * extensions.
   */
  protected async _deactivatePageSource() {
    const controller = this._managedPage.controllerInstance;
    const isActivated = (this._managedPage.state as UnknownParameters)
      .activated;

    if (controller && isActivated) {
      await this._deactivateExtensions();
      await this._deactivateController();
    }
  }

  /**
   * Deactivate last managed instance of controller only If controller was
   * activated.
   */
  protected async _deactivateController() {
    const controller = this._managedPage.controllerInstance;

    await (controller as Controller).deactivate();
  }

  /**
   * Deactivate extensions for last managed instance of controller only if
   * they were activated.

   */
  protected async _deactivateExtensions() {
    const controller = this._managedPage.controllerInstance;

    for (const extension of (controller as Controller).getExtensions()) {
      await extension.deactivate();
    }
  }

  /**
   * Destroy page source so call destroy method on controller and his
   * extensions.
   */
  protected async _destroyPageSource() {
    const controller = this._managedPage.controllerInstance;

    if (controller) {
      await this._destroyExtensions();
      await this._destroyController();
    }
  }

  /**
   * Destroy last managed instance of controller.
   */
  protected async _destroyController() {
    const controller = this._managedPage.controllerInstance;

    await (controller as Controller).destroy();
    (controller as Controller).setPageStateManager();
  }

  /**
   * Destroy extensions for last managed instance of controller.
   *
   * @protected
   * @return {Promise<undefined>}
   */
  protected async _destroyExtensions() {
    const controller = this._managedPage.controllerInstance;

    for (const extension of (controller as Controller).getExtensions()) {
      await extension.destroy();
      extension.setPageStateManager();
    }
  }

  /**
   * The method clear state on current rendered component to DOM.
   *
   * @param options The current route options.
   */
  _clearComponentState(options: RouteOptions) {
    const managedOptions = this._managedPage.options;

    if (
      !managedOptions ||
      managedOptions.documentView !== options.documentView ||
      managedOptions.managedRootView !== options.managedRootView ||
      managedOptions.viewAdapter !== options.viewAdapter
    ) {
      this._pageRenderer.unmount();
    }
  }

  /**
   * Return true if manager has to update last managed controller and view.
   */
  protected _hasOnlyUpdate(
    controller: IController,
    view: unknown,
    options: RouteOptions
  ) {
    if (typeof options.onlyUpdate === 'function') {
      return options.onlyUpdate(
        this._managedPage.controller as Controller,
        this._managedPage.view
      );
    }

    return !!(
      options.onlyUpdate &&
      this._managedPage.controller === controller &&
      this._managedPage.view === view
    );
  }

  protected async _runPreManageHandlers(
    nextManagedPage: ManagedPage,
    action: PageAction
  ) {
    return this._pageHandlerRegistry.handlePreManagedState(
      this._managedPage.controller
        ? this._stripManagedPageValueForPublic(this._managedPage)
        : null,
      this._stripManagedPageValueForPublic(nextManagedPage) || null,
      action
    );
  }

  protected async _runPostManageHandlers(
    managedPage: ManagedPage,
    previousManagedPage: ManagedPage,
    action: PageAction
  ) {
    return this._pageHandlerRegistry.handlePostManagedState(
      managedPage.controller
        ? this._stripManagedPageValueForPublic(managedPage)
        : null,
      this._stripManagedPageValueForPublic(previousManagedPage) || null,
      action
    );
  }
}
