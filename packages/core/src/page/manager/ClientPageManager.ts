/* @if server **
export class ClientPageManager {};
/* @else */
import { AbstractPageManager } from './AbstractPageManager';
import { ManageArgs } from './PageManager';
import { Dependencies } from '../..';
import { Controller } from '../../controller/Controller';
import { Dispatcher } from '../../event/Dispatcher';
import { EventBus, EventBusEventHandler } from '../../event/EventBus';
import { Extension } from '../../extension/Extension';
import { UnknownParameters } from '../../types';
import { Window as ImaWindow } from '../../window/Window';
import { PageHandlerRegistry } from '../handler/PageHandlerRegistry';
import { PageFactory } from '../PageFactory';
import { PageRenderer } from '../renderer/PageRenderer';
import { PageStateManager } from '../state/PageStateManager';

/**
 * Page manager for controller on the client side.
 */
export class ClientPageManager extends AbstractPageManager {
  /**
   * The utility for manipulating the global context and global
   * client-side-specific APIs.
   */
  private _window: ImaWindow;
  /**
   * The event bus for dispatching and listening for custom IMA events
   * propagated through the DOM.
   */
  private _eventBus: EventBus;
  /**
   * Event listener for the custom DOM events used by the event bus,
   * bound to this instance.
   */
  private _boundOnCustomEventHandler = (event: CustomEvent) => {
    this._onCustomEventHandler(event);
  };

  static get $dependencies(): Dependencies {
    return [
      PageFactory,
      PageRenderer,
      PageStateManager,
      '$PageHandlerRegistry',
      Dispatcher,
      ImaWindow,
      EventBus,
    ];
  }

  /**
   * Initializes the client-side page manager.
   *
   * @param pageFactory Factory used by the page manager to
   *        create instances of the controller for the current route, and
   *        decorate the controllers and page state managers.
   * @param pageRenderer The current renderer of the page.
   * @param stateManager The current page state manager.
   * @param handlerRegistry Instance of HandlerRegistry that
   *        holds a list of pre-manage and post-manage handlers.
   * @param window The utility for manipulating the global context
   *        and global client-side-specific APIs.
   * @param dispatcher IMA Dispatcher.
   * @param eventBus The event bus for dispatching and listening
   *        for custom IMA events propagated through the DOM.
   */
  constructor(
    pageFactory: PageFactory,
    pageRenderer: PageRenderer,
    pageStateManager: PageStateManager,
    handlerRegistry: PageHandlerRegistry,
    dispatcher: Dispatcher,
    window: ImaWindow,
    eventBus: EventBus
  ) {
    super(
      pageFactory,
      pageRenderer,
      pageStateManager,
      handlerRegistry,
      dispatcher
    );

    this._window = window;

    this._eventBus = eventBus;
  }

  /**
   * @inheritDoc
   */
  init() {
    super.init();
    this._pageStateManager.onChange = newState => {
      this._onChangeStateHandler(newState);
    };
    this._eventBus.listenAll(
      this._window.getWindow() as Window,
      this._boundOnCustomEventHandler
    );
  }

  /**
   * @inheritDoc
   */
  async manage({ route, options, params = {}, action = {} }: ManageArgs) {
    const response = await super.manage({
      route,
      options,
      params,
      action,
    });

    await this._activatePageSource();

    return response;
  }

  /**
   * @inheritDoc
   */
  async destroy() {
    await super.destroy();

    this._eventBus.unlistenAll(
      this._window.getWindow() as Window,
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
   * @param event The encountered event bus DOM event.
   */
  _onCustomEventHandler(event: CustomEvent) {
    const { prefix, method, data, eventName } = this._parseCustomEvent(event);
    const controllerInstance = this._managedPage.controllerInstance;

    if (controllerInstance) {
      let handled = this._handleEventWithController(prefix, method, data);

      if (!handled) {
        handled = this._handleEventWithExtensions(prefix, method, data);
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
   * @param event The encountered event bus custom DOM event.
   * @return The event's
   *         details.
   */
  _parseCustomEvent(event: CustomEvent) {
    const eventName: string = event.detail.eventName;
    const splitEventName = eventName.split('.');

    let method = splitEventName.pop() as string;
    method = 'on' + method.charAt(0).toUpperCase() + eventName.slice(1);

    const prefix = splitEventName.pop() ?? '';

    const data = event.detail.data;

    return { prefix, method, data, eventName };
  }

  /**
   * Attempts to handle the currently processed event bus custom DOM event
   * using the current controller. The method returns `true` if the
   * event is handled by the controller.
   *
   * @param method The name of the method the current controller
   *        should use to process the currently processed event bus custom
   *        DOM event.
   * @param data The custom event's data.
   * @return `true` if the event has been handled by the
   *         controller, `false` if the controller does not have a
   *         method for processing the event.
   */
  _handleEventWithController(
    prefix: string,
    method: string,
    data: UnknownParameters
  ) {
    const controllerInstance = this._managedPage
      .controllerInstance as Controller;

    if (
      ((controllerInstance?.constructor as typeof Controller).$name ?? '') ===
        prefix &&
      typeof controllerInstance[method] === 'function'
    ) {
      ((controllerInstance as Controller)[method] as EventBusEventHandler)(
        data
      );

      return true;
    }

    return false;
  }

  /**
   * Attempts to handle the currently processed event bus custom DOM event
   * using the registered extensions of the current controller. The method
   * returns `true` if the event is handled by the controller.
   *
   * @param method The name of the method the current controller
   *        should use to process the currently processed event bus custom
   *        DOM event.
   * @param data The custom event's data.
   * @return `true` if the event has been handled by one of
   *         the controller's extensions, `false` if none of the
   *         controller's extensions has a method for processing the event.
   */
  _handleEventWithExtensions(
    prefix: string,
    method: string,
    data: UnknownParameters
  ) {
    const controllerInstance = this._managedPage.controllerInstance;
    const extensions = (controllerInstance as Controller).getExtensions();

    for (const extension of extensions) {
      if (
        ((extension.constructor as typeof Extension).$name ?? '') === prefix &&
        typeof extension[method] === 'function'
      ) {
        (extension[method] as EventBusEventHandler)(data);

        return true;
      }
    }

    return false;
  }

  /**
   * On change event handler set state to view.
   */
  _onChangeStateHandler(state: UnknownParameters) {
    const controller = this._managedPage.controllerInstance;

    if (controller) {
      this._pageRenderer.setState(state);
    }
  }
}
// @endif
