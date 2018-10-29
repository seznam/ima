// @client-side

import EventBus from './EventBus';
import GenericError from '../error/GenericError';
import Window from '../window/Window';

/**
 * Global name of IMA.js custom event.
 *
 * @const
 * @type {string}
 */
export const IMA_EVENT = '$IMA.CustomEvent';

/**
 * Helper for custom events.
 *
 * It offers public methods for firing custom events and two methods for
 * catching events (e.g. inside view components).
 */
export default class EventBusImpl extends EventBus {
  static get $dependencies() {
    return [Window];
  }

  /**
   * Initializes the custom event helper.
   *
   * @param {Window} window The IMA window helper.
   */
  constructor(window) {
    super();

    /**
     * The IMA window helper.
     *
     * @type {Window}
     */
    this._window = window;

    /**
     * Map of listeners provided to the public API of this event bus to a
     * map of event targets to a map of event names to actual listeners
     * bound to the native API.
     *
     * The "listen all" event listeners are not registered in this map.
     *
     * @type {WeakMap<
     *         function(Event),
     *         WeakMap<EventTarget, Map<string, function(Event)>>
     *       >}
     */
    this._listeners = new WeakMap();

    /**
     * Map of event targets to listeners executed on all IMA.js event bus
     * events.
     *
     * @type {WeakMap<EventTarget, WeakSet<function(Event)>>}
     */
    this._allListenersTargets = new WeakMap();
  }

  /**
   * @inheritdoc
   */
  fire(eventTarget, eventName, data, options = {}) {
    var eventInitialization = {};
    var params = { detail: { eventName, data } };
    var defaultOptions = { bubbles: true, cancelable: true };
    Object.assign(eventInitialization, defaultOptions, options, params);

    var event = this._window.createCustomEvent(IMA_EVENT, eventInitialization);

    if (eventTarget && typeof eventTarget.dispatchEvent !== 'undefined') {
      eventTarget.dispatchEvent(event);
    } else {
      throw new GenericError(
        `ima.event.EventBusImpl.fire: The EventSource ` +
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
  listenAll(eventTarget, listener) {
    if (!this._allListenersTargets.has(eventTarget)) {
      this._allListenersTargets.set(eventTarget, new WeakMap());
    }

    var nativeListener = event => {
      if (event.detail.eventName && event.type === IMA_EVENT) {
        listener(event);
      }
    };
    this._allListenersTargets.get(eventTarget).set(listener, nativeListener);

    this._window.bindEventListener(eventTarget, IMA_EVENT, nativeListener);

    return this;
  }

  /**
   * @inheritdoc
   */
  listen(eventTarget, eventName, listener) {
    if (!this._listeners.has(listener)) {
      this._listeners.set(listener, new WeakMap());
    }

    var targetToEventName = this._listeners.get(listener);
    if (!targetToEventName.has(eventTarget)) {
      targetToEventName.set(eventTarget, new Map());
    }

    var eventNameToNativeListener = targetToEventName.get(eventTarget);
    var nativeListener = event => {
      if (event.detail.eventName === eventName && event.type === IMA_EVENT) {
        listener(event);
      }
    };
    eventNameToNativeListener.set(eventName, nativeListener);

    this._window.bindEventListener(eventTarget, IMA_EVENT, nativeListener);

    return this;
  }

  /**
   * @inheritdoc
   */
  unlistenAll(eventTarget, listener) {
    if (!this._allListenersTargets.has(eventTarget)) {
      if ($Debug) {
        console.warn(
          'The provided listener is not registered on the ' +
            'specified event target'
        );
      }

      return this;
    }

    var listeners = this._allListenersTargets.get(eventTarget);
    if (!listeners.has(listener)) {
      if ($Debug) {
        console.warn(
          'The provided listener is not registered on the ' +
            'specified event target'
        );
      }

      return this;
    }

    var nativeListener = listeners.get(listener);
    this._window.unbindEventListener(eventTarget, IMA_EVENT, nativeListener);

    listeners.delete(listener);
    if (listeners.size) {
      return this;
    }

    this._allListenersTargets.delete(eventTarget);

    return this;
  }

  /**
   * @inheritdoc
   */
  unlisten(eventTarget, eventName, listener) {
    if (!this._listeners.has(listener)) {
      if ($Debug) {
        console.warn(
          'The provided listener is not bound to listen for the ' +
            'specified event on the specified event target.'
        );
      }

      return this;
    }

    var targets = this._listeners.get(listener);
    if (!targets.has(eventTarget)) {
      if ($Debug) {
        console.warn(
          'The provided listener is not bound to listen for the ' +
            'specified event on the specified event target.'
        );
      }

      return this;
    }

    var eventNameToNativeListener = targets.get(eventTarget);
    if (!eventNameToNativeListener.has(eventName)) {
      if ($Debug) {
        console.warn(
          'The provided listener is not bound to listen for the ' +
            'specified event on the specified event target.'
        );
      }

      return this;
    }

    var nativeListener = eventNameToNativeListener.get(eventName);
    this._window.unbindEventListener(eventTarget, IMA_EVENT, nativeListener);

    eventNameToNativeListener.delete(eventName);
    if (eventNameToNativeListener.size) {
      return this;
    }

    targets.delete(eventTarget);

    return this;
  }
}
