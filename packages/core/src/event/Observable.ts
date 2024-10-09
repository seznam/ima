import {
  Dispatcher,
  DispatcherEventsMap,
  DispatcherListener,
} from './Dispatcher';
import { Dependencies } from '../oc/ObjectContainer';

export class Observable {
  protected _dispatcher: Dispatcher;
  protected _observers: Map<string, Map<DispatcherListener<any>, Set<unknown>>>;
  protected _activityHistory: Map<string, unknown>;

  static $dependencies: Dependencies = ['$Dispatcher'];

  constructor(dispatcher: Dispatcher) {
    this._dispatcher = dispatcher;
    this._observers = new Map();
    this._activityHistory = new Map();
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
      observer.bind(scope)(this._activityHistory.get(event));
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
    this._activityHistory.set(event, data);

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
