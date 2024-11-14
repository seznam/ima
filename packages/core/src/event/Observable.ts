import { DispatcherEventsMap, DispatcherListener } from './Dispatcher';

/**
 * An Observable is a class that manages event listeners and allows distributing
 * events to the registered listeners. It maintains a history of events and supports
 * persistent events that are not cleared during route changes.
 */
export abstract class Observable {
  /**
   * Initializes the observable.
   *
   * @returns The instance of the Observable for chaining.
   */
  init() {
    return this;
  }

  /**
   * Destroys the observable by clearing its internal state and removing all event listeners.
   *
   * @returns The instance of the Observable for chaining.
   */
  destroy() {
    return this;
  }

  /**
   * Clears all persistent events, observers, and activity history from the observable.
   *
   * This method will remove all stored events, registered observers, and any recorded
   * activity history, effectively resetting the observable to its initial state.
   *
   * @returns The instance of the Observable for chaining.
   */
  clear() {
    return this;
  }

  /**
   * Registers an event as persistent, meaning its history won't be cleared upon calling the `clear` method (route change).
   *
   * @param event - The name of the event to be registered as persistent. This can be a key from the DispatcherEventsMap or any string.
   * @returns The instance of the Observable for chaining.
   */
  registerPersistenEvent<E extends keyof DispatcherEventsMap>(event: E): this;
  registerPersistenEvent(event: string) {
    return this;
  }

  /**
   * Subscribes an observer to a specific event. When the event is dispatched,
   * the observer will be notified and executed within the provided scope.
   * If the event has already occurred, the observer will be immediately
   * invoked with the historical data.
   *
   * @param event - The event to subscribe to.
   * @param observer - The observer function to be called when the event is
   *                   dispatched.
   * @param scope - The scope in which the observer function should be executed.
   *                This is optional.
   * @returns The instance of the Observable for chaining.
   */
  subscribe<E extends keyof DispatcherEventsMap>(
    event: E,
    observer: DispatcherListener<any>,
    scope?: unknown
  ): this;
  subscribe(event: string, observer: DispatcherListener<any>, scope?: unknown) {
    return this;
  }

  /**
   * Unsubscribes an observer from a specific event.
   *
   * @param event - The event name or key from the DispatcherEventsMap.
   * @param observer - The observer (listener) to be unsubscribed.
   * @param scope - Optional scope to be used for the observer.
   * @returns The current instance for chaining.
   */
  unsubscribe<E extends keyof DispatcherEventsMap>(
    event: E,
    observer: DispatcherListener<any>,
    scope?: unknown
  ): this;
  unsubscribe(
    event: string,
    observer: DispatcherListener<any>,
    scope?: unknown
  ) {
    return this;
  }
}
