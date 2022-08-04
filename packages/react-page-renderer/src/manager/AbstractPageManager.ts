import { AbstractRoute, Controller, ControllerDecorator, Extension } from '@ima/core';

import AbstractPageRenderer from '../renderer/AbstractPageRenderer';
import ManagedPage from './ManagedPage';
import PageFactory from '../PageFactory';
import PageHandlerInterface from '../handler/PageHandlerInterface';
import PageManagerInterface from './PageManagerInterface';
import PageStateManager from '../state/PageStateManager';
import RouteOptions from './RouteOptions';
import PageHandlerAction from '../handler/PageHandlerAction';
import { ComponentType, ReactElement } from 'react';

/**
 * Page manager for controller.
 */
export default abstract class AbstractPageManager implements PageManagerInterface {
  protected _pageFactory: PageFactory;
  protected _pageRenderer: AbstractPageRenderer;
  protected _pageStateManager: PageStateManager;
  protected _pageHandlerRegistry: PageHandlerInterface;
  protected _managedPage: ManagedPage;
  protected _previousManagedPage: ManagedPage;


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
    pageRenderer: AbstractPageRenderer,
    pageStateManager: PageStateManager,
    pageHandlerRegistry: PageHandlerInterface
  ) {
    /**
     * Factory used by the page manager to create instances of the
     * controller for the current route, and decorate the controllers and
     * page state managers.
     */
    this._pageFactory = pageFactory;

    /**
     * The current renderer of the page.
     */
    this._pageRenderer = pageRenderer;

    /**
     * The current page state manager.
     */
    this._pageStateManager = pageStateManager;

    /**
     * A registry that holds a list of pre-manage and post-manage handlers.
     */
    this._pageHandlerRegistry = pageHandlerRegistry;

    /**
     * Details of the currently managed page.
     */
    this._managedPage = {} as ManagedPage;

    /**
     * Snapshot of the previously managed page before it was replaced with
     * a new one
     */
    this._previousManagedPage = {} as ManagedPage;
  }

  /**
   * @inheritdoc
   */
  init() {
    this._clearManagedPageValue();
    this._pageStateManager.onChange = newState => {
      this._onChangeStateHandler(newState);
    };
    this._pageHandlerRegistry.init();
  }

  /**
   * @inheritdoc
   */
  async manage(route: AbstractRoute, options: RouteOptions, params: { [key: string]: string } = {}, action: PageHandlerAction = {} as PageHandlerAction) {
    const controller = route.getController();
    const view = route.getView();

    this._storeManagedPageSnapshot();

    if (this._hasOnlyUpdate(controller, view, options)) {
      this._managedPage.params = params;

      await this._runPreManageHandlers(this._managedPage, action);
      const response = await this._updatePageSource();
      await this._runPostManageHandlers(this._previousManagedPage, action);

      return response;
    }

    // Construct new managedPage value
    const pageFactory = this._pageFactory;
    const controllerInstance = pageFactory.createController(controller);
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
    await this._runPostManageHandlers(this._previousManagedPage, action);

    return response;
  }

  /**
   * @inheritdoc
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
    controller: string | Controller,
    view: string | ComponentType,
    route: AbstractRoute,
    options: RouteOptions,
    params: { [key: string]: string },
    controllerInstance: Controller,
    decoratedController: ControllerDecorator,
    viewInstance: ReactElement
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
    } as ManagedPage;
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
      state: {
        activated: false,
      },
    } as ManagedPage;
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
  _setRestrictedPageStateManager(extension: Extension, extensionState: { [key: string]: any }) {
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
   * For defined extension switches to pageStageManager and clears partial state
   * after extension state is loaded.
   */
  _switchToPageStateManagerAfterLoaded(extension: Extension, extensionState: { [key: string]: any }) {
    let stateValues = Object.values(extensionState);

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
    let controller = this._managedPage.controllerInstance;

    controller.setRouteParams(this._managedPage.params);
    await controller.init();
  }

  /**
   * Initialize extensions for managed instance of controller with the
   * provided parameters.
   */
  protected async _initExtensions() {
    let controller = this._managedPage.controllerInstance;

    for (let extension of controller.getExtensions()) {
      extension.setRouteParams(this._managedPage.params);
      await extension.init();
    }
  }

  /**
   * Iterates over extensions of current controller and switches each one to
   * pageStateManager and clears their partial state.
   */
  protected _switchToPageStateManager() {
    const controller = this._managedPage.controllerInstance;

    for (let extension of controller.getExtensions()) {
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
      this._managedPage.decoratedController,
      this._managedPage.viewInstance,
      loadedPageState,
      this._managedPage.options
    );

    return response;
  }

  /**
   * Load controller state from managed instance of controller.
   */
  protected async _getLoadedControllerState() {
    let controller = this._managedPage.controllerInstance;
    let controllerState = await controller.load();

    controller.setPageStateManager(this._pageStateManager);

    return controllerState;
  }

  /**
   * Load extensions state from managed instance of controller.
   */
  protected async _getLoadedExtensionsState(controllerState: { [key: string]: any }) {
    const controller = this._managedPage.controllerInstance;
    let extensionsState = Object.assign({}, controllerState);

    for (let extension of controller.getExtensions()) {
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
    let controller = this._managedPage.controllerInstance;
    let isNotActivated = !this._managedPage.state.activated;

    if (controller && isNotActivated) {
      await this._activateController();
      await this._activateExtensions();
      this._managedPage.state.activated = true;
    }
  }

  /**
   * Activate managed instance of controller.
   */
  protected async _activateController() {
    let controller = this._managedPage.controllerInstance;

    await controller.activate();
  }

  /**
   * Activate extensions for managed instance of controller.
   */
  protected async _activateExtensions() {
    let controller = this._managedPage.controllerInstance;

    for (let extension of controller.getExtensions()) {
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
      this._managedPage.decoratedController,
      this._managedPage.viewInstance,
      updatedPageState,
      this._managedPage.options
    );

    return response;
  }

  /**
   * Return updated controller state for current page controller.
   */
  protected _getUpdatedControllerState() {
    let controller = this._managedPage.controllerInstance;
    let lastRouteParams = controller.getRouteParams();

    controller.setRouteParams(this._managedPage.params);

    // TODO why is return value any??
    return controller.update(lastRouteParams);
  }

  /**
   * Return updated extensions state for current page controller.
   */
  protected async _getUpdatedExtensionsState(controllerState: { [key: string]: any }) {
    const controller = this._managedPage.controllerInstance;
    const extensionsState = Object.assign({}, controllerState);
    const extensionsPartialState = Object.assign(
      {},
      this._pageStateManager.getState(),
      controllerState
    );

    for (let extension of controller.getExtensions()) {
      const lastRouteParams = extension.getRouteParams();
      extension.setRouteParams(this._managedPage.params);
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
    let controller = this._managedPage.controllerInstance;
    let isActivated = this._managedPage.state.activated;

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
    let controller = this._managedPage.controllerInstance;

    await controller.deactivate();
  }

  /**
   * Deactivate extensions for last managed instance of controller only if
   * they were activated.
   */
  protected async _deactivateExtensions() {
    let controller = this._managedPage.controllerInstance;

    for (let extension of controller.getExtensions()) {
      await extension.deactivate();
    }
  }

  /**
   * Destroy page source so call destroy method on controller and his
   * extensions.
   */
  protected async _destroyPageSource() {
    let controller = this._managedPage.controllerInstance;

    if (controller) {
      await this._destroyExtensions();
      await this._destroyController();
    }
  }

  /**
   * Destroy last managed instance of controller.
   */
  protected async _destroyController() {
    let controller = this._managedPage.controllerInstance;

    await controller.destroy();
    controller.setPageStateManager(null);
  }

  /**
   * Destroy extensions for last managed instance of controller.
   */
  protected async _destroyExtensions() {
    let controller = this._managedPage.controllerInstance;

    for (let extension of controller.getExtensions()) {
      await extension.destroy();
      extension.setPageStateManager(null);
    }
  }

  /**
   * The method clear state on current renderred component to DOM.
   *
   * @param options The current route options.
   */
  _clearComponentState(options: RouteOptions) {
    let managedOptions = this._managedPage.options;

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
   * On change event handler set state to view.
   */
  _onChangeStateHandler(state: { [key: string]: any }) {
    let controller = this._managedPage.controllerInstance;

    if (controller) {
      this._pageRenderer.setState(state);
    }
  }

  /**
   * Return true if manager has to update last managed controller and view.
   */
   protected _hasOnlyUpdate(controller: string | Controller, view: string | ComponentType, options: RouteOptions) {
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
   * @param {ManagedPage} nextManagedPage
   * @param {{ type: string, event: Event}}
   * @returns {Promise<any>}
   */
  async _runPreManageHandlers(nextManagedPage, action) {
    return this._pageHandlerRegistry.handlePreManagedState(
      this._managedPage.controller
        ? this._stripManagedPageValueForPublic(this._managedPage)
        : null,
      this._stripManagedPageValueForPublic(nextManagedPage) || null,
      action
    );
  }

  /**
   *
   *
   * @protected
   * @param {ManagedPage} previousManagedPage
   * @param {{ type: string, event: Event}}
   * @returns {Promise<any>}
   */
  async _runPostManageHandlers(previousManagedPage, action) {
    return this._pageHandlerRegistry.handlePostManagedState(
      this._managedPage.controller
        ? this._stripManagedPageValueForPublic(this._managedPage)
        : null,
      this._stripManagedPageValueForPublic(previousManagedPage) || null,
      action
    );
  }
}
