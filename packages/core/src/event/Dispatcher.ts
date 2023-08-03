import { PageManagerDispatcherEvents } from '../page/manager/AbstractPageManager';
import { PageRendererDispatcherEvents } from '../page/renderer/PageRenderer';
import { PageStateDispatcherEvents } from '../page/state/PageStateManagerImpl';
import { RouterDispatcherEvents } from '../router/AbstractRouter';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DispatcherEventsMap
  extends PageStateDispatcherEvents,
    PageManagerDispatcherEvents,
    RouterDispatcherEvents,
    PageRendererDispatcherEvents {}
export type DispatcherListener<D> = (data: D) => void;

/**
 * A Dispatcher is a utility that manager event listeners registered for events
 * and allows distributing (firing) events to the listeners registered for the
 * given event.
 *
 * The dispatcher provides a single-node event bus and is usually used to
 * propagate events from controllers to UI components when modifying/passing
 * the state is impractical for any reason.
 */
export abstract class Dispatcher {
  /**
   * Deregisters all event listeners currently registered with this
   * dispatcher.
   */
  clear(): this {
    return this;
  }

  /**
   * Registers the provided event listener to be executed when the specified
   * event is fired on this dispatcher.
   *
   * When the specified event is fired, the event listener will be executed
   * with the data passed with the event as the first argument.
   *
   * The order in which the event listeners will be executed is unspecified
   * and should not be relied upon. Registering the same listener for the
   * same event and with the same scope multiple times has no effect.
   *
   * @param event The name of the event to listen for.
   * @param listener The event listener to register.
   * @param scope The object to which the `this` keyword
   *        will be bound in the event listener.
   * @return This dispatcher.
   */
  listen<E extends keyof DispatcherEventsMap>(
    event: E,
    listener: DispatcherListener<DispatcherEventsMap[E]>,
    scope?: unknown
  ): this;
  listen(
    event: string,
    listener: DispatcherListener<any>,
    scope?: unknown
  ): this;
  listen(
    event: string,
    listener: DispatcherListener<any>,
    scope?: unknown
  ): this {
    return this;
  }

  /**
   * Deregisters the provided event listener, so it will no longer be
   * executed with the specified scope when the specified event is fired.
   *
   * @param event The name of the event for which the listener
   *        should be deregistered.
   * @param listener The event listener to deregister.
   * @param scope The object to which the `this` keyword
   *        would be bound in the event listener.
   * @return This dispatcher.
   */
  unlisten<E extends keyof DispatcherEventsMap>(
    event: E,
    listener: DispatcherListener<DispatcherEventsMap[E]>,
    scope?: unknown
  ): this;
  unlisten(
    event: string,
    listener: DispatcherListener<any>,
    scope?: unknown
  ): this;
  unlisten(
    event: string,
    listener: DispatcherListener<any>,
    scope?: unknown
  ): this {
    return this;
  }

  /**
   * Fires a new event of the specified name, carrying the provided data.
   *
   * The method will synchronously execute all event listeners registered for
   * the specified event, passing the provided data to them as the first
   * argument.
   *
   * Note that this method does not prevent the event listeners to modify the
   * data in any way. The order in which the event listeners will be executed
   * is unspecified and should not be relied upon.
   *
   * @param event The name of the event to fire.
   * @param data The data to pass to the event listeners.
   * @param [imaInternalEvent=false] The flag signalling whether
   *        this is an internal IMA event. The fired event is treated as a
   *        custom application event if this flag is not set.
   *        The flag is used only for debugging and has no effect on the
   *        propagation of the event.
   * @return This dispatcher.
   */
  fire<E extends keyof DispatcherEventsMap>(
    event: E,
    data: DispatcherEventsMap[E],
    imaInternalEvent?: boolean
  ): this;
  fire(event: string, data: any, imaInternalEvent?: boolean): this;
  fire(event: string, data: any, imaInternalEvent?: boolean): this {
    return this;
  }
}
