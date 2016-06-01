import ns from 'ima/namespace';
import IMAError from 'ima/error/GenericError';
import PageManagerInterface from 'ima/page/manager/PageManager';

ns.namespace('ima.page.manager');

/**
 * Page manager for controller.
 *
 * @class AbstractPageManager
 * @implements ima.page.manager.PageManager
 * @namespace ima.page.manager
 * @module ima
 * @submodule ima.page
 */
export default class AbstractPageManager extends PageManagerInterface {

	/**
	 * Initializes the page manager.
	 *
	 * @method constructor
	 * @constructor
	 * @param {ima.page.PageFactory} pageFactory
	 * @param {ima.page.Renderer.PageRenderer} pageRenderer
	 * @param {ima.page.State.PageStateManager} pageStateManager
	 */
	constructor(pageFactory, pageRenderer, pageStateManager) {
		super();

		/**
		 * @protected
		 * @property _pageFactory
		 * @type {ima.page.Factory}
		 * @default pageFactory
		 */
		this._pageFactory = pageFactory;

		/**
		 * @protected
		 * @property _pageRenderer
		 * @type {ima.page.renderer.AbstractPageRenderer}
		 * @default pageRenderer
		 */
		this._pageRenderer = pageRenderer;

		/**
		 * @protected
		 * @property _pageStateManager
		 * @type {ima.page.state.PageStateManager}
		 * @default pageStateManager
		 */
		this._pageStateManager = pageStateManager;

		/**
		 * @protected
		 * @property _managedPage
		 * @type {Object<string, *>}
		 */
		this._managedPage = {};
	}

	/**
	 * @inheritdoc
	 * @method init
	 */
	init() {
		this._clearManagedPageValue();
		this._pageStateManager.onChange = (newState) => {
			this._onChangeStateHandler(newState);
		};
	}

	/**
	 * @inheritdoc
	 * @method manage
	 */
	manage(controller, view, options, params = {}) {
		this._preManage(options);

		if (this._hasOnlyUpdate(controller, view, options)) {
			this._managedPage.params = params;

			return this._updatePageSource();
		}

		let pageFactory = this._pageFactory;
		var controllerInstance = pageFactory.createController(controller);
		var decoratedController = pageFactory.decorateController(
			controllerInstance
		);
		var viewInstance = pageFactory.createView(view);

		this._deactivatePageSource();
		this._destroyPageSource();

		this._storeManagedPageValue(
			controller,
			view,
			options,
			params,
			controllerInstance,
			decoratedController,
			viewInstance
		);

		this._initPageSource();

		return this._loadPageSource();
	}

	/**
	 * @abstract
	 * @inheritdoc
	 * @method scrollTo
	 */
	scrollTo(x = 0, y = 0) {
		throw new IMAError('The scrollTo() method is abstract and must be ' +
				'overridden.');
	}

	/**
	 * @inheritdoc
	 * @method destroy
	 */
	destroy() {
		this._pageStateManager.onChange = null;

		this._deactivatePageSource();
		this._destroyPageSource();

		this._clearManagedPageValue();
	}

	/**
	 * @protected
	 * @method _storeManagedPageValue
	 * @param {(string|function)} controller
	 * @param {(string|function)} view
	 * @param {{onlyUpdate: boolean, autoScroll: boolean, serveSPA: boolean}} options
	 * @param {Object<string, string>} params The route parameters.
	 * @param {ima.controller.AbstractController} controllerInstance
	 * @param {ima.controller.ControllerDecorator} decoratedController
	 * @param {React.Component} viewInstance
	 */
	_storeManagedPageValue(controller, view, options, params,
			controllerInstance, decoratedController, viewInstance) {
		this._managedPage = {
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
	 * Clear value from managed page.
	 *
	 * @protected
	 * @method _clearManagedPageValue
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
	 * Set page state manager to extension which has restricted rights to set
	 * global state.
	 *
	 * @private
	 * @method _setRestrictedPageStateManager
	 * @param {ima.extension.Extension} extension
	 * @param {Object<string, *>} extensionState
	 */
	_setRestrictedPageStateManager(extension, extensionState) {
		var stateKeys = Object.keys(extensionState);
		let allowedKey = extension.getAllowedStateKeys();
		var allAllowedStateKeys = stateKeys.concat(allowedKey);

		var pageFactory = this._pageFactory;
		var decoratedPageStateManager = pageFactory.decoratePageStateManager(
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
	 * @method _initPageSource
	 */
	_initPageSource() {
		this._initController();
		this._initExtensions();
	}

	/**
	 * Initializes managed instance of controller with the provided parameters.
	 *
	 * @protected
	 * @method _initController
	 */
	_initController() {
		var controller = this._managedPage.controllerInstance;

		controller.setRouteParams(this._managedPage.params);
		controller.init();
	}

	/**
	 * Initialize extensions for managed instance of controller with the
	 * provided parameters.
	 *
	 * @protected
	 * @method _initExtensions
	 */
	_initExtensions() {
		var controller = this._managedPage.controllerInstance;

		for (var extension of controller.getExtensions()) {
			extension.setRouteParams(this._managedPage.params);
			extension.init();
		}
	}

	/**
	 * Load page source so call load method on controller and his extensions.
	 * Merge loaded state and render it.
	 *
	 * @protected
	 * @method _loadPageSource
	 * @return {Object<string, (Promise|*)>}
	 */
	_loadPageSource() {
		var controllerState = this._getLoadedControllerState();
		var extensionsState = this._getLoadedExtensionsState();
		var loadedPageState = Object.assign(
			{},
			extensionsState,
			controllerState
		);

		return (
			this._pageRenderer
				.mount(
					this._managedPage.decoratedController,
					this._managedPage.view,
					loadedPageState
				)
				.then((response) => {
					this._postManage(this._managedPage.options);

					return response;
				})
		);
	}

	/**
	 * Load controller state from managed instance of controller.
	 *
	 * @protected
	 * @method _getLoadedControllerState
	 * @return {Object<string, (Promise|*)>}
	 */
	_getLoadedControllerState() {
		var controller = this._managedPage.controllerInstance;
		var controllerState = controller.load();

		controller.setPageStateManager(this._pageStateManager);

		return controllerState;
	}

	/**
	 * Load extensions state from managed instance of controller.
	 *
	 * @protected
	 * @method _getLoadedExtensionsState
	 * @return {Object<string, (Promise|*)>}
	 */
	_getLoadedExtensionsState() {
		var controller = this._managedPage.controllerInstance;
		var extensionsState = {};

		for (var extension of controller.getExtensions()) {
			var extensionState = extension.load();

			this._setRestrictedPageStateManager(extension, extensionState);
			Object.assign(extensionsState, extensionState);
		}

		return extensionsState;
	}

	/**
	 * Activate page source so call activate method on controller and his extensions.
	 *
	 * @protected
	 * @method _activatePageSource
	 */
	_activatePageSource() {
		var controller = this._managedPage.controllerInstance;
		var isNotActivated = !this._managedPage.state.activated;

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
	 * @method _activateController
	 */
	_activateController() {
		var controller = this._managedPage.controllerInstance;

		controller.activate();
	}

	/**
	 * Activate extensions for managed instance of controller.
	 *
	 * @protected
	 * @method _activateExtensions
	 */
	_activateExtensions() {
		var controller = this._managedPage.controllerInstance;

		for (var extension of controller.getExtensions()) {
			extension.activate();
		}
	}

	/**
	 * Update page source so call update method on controller and his extensions.
	 * Merge updated state and render it.
	 *
	 * @protected
	 * @method _updatePageSource
	 * @return {Promise}
	 */
	_updatePageSource() {
		var updatedControllerState = this._getUpdatedControllerState();
		var updatedExtensionState = this._getUpdatedExtensionsState();
		var updatedPageState = Object.assign(
			{},
			updatedExtensionState,
			updatedControllerState
		);

		return (
			this._pageRenderer
				.update(
					this._managedPage.decoratedController,
					updatedPageState
				)
				.then((response) => {
					this._postManage(this._managedPage.options);

					return response;
				})
		);
	}

	/**
	 * Return updated controller state for current page controller.
	 *
	 * @protected
	 * @method _getUpdatedControllerState
	 * @return {Promise}
	 */
	_getUpdatedControllerState() {
		var controller = this._managedPage.controllerInstance;
		var lastRouteParams = controller.getRouteParams();

		controller.setRouteParams(this._managedPage.params);

		return controller.update(lastRouteParams);
	}

	/**
	 * Return updated extensions state for current page controller.
	 *
	 * @protected
	 * @method _getUpdatedExtensionsState
	 * @return {Object<string, (Promise|*)>}
	 */
	_getUpdatedExtensionsState() {
		var controller = this._managedPage.controllerInstance;
		var extensionsState = {};

		for (var extension of controller.getExtensions()) {
			var lastRouteParams = extension.getRouteParams();
			var extensionState = extension.update(lastRouteParams);

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
	 * @method _deactivatePageSource
	 */
	_deactivatePageSource() {
		var controller = this._managedPage.controllerInstance;
		var isActivated = this._managedPage.state.activated;

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
	 * @method _deactivateController
	 */
	_deactivateController() {
		var controller = this._managedPage.controllerInstance;

		controller.deactivate();
	}

	/**
	 * Deactivate extensions for last managed instance of controller only if
	 * they were activated.
	 *
	 * @protected
	 * @method _deactivateExtensions
	 */
	_deactivateExtensions() {
		var controller = this._managedPage.controllerInstance;

		for (var extension of controller.getExtensions()) {
			extension.deactivate();
		}
	}

	/**
	 * Destroy page source so call destroy method on controller and his
	 * extensions.
	 *
	 * @protected
	 * @method _destroyPageSource
	 */
	_destroyPageSource() {
		var controller = this._managedPage.controllerInstance;

		if (controller) {
			this._destroyExtensions();
			this._destroyController();

			this._pageStateManager.clear();
			this._pageRenderer.unmount();
			this._clearManagedPageValue();
		}
	}

	/**
	 * Destroy last managed instance of controller.
	 *
	 * @protected
	 * @method _destroyController
	 */
	_destroyController() {
		var controller = this._managedPage.controllerInstance;

		controller.destroy();
		controller.setPageStateManager(null);
	}

	/**
	 * Destroy extensions for last managed instance of controller.
	 *
	 * @protected
	 * @method _destroyExtensions
	 */
	_destroyExtensions() {
		var controller = this._managedPage.controllerInstance;

		for (var extension of controller.getExtensions()) {
			extension.destroy();
			extension.setPageStateManager(null);
		}
	}

	/**
	 * On change event handler set state to view.
	 *
	 * @private
	 * @method _onChangeStateHandler
	 * @param {Object<string, *>} state
	 */
	_onChangeStateHandler(state) {
		var controller = this._managedPage.controllerInstance;

		if (controller) {
			this._pageRenderer.setState(state);
		}
	}

	/**
	 * Return true if manager has to update last managed controller and view.
	 *
	 * @protected
	 * @method _hasOnlyUpdate
	 * @param {string|function} controller
	 * @param {string|function} view
	 * @param {{onlyUpdate: (boolean|function), autoScroll: boolean}} options
	 * @return {boolean}
	 */
	_hasOnlyUpdate(controller, view, options) {
		if (options.onlyUpdate instanceof Function) {
			return options.onlyUpdate(
				this._managedPage.controller,
				this._managedPage.view
			);
		}

		return options.onlyUpdate &&
				this._managedPage.controller === controller &&
				this._managedPage.view === view;
	}

	/**
	 * Make defined instruction as scroll for current page options before than
	 * change page.
	 *
	 * @protected
	 * @method _preManage
	 * @param {{onlyUpdate: boolean, autoScroll: boolean, serveSPA: boolean}} options
	 */
	_preManage(options) {
		if (options.autoScroll) {
			this.scrollTo();
		}
	}

	/**
	 * Make defined instruction for current page options after that
	 * changed page.
	 *
	 * @protected
	 * @method _postManage
	 * @param {{onlyUpdate: boolean, autoScroll: boolean, serveSPA: boolean}} options
	 */
	_postManage(options) {}

}

ns.ima.page.manager.AbstractPageManager = AbstractPageManager;
