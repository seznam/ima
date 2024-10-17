import {
  Dispatcher,
  DispatcherEventsMap,
  DispatcherListener,
} from './Dispatcher';
import { Dependencies } from '../oc/ObjectContainer';
import { RendererEvents } from '../page/renderer/RendererEvents';
import { RouterEvents } from '../router/RouterEvents';

export class Observable {
  protected _dispatcher: Dispatcher;
  protected _observers: Map<string, Map<DispatcherListener<any>, Set<unknown>>>;
  protected _activityHistory: Map<string, unknown[]>;
  protected _pageResetEvents: Set<string>;

  static $dependencies: Dependencies = ['$Dispatcher'];

  constructor(dispatcher: Dispatcher) {
    this._dispatcher = dispatcher;
    this._observers = new Map();
    this._activityHistory = new Map();
    this._pageResetEvents = new Set();

    this.clear();
  }

  init() {
    this._dispatcher.listenAll(this._handleDispatcherEvent, this);
  }

  destroy() {
    this._dispatcher.unlistenAll(this._handleDispatcherEvent, this);
  }

  clear() {
    this._observers.clear();
    this._activityHistory.clear();
    this._pageResetEvents.clear();

    Object.values(RouterEvents).forEach(event =>
      this._pageResetEvents.add(event)
    );

    Object.values(RendererEvents).forEach(event =>
      this._pageResetEvents.add(event)
    );
  }

  registerPageReset(event: keyof DispatcherEventsMap | string) {
    this._pageResetEvents.add(event);
  }

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

  _handleDispatcherEvent(event: string, data: any) {
    if (event === RouterEvents.BEFORE_HANDLE_ROUTE) {
      for (const pageResetEvent of this._pageResetEvents) {
        this._activityHistory.delete(pageResetEvent);
      }
    }

    if (!this._activityHistory.has(event)) {
      this._activityHistory.set(event, []);
    }

    this._activityHistory.get(event)!.push(data);

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
