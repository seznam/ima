import {
  Dispatcher,
  DispatcherEventsMap,
  DispatcherListener,
} from './Dispatcher';
import { Settings } from '../boot';
import { Dependencies } from '../oc/ObjectContainer';
import { RouterEvents } from '../router/RouterEvents';

/**
 * An Observable is a class that manages event listeners and allows distributing
 * events to the registered listeners. It maintains a history of events and supports
 * persistent events that are not cleared during route changes.
 *
 * @remarks
 * - The Observable class relies on a Dispatcher to handle the actual event distribution.
 * - It maintains a history of events, which can be limited by a maximum history length.
 */
export class Observable {
  protected _dispatcher: Dispatcher;
  protected _observers: Map<string, Map<DispatcherListener<any>, Set<unknown>>>;
  protected _activityHistory: Map<string, unknown[]>;
  protected _persistentEvents: Set<string>;
  protected _settings: Settings['$Observable'];

  static $dependencies: Dependencies = [
    '$Dispatcher',
    '?$Settings.$Observable',
  ];

  /**
   * Creates an instance of Observable.
   *
   * @param dispatcher - The dispatcher responsible for managing event listeners.
   * @param settings - Optional settings for the Observable instance.
   */
  constructor(dispatcher: Dispatcher, settings?: Settings['$Observable']) {
    this._dispatcher = dispatcher;
    this._observers = new Map();
    this._activityHistory = new Map();
    this._persistentEvents = new Set();
    this._settings = settings;
  }

  /**
   * Initializes the observable.
   */
  init() {
    this._dispatcher.listenAll(this._handleDispatcherEvent, this);
  }

  /**
   * Destroys the observable by clearing its internal state and removing all event listeners.
   */
  destroy() {
    this.clear();
    this._dispatcher.unlistenAll(this._handleDispatcherEvent, this);
  }

  /**
   * Clears all persistent events, observers, and activity history from the observable.
   *
   * This method will remove all stored events, registered observers, and any recorded
   * activity history, effectively resetting the observable to its initial state.
   */
  clear() {
    this._persistentEvents.clear();
    this._observers.clear();
    this._activityHistory.clear();
  }

  /**
   * Registers an event as persistent, meaning its history won't be cleared upon calling the `clear` method (route change).
   *
   * @param event - The name of the event to be registered as persistent. This can be a key from the DispatcherEventsMap or any string.
   */
  registerPersistenEvent(event: keyof DispatcherEventsMap | string) {
    this._persistentEvents.add(event);
  }

  /**
   * Subscribes an observer to a specific event. When the event is dispatched,
   * the observer will be notified and executed within the provided scope.
   * If the event has already occurred, the observer will be immediately
   * invoked with the historical data.
   *
   * @param event - The event to subscribe to. This can be a key from the
   *                DispatcherEventsMap or a custom string event.
   * @param observer - The observer function to be called when the event is
   *                   dispatched.
   * @param scope - The scope in which the observer function should be executed.
   *                This is optional.
   * @returns The instance of the Observable for chaining.
   */
  subscribe(
    event: keyof DispatcherEventsMap | string,
    observer: DispatcherListener<any>,
    scope?: unknown
  ) {
    if (!this._observers.has(event)) {
      this._observers.set(event, new Map());
    }

    if (!this._observers.get(event)!.has(observer)) {
      this._observers.get(event)!.set(observer, new Set());
    }

    this._observers.get(event)!.get(observer)!.add(scope);

    if (this._activityHistory.has(event)) {
      this._activityHistory
        .get(event)!
        .forEach(data => observer.bind(scope)(data));
    }

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
  unsubscribe(
    event: keyof DispatcherEventsMap | string,
    observer: DispatcherListener<any>,
    scope?: unknown
  ) {
    if (!this._observers.has(event)) {
      return;
    }

    if (!this._observers.get(event)!.has(observer)) {
      return;
    }

    this._observers.get(event)!.get(observer)!.delete(scope);

    if (this._observers.get(event)!.get(observer)!.size === 0) {
      this._observers.get(event)!.delete(observer);
    }

    return this;
  }

  /**
   * Handles dispatcher events by updating the activity history and notifying observers.
   * It also resets the activity history for non-persistent events on `BEFORE_HANDLE_ROUTE` ecvent.
   *
   * @param event - The name of the event being dispatched.
   * @param data - The data associated with the event.
   */
  _handleDispatcherEvent(event: string, data: any) {
    if (event === RouterEvents.BEFORE_HANDLE_ROUTE) {
      for (const [eventKey] of this._activityHistory) {
        if (!this._persistentEvents.has(eventKey)) {
          this._activityHistory.delete(eventKey);
        }
      }
    }

    if (!this._activityHistory.has(event)) {
      this._activityHistory.set(event, []);
    }

    this._activityHistory.get(event)!.push(data);
    this._activityHistory.set(
      event,
      this._activityHistory
        .get(event)!
        .splice(-(this._settings?.maxHistoryLength || 10))
    );

    if (!this._observers.has(event)) {
      return;
    }

    for (const [observer, scopes] of this._observers.get(event)!.entries()) {
      for (const scope of scopes) {
        observer.bind(scope)(data);
      }
    }
  }
}
