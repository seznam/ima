import EventBus, { Listener, NativeListener, Options } from './EventBus';
import GenericError from '../error/GenericError';
import Window from '../window/Window';

/**
 * Global name of IMA.js custom event.
 */
export const IMA_EVENT = '$IMA.CustomEvent';

/**
 * Helper for custom events.
 *
 * It offers public methods for firing custom events and two methods for
 * catching events (e.g. inside view components).
 */
export default class EventBusImpl extends EventBus {
  private _window: Window;
  /**
   * Map of listeners provided to the public API of this event bus to a
   * map of event targets to a map of event names to actual listeners
   * bound to the native API.
   *
   * The "listen all" event listeners are not registered in this map.
   */
  private _listeners: WeakMap<
    Listener,
    WeakMap<EventTarget, Map<string, NativeListener>>
  > = new WeakMap();
  /**
   * Map of event targets to listeners executed on all IMA.js event bus
   * events.
   */
  private _allListenersTargets: WeakMap<EventTarget, WeakMap<Listener, NativeListener>> = new WeakMap();

  static get $dependencies() {
    return [Window];
  }

  /**
   * Initializes the custom event helper.
   *
   * @param window The IMA window helper.
   */
  constructor(window: Window) {
    super();

    /**
     * The IMA window helper.
     */
    this._window = window;
  }

  /**
   * @inheritdoc
   */
  fire(
    eventTarget: EventTarget,
    eventName: string,
    data: unknown,
    options: Options = {}
  ) {
    const eventInitialization = {};
    const params = { detail: { eventName, data } };
    const defaultOptions = { bubbles: true, cancelable: true };
    Object.assign(eventInitialization, defaultOptions, options, params);

    const event = this._window.createCustomEvent(
      IMA_EVENT,
      eventInitialization
    );

    if (eventTarget && typeof eventTarget.dispatchEvent !== 'undefined') {
      eventTarget.dispatchEvent(event);
    } else {
      throw new GenericError(
        `ima.core.event.EventBusImpl.fire: The EventSource ` +
        `${eventTarget} is not defined or can not dispatch event ` +
        `'${eventName}' (data: ${data}).`,
        { eventTarget, eventName, data, eventInitialization }
      );
    }

    return this;
  }

  /**
   * @inheritdoc
   */
  listenAll(eventTarget: EventTarget, listener: Listener): this {
    if (!this._allListenersTargets.has(eventTarget)) {
      this._allListenersTargets.set(eventTarget, new WeakMap());
    }

    const nativeListener = (event: CustomEvent | Event) => {
      if (event.type === IMA_EVENT && (event as CustomEvent).detail && (event as CustomEvent).detail.eventName) {
        listener(event as CustomEvent);
      }
    };
    this._allListenersTargets.get(eventTarget)!.set(listener, nativeListener);

    this._window.bindEventListener(eventTarget, IMA_EVENT, nativeListener);

    return this;
  }

  /**
   * @inheritdoc
   */
  listen(eventTarget: EventTarget, eventName: string, listener: Listener) {
    if (!eventTarget) {
      if ($Debug) {
        console.warn(
          `The eventTarget is not defined for event '${eventName}'.`
        );
      }

      return this;
    }

    if (!this._listeners.has(listener)) {
      this._listeners.set(listener, new WeakMap());
    }

    const targetToEventName = this._listeners.get(listener);
    if (!targetToEventName!.has(eventTarget)) {
      targetToEventName!.set(eventTarget, new Map());
    }

    const eventNameToNativeListener = targetToEventName!.get(eventTarget);
    const nativeListener = (event: CustomEvent | Event) => {
      if (
        event.type === IMA_EVENT &&
        (event as CustomEvent).detail &&
        (event as CustomEvent).detail.eventName === eventName
      ) {
        listener(event as CustomEvent);
      }
    };
    eventNameToNativeListener!.set(eventName, nativeListener);

    this._window.bindEventListener(eventTarget, IMA_EVENT, nativeListener);

    return this;
  }

  /**
   * @inheritdoc
   */
  unlistenAll(eventTarget: EventTarget, listener: Listener) {
    if (!this._allListenersTargets.has(eventTarget)) {
      if ($Debug) {
        console.warn(
          'The provided listener is not registered on the ' +
          'specified event target'
        );
      }

      return this;
    }

    const listeners = this._allListenersTargets.get(eventTarget);
    if (!listeners!.has(listener)) {
      if ($Debug) {
        console.warn(
          'The provided listener is not registered on the ' +
          'specified event target'
        );
      }

      return this;
    }

    const nativeListener = listeners!.get(listener);
    this._window.unbindEventListener(eventTarget, IMA_EVENT, nativeListener as NativeListener);

    listeners!.delete(listener);

    return this;
  }

  /**
   * @inheritdoc
   */
  unlisten(eventTarget: EventTarget, eventName: string, listener: Listener) {
    if (!this._listeners.has(listener)) {
      if ($Debug) {
        console.warn(
          'The provided listener is not bound to listen for the ' +
          'specified event on the specified event target.'
        );
      }

      return this;
    }

    const targets = this._listeners.get(listener);
    if (!targets!.has(eventTarget)) {
      if ($Debug) {
        console.warn(
          'The provided listener is not bound to listen for the ' +
          'specified event on the specified event target.'
        );
      }

      return this;
    }

    const eventNameToNativeListener = targets!.get(eventTarget);
    if (!eventNameToNativeListener!.has(eventName)) {
      if ($Debug) {
        console.warn(
          'The provided listener is not bound to listen for the ' +
          'specified event on the specified event target.'
        );
      }

      return this;
    }

    const nativeListener = eventNameToNativeListener!.get(eventName);
    this._window.unbindEventListener(eventTarget, IMA_EVENT, nativeListener as NativeListener);

    eventNameToNativeListener!.delete(eventName);
    if (eventNameToNativeListener!.size) {
      return this;
    }

    targets!.delete(eventTarget);

    return this;
  }
}
