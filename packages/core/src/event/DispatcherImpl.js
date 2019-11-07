import Dispatcher from './Dispatcher';
import GenericError from '../error/GenericError';

/**
 * An empty immutable map of event listener to scopes, used for a mismatch in
 * the {@codelink _eventListeners} map.
 *
 * @const
 * @type {Map<function (*), Set<?Object>>}
 */
const EMPTY_MAP = Object.freeze(new Map());

/**
 * An empty immutable set of event listener scopes, used for a mismatch in the
 * {@codelink _eventListeners} map.
 *
 * @const
 * @type {Set<?Object>}
 */
const EMPTY_SET = Object.freeze(new Set());

/**
 * Default implementation of the {@codelink Dispatcher} interface.
 */
export default class DispatcherImpl extends Dispatcher {
  static get $dependencies() {
    return [];
  }

  /**
   * Initializes the dispatcher.
   */
  constructor() {
    super();

    /**
     * Map of event names to a map of event listeners to a set of scopes to
     * which the event listener should be bound when being executed due to
     * the event.
     *
     * @type {Map<string, Map<function(*), Set<?Object>>>}
     */
    this._eventListeners = new Map();
  }

  /**
   * @inheritdoc
   */
  clear() {
    this._eventListeners.clear();

    return this;
  }

  /**
   * @inheritdoc
   */
  listen(event, listener, scope = null) {
    if ($Debug) {
      if (!(listener instanceof Function)) {
        throw new GenericError(
          `The listener must be a function, ${listener} provided.`
        );
      }
    }

    if (!this._eventListeners.has(event)) {
      this._createNewEvent(event);
    }
    let listeners = this._getListenersOf(event);

    if (!listeners.has(listener)) {
      this._createNewListener(event, listener);
    }
    this._getScopesOf(event, listener).add(scope);

    return this;
  }

  /**
   * @inheritdoc
   */
  unlisten(event, listener, scope = null) {
    let scopes = this._getScopesOf(event, listener);

    if ($Debug) {
      if (!scopes.has(scope)) {
        console.warn(
          'ima.event.DispatcherImpl.unlisten(): the provided ' +
            `listener '${listener}' is not registered for the ` +
            `specified event '${event}' and scope '${scope}'. Check ` +
            `your workflow.`,
          {
            event: event,
            listener: listener,
            scope: scope
          }
        );
      }
    }

    scopes.delete(scope);
    if (!scopes.size) {
      let listeners = this._getListenersOf(event);
      listeners.delete(listener);

      if (!listeners.size) {
        this._eventListeners.delete(event);
      }
    }

    return this;
  }

  /**
   * @inheritdoc
   */
  fire(event, data, imaInternalEvent = false) {
    let listeners = this._getListenersOf(event);

    if (!listeners.size && !imaInternalEvent) {
      console.warn(
        `There are no event listeners registered for the ${event} ` + `event`,
        {
          event: event,
          data: data
        }
      );
    }

    for (let [listener, scopes] of listeners) {
      for (let scope of scopes) {
        listener.bind(scope)(data);
      }
    }

    return this;
  }

  /**
   * Create new Map storage of listeners for the specified event.
   *
   * @param {string} event The name of the event.
   */
  _createNewEvent(event) {
    let listeners = new Map();
    this._eventListeners.set(event, listeners);
  }

  /**
   * Create new Set storage of scopes for the specified event and listener.
   *
   * @param {string} event The name of the event.
   * @param {function(*)} listener The event listener.
   */
  _createNewListener(event, listener) {
    let scopes = new Set();
    this._eventListeners.get(event).set(listener, scopes);
  }

  /**
   * Retrieves the scopes in which the specified event listener should be
   * executed for the specified event.
   *
   * @param {string} event The name of the event.
   * @param {function(*)} listener The event listener.
   * @return {Set<?Object>} The scopes in which the specified listeners
   *         should be executed in case of the specified event. The returned
   *         set is an unmodifiable empty set if no listeners are registered
   *         for the event.
   */
  _getScopesOf(event, listener) {
    let listenersToScopes = this._getListenersOf(event);

    if (listenersToScopes.has(listener)) {
      return listenersToScopes.get(listener);
    }

    return EMPTY_SET;
  }

  /**
   * Retrieves the map of event listeners to scopes they are bound to.
   *
   * @param {string} event The name of the event.
   * @return {Map<function(*), Set<?Object>>} A map of event listeners to the
   *         scopes in which they should be executed. The returned map is an
   *         unmodifiable empty map if no listeners are registered for the
   *         event.
   */
  _getListenersOf(event) {
    if (this._eventListeners.has(event)) {
      return this._eventListeners.get(event);
    }

    return EMPTY_MAP;
  }
}
