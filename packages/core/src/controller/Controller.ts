import { Dependencies, GenericError, RouteParams, Settings } from '..';
import { Dictionary } from '../dictionary/Dictionary';
import { EventBusEventHandler } from '../event/EventBus';
import { Extension } from '../extension/Extension';
import { MetaManager } from '../meta/MetaManager';
import { PageStateManager } from '../page/state/PageStateManager';
import { Router } from '../router/Router';
import { UnknownParameters, UnknownPromiseParameters } from '../types';

/**
 * Interface defining the common API of page controllers. A page controller is
 * used to manage the overall state and view of a single application page, and
 * updates the page state according to the events submitted to it by components
 * on the page (or other input).
 */
export abstract class Controller {
  static $name?: string;
  static $dependencies: Dependencies;
  static $extensions?: Dependencies;

  [key: PropertyKey]: any | EventBusEventHandler;

  /**
   * Callback for initializing the controller after the route parameters have
   * been set on this controller.
   */
  init(): Promise<void> | void {
    return;
  }

  /**
   * Finalization callback, called when the controller is being discarded by
   * the application. This usually happens when the user navigates to a
   * different URL.
   *
   * This method is the lifecycle counterpart of the {@link Controller#init}
   * method.
   *
   * The controller should release all resources obtained in the
   * {@link Controller#init} method. The controller must release any resources
   * that might not be released automatically when the controller's instance
   * is destroyed by the garbage collector.
   */
  destroy(): Promise<void> | void {
    return;
  }

  /**
   * Callback for activating the controller in the UI. This is the last
   * method invoked during controller initialization, called after all the
   * promises returned from the {@link Controller#load} method have been
   * resolved and the controller has configured the meta manager.
   *
   * The controller may register any React and DOM event listeners in this
   * method. The controller may start receiving event bus event after this
   * method completes.
   */
  activate(): Promise<void> | void {
    return;
  }

  /**
   * Callback for deactivating the controller in the UI. This is the first
   * method invoked during controller deinitialization. This usually happens
   * when the user navigates to a different URL.
   *
   * This method is the lifecycle counterpart of the
   * {@link Controller#activate} method.
   *
   * The controller should deregister listeners registered and release all
   * resources obtained in the {@link Controller#activate} method.
   */
  deactivate(): Promise<void> | void {
    return;
  }

  /**
   * Callback the controller uses to request the resources it needs to render
   * its view. This method is invoked after the {@link Controller#init}
   * method.
   *
   * The controller should request all resources it needs in this method, and
   * represent each resource request as a promise that will resolve once the
   * resource is ready for use (these can be data fetched over HTTP(S),
   * database connections, etc).
   *
   * The method must return a plain flat object. The field names of the
   * object identify the resources being fetched and prepared, each value
   * must be either the resource (e.g. view configuration or a value
   * retrieved synchronously) or a Promise that will resolve to the resource.
   *
   * The IMA will use the object to set the state of the controller.
   *
   * If at the server side, the IMA will wait for all the promises to
   * resolve, replaces the promises with the resolved values and sets the
   * resulting object as the controller's state.
   *
   * If at the client side, the IMA will first set the controller's state to
   * an object containing only the fields of the returned object that were
   * not promises. IMA will then update the controller's state every time a
   * promise of the returned object resolves. IMA will update the state by
   * adding the resolved resource to the controller's state.
   *
   * Any returned promise that gets rejected will redirect the application to
   * the error page. The error page that will be used depends on the status
   * code of the error.
   *
   * @return A map object of promises resolved when all resources the controller
   *         requires are ready. The resolved values will be pushed to the
   *         controller's state.
   */
  load(): Promise<UnknownPromiseParameters> | UnknownPromiseParameters {
    return {};
  }

  /**
   * Callback for updating the controller after a route update. This method
   * is invoked if the current route has the `onlyUpdate` flag set to `true` and
   * the current controller and view match those used by the previously active
   * route, or, the `onlyUpdate` option of the current route is a callback and
   * returned `true`.
   *
   * The method must return an object with the same semantics as the result
   * of the {@link Controller#load} method. The controller's state will only
   * be patched by the returned object instead of replacing it completely.
   *
   * The other controller lifecycle callbacks ({@link Controller#init},
   * {@link Controller#load}, {@link Controller#activate},
   * {@link Controller#deactivate}, {@link Controller#deinit}) are not call
   * in case this method is used.
   *
   * @param prevParams Previous route
   *         parameters.
   * @return A map object of promises resolved when all resources the controller
   *         requires are ready. The resolved values will be pushed to the
   *         controller's state.
   */
  update(
    prevParams: RouteParams = {}
  ): Promise<UnknownPromiseParameters> | UnknownPromiseParameters {
    return {};
  }

  /**
   * Patches the state of this controller using the provided object by
   * copying the provided patch object fields to the controller's state
   * object.
   *
   * You can use this method to modify the state partially or add new fields
   * to the state object.
   *
   * Note that the state is not patched recursively but by replacing the
   * values of the top-level fields of the state object.
   *
   * Once the promises returned by the {@link Controller#load} method are
   * resolved, this method is called with the an object containing the
   * resolved values. The field names of the passed object will match the
   * field names in the object returned from the {@link Controller#load}
   * method.
   *
   * @param statePatch Patch of the controller's state to
   *        apply.
   */
  setState(statePatch: UnknownParameters): void {
    return;
  }

  /**
   * Returns the controller's current state.
   *
   * @return The current state of this controller.
   */
  getState(): UnknownParameters {
    return {};
  }

  /**
   * Starts queueing state patches off the controller state. While the transaction
   * is active every `setState` call has no effect on the current state.
   *
   * Note that call to `getState` after the transaction has begun will
   * return state as it was before the transaction.
   */
  beginStateTransaction(): void {
    return;
  }

  /**
   * Applies queued state patches to the controller state. All patches are squashed
   * and applied with one `setState` call.
   */
  commitStateTransaction(): void {
    return;
  }

  /**
   * Cancels ongoing state transaction. Uncommitted state changes are lost.
   */
  cancelStateTransaction(): void {
    return;
  }

  /**
   * Adds the provided extension to this controller. All extensions should be
   * added to the controller before the {@link Controller#init} method is
   * invoked.
   */
  addExtension(
    extension: typeof Extension | InstanceType<typeof Extension>,
    extensionInstance?: InstanceType<typeof Extension>
  ): void {
    return;
  }

  /**
   * Returns extension instance defined by it's class constructor
   * from controller's extension intance map.
   */
  getExtension(
    extension: typeof Extension
  ): InstanceType<typeof Extension> | undefined {
    throw new GenericError(
      'The ima.core.controller.Controller.getExtension method is abstract ' +
        'and must be overridden.'
    );
  }

  /**
   * Returns the controller's extensions.
   *
   * @return {Extension[]} The extensions added to this controller.
   */
  getExtensions(): Extension[] {
    return [];
  }

  /**
   * Callback used to configure the meta attribute manager. The method is
   * called after the the controller's state has been patched with the all
   * loaded resources and the view has been rendered.
   *
   * @param loadedResources A plain object representing a
   *        map of resource names to resources loaded by the
   *        {@link Controller#load} method. This is the same object as the one
   *        passed to the {@link Controller#setState} method.
   * @param metaManager Meta attributes manager to configure.
   * @param router The current application router.
   * @param dictionary The current localization dictionary.
   * @param settings The application settings for the
   *        current application environment.
   */
  setMetaParams(
    loadedResources: UnknownParameters,
    metaManager: MetaManager,
    router: Router,
    dictionary: Dictionary,
    settings: Settings
  ): void {
    return;
  }

  /**
   * Sets the current route parameters. This method is invoked before the
   * {@link Controller#init} method.
   *
   * @param params The current route parameters.
   */
  setRouteParams(params: RouteParams = {}): void {
    return;
  }

  /**
   * Returns the current route parameters.
   *
   * @return The current route parameters.
   */
  getRouteParams(): RouteParams {
    return {};
  }

  /**
   * Sets the page state manager. The page state manager manages the
   * controller's state. The state manager can be set to `null` if this
   * controller loses the right to modify the state of the current page (e.g.
   * the user has navigated to a different route using a different
   * controller).
   *
   * @param pageStateManager The current state manager to
   *        use.
   */
  setPageStateManager(pageStateManager?: PageStateManager): void {
    return;
  }

  /**
   * Returns the HTTP status code to send to the client, should the
   * controller be used at the server-side.
   *
   * @return The HTTP status code to send to the client.
   */
  getHttpStatus(): number {
    return 200;
  }
}
