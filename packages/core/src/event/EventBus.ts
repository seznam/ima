/* eslint-disable @typescript-eslint/no-unused-vars */

import { UnknownParameters } from '../types';

export type EventBusListener = (event: CustomEvent) => unknown;

export type EventBusEventHandler = (data?: UnknownParameters) => void;

export type NativeListener = (event: CustomEvent | Event) => unknown;

export type EventBusOptions = {
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
};

/**
 * Utility for sending and intercepting wrapped custom DOM events on the DOM or
 * propagating them to the current controller.
 *
 * As with native events, the event fired by this event bus always propagate up
 * the DOM tree until they reach the window.
 *
 * Note that the events fired by this event bus are wrapped in custom DOM
 * events which always bear an obscure name set by the implementation of this
 * interface, preventing custom event name collisions, and allowing observation
 * and capture of all fired events. The actual event name is always consistent
 * by the implementation.
 */
export abstract class EventBus {
  /**
   * Fires a new custom event of the specified name, carrying the provided
   * data.
   *
   * Note that this method does not prevent the event listeners to modify the
   * data in any way. The order in which the event listeners will be executed
   * is unspecified and should not be relied upon.
   *
   * Note that the default options are
   * `{ bubbles: true, cancelable: true }`, which is different from the
   * default values used in the native custom events
   * (`{ bubbles: false, cancelable: false }`).
   *
   * @param eventTarget The event target at which the event
   *        will be  dispatched (e.g. element/document/window).
   * @param eventName The name of the event to fire.
   * @param data The data to pass to the event listeners.
   * @param options The
   *        override of the default options passed to the constructor of the
   *        custom event fired by this event bus.
   *        The default options passed to the custom event constructor are
   *        `{ bubbles: true, cancelable: true }`.
   * @return This custom event bus.
   * @throws Thrown if the provided event target cannot be used to
   *         fire the event.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Event/Event
   */
  fire(
    eventTarget: EventTarget,
    eventName: string,
    data: unknown,
    options?: EventBusOptions
  ) {
    return this;
  }

  /**
   * Registers the provided event listener to be executed when any custom
   * event is fired using the same implementation of the event bus and passes
   * through the specified event target.
   *
   * When the specified event is fired, the event listener will be executed
   * with the event passed as the first argument.
   *
   * The order in which the event listeners will be executed is unspecified
   * and should not be relied upon.
   *
   * @param eventTarget The event target at which the listener
   *        should listen for all event bus events.
   * @param listener The event listener to
   *        register.
   * @return This event bus.
   */
  listenAll(eventTarget: EventTarget, listener: EventBusListener) {
    return this;
  }

  /**
   * Registers the provided event listener to be executed when the specific
   * custom event is fired by the same implementation of the event bus and
   * passes through the specified event target.
   *
   * When the specified event is fired, the event listener will be executed
   * with the event passed as the first argument.
   *
   * The order in which the event listeners will be executed is unspecified
   * and should not be relied upon.
   *
   * @param eventTarget The event target at which the listener
   *        should listen for the specified event.
   * @param eventName The name of the event to listen for.
   * @param listener The event listener to
   *        register.
   * @return This event bus.
   */
  listen(
    eventTarget: EventTarget,
    eventName: string,
    listener: EventBusListener
  ) {
    return this;
  }

  /**
   * Removes the provided event listener from the set of event listeners
   * executed when the any custom event fired by the same implementation
   * passes through the specified event target.
   *
   * The method has no effect if the listener is not registered at the
   * specified event target.
   *
   * @param eventTarget The event target at which the event
   *        listener listens for events.
   * @param listener The event listener to
   *        deregister.
   * @return This event bus.
   */
  unlistenAll(eventTarget: EventTarget, listener: EventBusListener) {
    return this;
  }

  /**
   * Removes the provided event listener from the set of event listeners
   * executed when the specified custom event fired by the same
   * implementation passes through the specified event target.
   *
   * The method has no effect if the listener is not registered for the
   * specified event at the specified event target.
   *
   * @param eventTarget The event target at which the listener
   *        is listening for the event.
   * @param eventName The name of the event listened for.
   * @param listener The event listener to
   *        deregister.
   * @return This event bus.
   */
  unlisten(
    eventTarget: EventTarget,
    eventName: string,
    listener: EventBusListener
  ) {
    return this;
  }
}
