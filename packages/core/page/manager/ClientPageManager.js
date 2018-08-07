// @client-side

import AbstractPageManager from './AbstractPageManager';
import PageFactory from '../PageFactory';
import PageRenderer from '../renderer/PageRenderer';
import PageStateManager from '../state/PageStateManager';
import EventBus from '../../event/EventBus';
import Window from '../../window/Window';

/**
 * Page manager for controller on the client side.
 */
export default class ClientPageManager extends AbstractPageManager {
  static get $dependencies() {
    return [
      PageFactory,
      PageRenderer,
      PageStateManager,
      '$PAGE_MANAGER_HANDLERS',
      Window,
      EventBus
    ];
  }

  /**
   * Initializes the client-side page manager.
   *
   * @param {PageFactory} pageFactory Factory used by the page manager to
   *        create instances of the controller for the current route, and
   *        decorate the controllers and page state managers.
   * @param {PageRenderer} pageRenderer The current renderer of the page.
   * @param {PageStateManager} stateManager The current page state manager.
   * @param {Array<PageManagerHandler>} pageManagerHandlers List of handlers
   *        that will be called before and after managing a page life cycle.
   * @param {Window} window The utility for manipulating the global context
   *        and global client-side-specific APIs.
   * @param {EventBus} eventBus The event bus for dispatching and listening
   *        for custom IMA events propagated through the DOM.
   */
  constructor(
    pageFactory,
    pageRenderer,
    stateManager,
    pageManagerHandlers,
    window,
    eventBus
  ) {
    super(pageFactory, pageRenderer, stateManager, pageManagerHandlers);

    /**
     * The utility for manipulating the global context and global
     * client-side-specific APIs.
     *
     * @type {ima.window.Window}
     */
    this._window = window;

    /**
     * The event bus for dispatching and listening for custom IMA events
     * propagated through the DOM.
     *
     * @type {ima.event.EventBus}
     */
    this._eventBus = eventBus;

    /**
     * Event listener for the custom DOM events used by the event bus,
     * bound to this instance.
     *
     * @type {function(this: ClientPageManager, Event)}
     */
    this._boundOnCustomEventHandler = event => {
      this._onCustomEventHandler(event);
    };
  }

  /**
   * @inheritdoc
   */
  init() {
    super.init();
    this._eventBus.listenAll(
      this._window.getWindow(),
      this._boundOnCustomEventHandler
    );
  }

  /**
   * @inheritdoc
   */
  manage(controller, view, options, params = {}, action) {
    return super
      .manage(controller, view, options, params, action)
      .then(response => {
        this._activatePageSource();

        return response;
      });
  }

  /**
   * @inheritdoc
   */
  destroy() {
    super.destroy();

    this._eventBus.unlistenAll(
      this._window.getWindow(),
      this._boundOnCustomEventHandler
    );
  }

  /**
   * Custom DOM event handler.
   *
   * The handler invokes the event listener in the active controller, if such
   * listener is present. The name of the controller's listener method is
   * created by turning the first symbol of the event's name to upper case,
   * and then prefixing the result with the 'on' prefix.
   *
   * For example: for an event named 'toggle' the controller's listener
   * would be named 'onToggle'.
   *
   * The controller's listener will be invoked with the event's data as an
   * argument.
   *
   * @param {CustomEvent} event The encountered event bus DOM event.
   */
  _onCustomEventHandler(event) {
    let { method, data, eventName } = this._parseCustomEvent(event);
    let controllerInstance = this._managedPage.controllerInstance;

    if (controllerInstance) {
      let handled = this._handleEventWithController(method, data);

      if (!handled) {
        handled = this._handleEventWithExtensions(method, data);
      }

      if ($Debug) {
        if (!handled) {
          console.warn(
            `The active controller has no listener for ` +
              `the encountered event '${eventName}'. Check ` +
              `your event name for typos, or create an ` +
              `'${method}' event listener method on the ` +
              `active controller or add an event listener ` +
              `that stops the propagation of this event to ` +
              `an ancestor component of the component that ` +
              `fired this event.`
          );
        }
      }
    }
  }

  /**
   * Extracts the details of the provided event bus custom DOM event, along
   * with the expected name of the current controller's method for
   * intercepting the event.
   *
   * @param {CustomEvent} event The encountered event bus custom DOM event.
   * @return {{ method: string, data: *, eventName: string }} The event's
   *         details.
   */
  _parseCustomEvent(event) {
    let eventName = event.detail.eventName;
    let method = 'on' + eventName.charAt(0).toUpperCase() + eventName.slice(1);
    let data = event.detail.data;

    return { method, data, eventName };
  }

  /**
   * Attempts to handle the currently processed event bus custom DOM event
   * using the current controller. The method returns {@code true} if the
   * event is handled by the controller.
   *
   * @param {string} method The name of the method the current controller
   *        should use to process the currently processed event bus custom
   *        DOM event.
   * @param {Object<string, *>} data The custom event's data.
   * @return {boolean} {@code true} if the event has been handled by the
   *         controller, {@code false} if the controller does not have a
   *         method for processing the event.
   */
  _handleEventWithController(method, data) {
    let controllerInstance = this._managedPage.controllerInstance;

    if (typeof controllerInstance[method] === 'function') {
      controllerInstance[method](data);

      return true;
    }

    return false;
  }

  /**
   * Attempts to handle the currently processed event bus custom DOM event
   * using the registered extensions of the current controller. The method
   * returns {@code true} if the event is handled by the controller.
   *
   * @param {string} method The name of the method the current controller
   *        should use to process the currently processed event bus custom
   *        DOM event.
   * @param {Object<string, *>} data The custom event's data.
   * @return {boolean} {@code true} if the event has been handled by one of
   *         the controller's extensions, {@code false} if none of the
   *         controller's extensions has a method for processing the event.
   */
  _handleEventWithExtensions(method, data) {
    let controllerInstance = this._managedPage.controllerInstance;
    let extensions = controllerInstance.getExtensions();

    for (let extension of extensions) {
      if (typeof extension[method] === 'function') {
        extension[method](data);

        return true;
      }
    }

    return false;
  }

  /**
   * @inheritDoc
   */
  async _runPreManageHandlers(nextManagedPage, action) {
    await super._runPreManageHandlers(nextManagedPage, action);

    this._setAddressBar(action.url);
  }

  /**
   * Sets the provided URL to the browser's address bar by pushing a new
   * state to the history.
   *
   * The state object pushed to the history will be an object with the
   * following structure: {@code {url: string}}. The {@code url} field will
   * be set to the provided URL.
   *
   * @param {string} url The URL.
   */
  _setAddressBar(url) {
    let scroll = {
      x: 0,
      y: 0
    };
    let state = { url, scroll };

    this._window.pushState(state, null, url);
  }
}
