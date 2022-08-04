import PageStateManagerInterface from './PageStateManagerInterface';
import { GenericError } from '@ima/core';

// TODO Check if comments in constructor should be rather placed on property definitions.

/**
 * Decorator for page state manager, which add logic for limiting Extension
 * competence.
 */
export default class PageStateManagerDecorator implements PageStateManagerInterface {
  private _pageStateManager: PageStateManagerInterface;
  private _allowedStateKeys: string[];

  /**
   * Initializes the page state manager decorator.
   *
   * @param pageStateManager
   * @param allowedStateKeys
   */
  constructor(pageStateManager: PageStateManagerInterface, allowedStateKeys: string[]) {
    /**
     * The current page state manager.
     */
    this._pageStateManager = pageStateManager;

    /**
     * Array of access keys for state.
     */
    this._allowedStateKeys = allowedStateKeys;
  }

  /**
   * @inheritdoc
   */
  clear() {
    this._pageStateManager.clear();
  }

  /**
   * @inheritdoc
   */
  setState(statePatch: { [key: string]: any }) {
    if ($Debug) {
      let patchKeys = Object.keys(statePatch);
      let deniedKeys = patchKeys.filter(patchKey => {
        return this._allowedStateKeys.indexOf(patchKey) === -1;
      });

      if (deniedKeys.length > 0) {
        throw new GenericError(
          `Extension can not set state for keys ` +
            `${deniedKeys.join()}. Check your extension or add keys ` +
            `${deniedKeys.join()} to getAllowedStateKeys.`
        );
      }
    }

    this._pageStateManager.setState(statePatch);
  }

  /**
   * @inheritdoc
   */
  getState() {
    return this._pageStateManager.getState();
  }

  /**
   * @inheritdoc
   */
  getAllStates() {
    return this._pageStateManager.getAllStates();
  }

  /**
   * @inheritdoc
   */
  getTransactionStatePatches() {
    return this._pageStateManager.getTransactionStatePatches();
  }

  /**
   * @inheritdoc
   */
  beginTransaction() {
    return this._pageStateManager.beginTransaction();
  }

  /**
   * @inheritdoc
   */
  commitTransaction() {
    return this._pageStateManager.commitTransaction();
  }

  /**
   * @inheritdoc
   */
  cancelTransaction() {
    return this._pageStateManager.cancelTransaction();
  }
}
