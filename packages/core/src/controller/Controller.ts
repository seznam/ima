import Dictionary from '../dictionary/Dictionary';
import Extension from '../extension/Extension';
import MetaManager from '../meta/MetaManager';
import Router from '../router/Router';
import PageStateManager from '../page/state/PageStateManager';

/**
 * Interface defining the common API of page controllers. A page controller is
 * used to manage the overall state and view of a single application page, and
 * updates the page state according to the events submitted to it by components
 * on the page (or other input).
 */
export default abstract class Controller {
  /**
   * Callback for initializing the controller after the route parameters have
   * been set on this controller.
   */
  abstract init(): void;

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
  abstract destroy(): void;

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
  abstract activate(): void;

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
  abstract deactivate(): void;

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
   * @return {(Promise<Object<string, (Promise|*)>>|Object<string, (Promise|*)>)}
   *         A map object of promises resolved when all resources the controller
   *         requires are ready. The resolved values will be pushed to the
   *         controller's state.
   */
  abstract load():
    | Promise<{ [key: string]: Promise<unknown> | unknown }>
    | { [key: string]: Promise<unknown> | unknown };

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
   * @param {Object<string, string>=} [prevParams={}] Previous route
   *         parameters.
   * @return {(Promise<Object<string, (Promise|*)>>|Object<string, (Promise|*)>)}
   *         A map object of promises resolved when all resources the controller
   *         requires are ready. The resolved values will be pushed to the
   *         controller's state.
   */
  abstract update(prevParams: {
    [key: string]: string;
  }):
    | Promise<{ [key: string]: Promise<unknown> | unknown }>
    | { [key: string]: Promise<unknown> | unknown };

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
   * @param {Object<string, *>} statePatch Patch of the controller's state to
   *        apply.
   */
  abstract setState(statePatch: { [key: string]: unknown }): void;

  /**
   * Returns the controller's current state.
   *
   * @return {Object<string, *>} The current state of this controller.
   */
  abstract getState(): { [key: string]: unknown };

  /**
   * Starts queueing state patches off the controller state. While the transaction
   * is active every `setState` call has no effect on the current state.
   *
   * Note that call to `getState` after the transaction has begun will
   * return state as it was before the transaction.
   */
  abstract beginStateTransaction(): void;

  /**
   * Applies queued state patches to the controller state. All patches are squashed
   * and applied with one `setState` call.
   */
  abstract commitStateTransaction(): void;

  /**
   * Cancels ongoing state transaction. Uncommited state changes are lost.
   */
  abstract cancelStateTransaction(): void;

  /**
   * Adds the provided extension to this controller. All extensions should be
   * added to the controller before the {@link Controller#init} method is
   * invoked.
   */
  abstract addExtension(
    extension: Extension,
    extensionInstance: Extension
  ): void;

  /**
   * Returns the controller's extensions.
   *
   * @return {Extension[]} The extensions added to this controller.
   */
  abstract getExtensions(): Extension[];

  /**
   * Callback used to configure the meta attribute manager. The method is
   * called after the the controller's state has been patched with the all
   * loaded resources and the view has been rendered.
   *
   * @param {Object<string, *>} loadedResources A plain object representing a
   *        map of resource names to resources loaded by the
   *        {@link Controller#load} method. This is the same object as the one
   *        passed to the {@link Controller#setState} method.
   * @param {MetaManager} metaManager Meta attributes manager to configure.
   * @param {Router} router The current application router.
   * @param {Dictionary} dictionary The current localization dictionary.
   * @param {Object<string, *>} settings The application settings for the
   *        current application environment.
   */
  abstract setMetaParams(
    loadedResources: { [key: string]: unknown },
    metaManager: MetaManager,
    router: Router,
    dictionary: Dictionary,
    settings: { [key: string]: unknown }
  ): void;

  /**
   * Sets the current route parameters. This method is invoked before the
   * {@link Controller#init} method.
   *
   * @param {Object<string, string>} [params={}] The current route parameters.
   */
  abstract setRouteParams(params: { [key: string]: string }): void;

  /**
   * Returns the current route parameters.
   *
   * @return {Object<string, string>} The current route parameters.
   */
  abstract getRouteParams(): { [key: string]: string };

  /**
   * Sets the page state manager. The page state manager manages the
   * controller's state. The state manager can be set to `null` if this
   * controller loses the right to modify the state of the current page (e.g.
   * the user has navigated to a different route using a different
   * controller).
   *
   * @param {?PageStateManager} pageStateManager The current state manager to
   *        use.
   */
  abstract setPageStateManager(pageStateManager: PageStateManager): void;

  /**
   * Returns the HTTP status code to send to the client, should the
   * controller be used at the server-side.
   *
   * @return {number} The HTTP status code to send to the client.
   */
  abstract getHttpStatus(): number;
}