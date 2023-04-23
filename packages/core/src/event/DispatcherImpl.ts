import { Dispatcher, DispatcherListener } from './Dispatcher';
import { GenericError } from '../error/GenericError';
import { Dependencies } from '../oc/ObjectContainer';

/**
 * An empty immutable map of event listener to scopes, used for a mismatch in
 * the {@link _eventListeners} map.
 */
const EMPTY_MAP: Readonly<Map<DispatcherListener<any>, Set<unknown>>> =
  Object.freeze(new Map());

/**
 * An empty immutable set of event listener scopes, used for a mismatch in the
 * {@link _eventListeners} map.
 */
const EMPTY_SET = Object.freeze(new Set());

/**
 * Default implementation of the {@link Dispatcher} interface.
 */
export class DispatcherImpl extends Dispatcher {
  protected _eventListeners: Map<
    string,
    Map<DispatcherListener<any>, Set<unknown>>
  >;

  static $dependencies: Dependencies = [];

  /**
   * Initializes the dispatcher.
   */
  constructor() {
    super();

    /**
     * Map of event names to a map of event listeners to a set of scopes to
     * which the event listener should be bound when being executed due to
     * the event.
     */
    this._eventListeners = new Map();
  }

  /**
   * @inheritDoc
   */
  clear(): this {
    this._eventListeners.clear();

    return this;
  }

  /**
   * @inheritDoc
   */
  listen(
    event: string,
    listener: DispatcherListener<any>,
    scope?: unknown
  ): this {
    if ($Debug) {
      if (typeof listener !== 'function') {
        throw new GenericError(
          `The listener must be a function, ${listener} provided.`
        );
      }
    }

    if (!this._eventListeners.has(event)) {
      this._createNewEvent(event);
    }

    const listeners = this._getListenersOf(event);

    if (!listeners.has(listener)) {
      this._createNewListener(event, listener);
    }

    this._getScopesOf(event, listener).add(scope);

    return this;
  }

  /**
   * @inheritDoc
   */
  unlisten(
    event: string,
    listener: DispatcherListener<any>,
    scope?: unknown
  ): this {
    const scopes = this._getScopesOf(event, listener);

    if ($Debug) {
      if (!scopes.has(scope)) {
        console.warn(
          'ima.core.event.DispatcherImpl.unlisten(): the provided ' +
            `listener '${listener}' is not registered for the ` +
            `specified event '${event}' and scope '${scope}'. Check ` +
            `your workflow.`,
          {
            event: event,
            listener: listener,
            scope: scope,
          }
        );
      }
    }

    scopes.delete(scope);

    if (!scopes.size) {
      const listeners = this._getListenersOf(event);
      listeners.delete(listener);

      if (!listeners.size) {
        this._eventListeners.delete(event);
      }
    }

    return this;
  }

  /**
   * @inheritDoc
   */
  fire(event: string, data: any, imaInternalEvent: boolean): this {
    const listeners = this._getListenersOf(event);

    if (!listeners?.size && !imaInternalEvent) {
      console.warn(
        `There are no event listeners registered for the ${event} ` + `event`,
        {
          event: event,
          data: data,
        }
      );
    }

    for (const [listener, scopes] of listeners) {
      for (const scope of scopes) {
        listener.bind(scope)(data);
      }
    }

    return this;
  }

  /**
   * Create new Map storage of listeners for the specified event.
   *
   * @param event The name of the event.
   */
  _createNewEvent(event: string): void {
    const listeners = new Map();
    this._eventListeners.set(event, listeners);
  }

  /**
   * Create new Set storage of scopes for the specified event and listener.
   *
   * @param event The name of the event.
   * @param listener The event listener.
   */
  _createNewListener<L extends DispatcherListener<any>>(
    event: string,
    listener: L
  ): void {
    const scopes = new Set();
    const listeners = this._eventListeners.get(event);

    if (listeners) {
      listeners.set(listener, scopes);
    }
  }

  /**
   * Retrieves the scopes in which the specified event listener should be
   * executed for the specified event.
   *
   * @param event The name of the event.
   * @param listener The event listener.
   * @return The scopes in which the specified listeners
   *         should be executed in case of the specified event. The returned
   *         set is an unmodifiable empty set if no listeners are registered
   *         for the event.
   */
  _getScopesOf<L extends DispatcherListener<any>>(
    event: string,
    listener: L
  ): Readonly<Set<unknown>> {
    const listenersToScopes = this._getListenersOf(event)!;

    if (listenersToScopes.has(listener)) {
      return listenersToScopes.get(listener)!;
    }

    return EMPTY_SET;
  }

  /**
   * Retrieves the map of event listeners to scopes they are bound to.
   *
   * @param event The name of the event.
   * @return A map of event listeners to the
   *         scopes in which they should be executed. The returned map is an
   *         unmodifiable empty map if no listeners are registered for the
   *         event.
   */
  _getListenersOf(
    event: string
  ): Readonly<Map<DispatcherListener<any>, Set<unknown>>> {
    if (this._eventListeners.has(event)) {
      return this._eventListeners.get(event)!;
    }

    return EMPTY_MAP;
  }
}
