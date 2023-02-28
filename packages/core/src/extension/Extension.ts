/* eslint-disable @typescript-eslint/no-unused-vars */

import { EventBusEventHandler } from '../event/EventBus';
import { PageStateManager } from '../page/state/PageStateManager';
import { UnknownParameters, UnknownPromiseParameters } from '../types';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IExtension {}

/**
 * Extensions provide means of extending the page controllers with additional
 * managed state and logic.
 *
 * An extension has access to the current route parameters, specify the
 * resources to load when the page is loading or being updated, may intercept
 * event bus events and modify the state of the page just like an ordinary
 * controller, except that the modifications are restricted to the state fields
 * which the extension explicitly specifies using its
 * {@link Extension#getAllowedStateKeys} method.
 *
 * All extensions to be used on a page must be added to the current controller
 * before the controller is initialized. After that, the extensions will go
 * through the same lifecycle as the controller.
 */
export abstract class Extension implements IExtension {
  static $name?: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: PropertyKey]: any | EventBusEventHandler;

  /**
   * Callback for initializing the controller extension after the route
   * parameters have been set on this extension.
   */
  init(): Promise<undefined> | void {
    return;
  }

  /**
   * Finalization callback, called when the controller is being discarded by
   * the application. This usually happens when the user navigates to a
   * different URL.
   *
   * This method is the lifecycle counterpart of the {@link Extension#init}
   * method.
   *
   * The extension should release all resources obtained in the
   * {@link Extension#init} method. The extension must release any resources
   * that might not be released automatically when the extensions's instance
   * is destroyed by the garbage collector.
   */
  destroy(): Promise<undefined> | void {
    return;
  }

  /**
   * Callback for activating the extension in the UI. This is the last
   * method invoked during controller (and extensions) initialization, called
   * after all the promises returned from the {@link Extension#load} method have
   * been resolved and the controller has configured the meta manager.
   *
   * The extension may register any React and DOM event listeners in this
   * method. The extension may start receiving event bus event after this
   * method completes.
   */
  activate(): Promise<undefined> | void {
    return;
  }

  /**
   * Callback for deactivating the extension in the UI. This is the first
   * method invoked during extension deinitialization. This usually happens
   * when the user navigates to a different URL.
   *
   * This method is the lifecycle counterpart of the {@link Extension#activate}
   * method.
   *
   * The extension should deregister listeners registered and release all
   * resources obtained in the {@link Extension#activate} method.
   */
  deactivate(): Promise<undefined> | void {
    return;
  }

  /**
   * Callback the extension uses to request the resources it needs to render
   * its related parts of the view. This method is invoked after the
   * {@link Extension#init} method.
   *
   * The extension should request all resources it needs in this method, and
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
   * Callback for updating the extension after a route update. This method
   * is invoked if the current route has the `onlyUpdate` flag set to `true` and
   * the current controller and view match those used by the previously active
   * route, or, the `onlyUpdate` option of the current route is a callback and
   * returned `true`.
   *
   * The method must return an object with the same semantics as the result
   * of the {@link Extension#load} method. The controller's state will then be
   * patched by the returned object.
   *
   * The other extension lifecycle callbacks ({@link Extension#init},
   * {@link Extension#load}, {@link Extension#activate},
   * {@link Extension#deactivate}, {@link Extension#deinit}) are not call in
   * case this method is used.
   *
   * @param prevParams Previous route
   *         parameters.
   * @return A map object of promises resolved when all resources the controller
   *         requires are ready. The resolved values will be pushed to the
   *         controller's state.
   */
  update(
    prevParams: UnknownParameters
  ): Promise<UnknownPromiseParameters> | UnknownPromiseParameters {
    return {};
  }

  /**
   * Patches the state of the controller using this extension by using the
   * provided object by copying the provided patch object fields to the
   * controller's state object.
   *
   * Note that the state is not patched recursively but by replacing the
   * values of the top-level fields of the state object.
   *
   * Note that the extension may modify only the fields of the state that it
   * has specified by its {@link Extension#getAllowedStateKeys} method.
   *
   * @param statePatch Patch of the controller's state to apply.
   */
  setState(statePatch: UnknownParameters) {
    return;
  }

  /**
   * Returns the current state of the controller using this extension.
   *
   * @return The current state of the controller.
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
  beginStateTransaction() {
    return;
  }

  /**
   * Applies queued state patches to the controller state. All patches are squashed
   * and applied with one `setState` call.
   */
  commitStateTransaction() {
    return;
  }

  /**
   * Cancels ongoing state transaction. Uncommitted state changes are lost.
   */
  cancelStateTransaction() {
    return;
  }

  /**
   * Patches the partial state of the extension. The extension is able
   * during its load and update phase receive state from active controller
   * using this extension and from previously loaded/updated extensions.
   *
   * @param partialStatePatch Patch of the controller's state to apply.
   */
  setPartialState(partialStatePatch: UnknownParameters) {
    return;
  }

  /**
   * Returns the current partial state of the extension.
   *
   * @return The current partial state of the extension.
   */
  getPartialState(): UnknownParameters {
    return {};
  }

  /**
   * Clears the current partial state of the extension and sets it value to empty object.
   */
  clearPartialState() {
    return;
  }

  /**
   * Sets the state manager used to manage the controller's state..
   *
   * @param pageStateManager The current state manager to
   *        use.
   */
  setPageStateManager(pageStateManager?: PageStateManager) {
    return;
  }

  /**
   * Enables using PageStateManager for getting state.
   */
  switchToStateManager() {
    return;
  }

  /**
   * Disables using PageStateManager for getting state.
   */
  switchToPartialState() {
    return;
  }

  /**
   * Sets the current route parameters. This method is invoked before the
   * {@link Extension#init} method.
   *
   * @param params The current route parameters.
   */
  setRouteParams(params: UnknownParameters) {
    return;
  }

  /**
   * Returns the current route parameters.
   *
   * @return The current route parameters.
   */
  getRouteParams(): UnknownParameters {
    return {};
  }

  /**
   * Returns the names of the state fields that may be manipulated by this
   * extension. Manipulations of other fields of the state will be ignored.
   *
   * @return The names of the state fields that may be manipulated
   *         by this extension.
   */
  getAllowedStateKeys(): string[] {
    return [];
  }
}
