import {
  Dispatcher,
  DispatcherEventsMap,
  DispatcherListener,
} from './Dispatcher';
import { Observable } from './Observable';
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
export class ObservableImpl extends Observable {
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
    super();
    this._dispatcher = dispatcher;
    this._observers = new Map();
    this._activityHistory = new Map();
    this._persistentEvents = new Set();
    this._settings = settings;
  }

  /**
   * @inheritDoc
   */
  init() {
    this.clear();
    this._dispatcher.listenAll(this._handleDispatcherEvent, this);

    return this;
  }

  /**
   * @inheritDoc
   */
  destroy() {
    this.clear();
    this._dispatcher.unlistenAll(this._handleDispatcherEvent, this);

    return this;
  }

  /**
   * @inheritDoc
   */
  clear() {
    this._persistentEvents.clear();
    this._observers.clear();
    this._activityHistory.clear();

    return this;
  }

  /**
   * @inheritDoc
   */
  registerPersistenEvent(event: keyof DispatcherEventsMap | string) {
    this._persistentEvents.add(event);

    return this;
  }

  /**
   * @inheritDoc
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
   * @inheritDoc
   */
  unsubscribe(
    event: keyof DispatcherEventsMap | string,
    observer: DispatcherListener<any>,
    scope?: unknown
  ) {
    if (!this._observers.has(event)) {
      return this;
    }

    if (!this._observers.get(event)!.has(observer)) {
      return this;
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
