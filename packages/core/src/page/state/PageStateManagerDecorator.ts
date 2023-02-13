import { PageStateManager } from './PageStateManager';
import { GenericError } from '../../error/GenericError';
import { UnknownParameters } from '../../types';

/**
 * Decorator for page state manager, which add logic for limiting Extension
 * competence.
 */
export class PageStateManagerDecorator extends PageStateManager {
  /**
   * The current page state manager.
   */
  private _pageStateManager: PageStateManager;
  /**
   * Array of access keys for state.
   */
  private _allowedStateKeys: string[];

  /**
   * Initializes the page state manager decorator.
   *
   * @param {PageStateManager} pageStateManager
   * @param {string[]} allowedStateKeys
   */
  constructor(pageStateManager: PageStateManager, allowedStateKeys: string[]) {
    super();

    /**
     * The current page state manager.
     */
    this._pageStateManager = pageStateManager;

    this._allowedStateKeys = allowedStateKeys;
  }

  /**
   * @inheritDoc
   */
  clear() {
    this._pageStateManager.clear();
  }

  /**
   * @inheritDoc
   */
  setState(statePatch: UnknownParameters) {
    if ($Debug) {
      const patchKeys = Object.keys(statePatch);
      const deniedKeys = patchKeys.filter(patchKey => {
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
   * @inheritDoc
   */
  getState() {
    return this._pageStateManager.getState();
  }

  /**
   * @inheritDoc
   */
  getAllStates() {
    return this._pageStateManager.getAllStates();
  }

  /**
   * @inheritDoc
   */
  getTransactionStatePatches() {
    return this._pageStateManager.getTransactionStatePatches();
  }

  /**
   * @inheritDoc
   */
  beginTransaction() {
    return this._pageStateManager.beginTransaction();
  }

  /**
   * @inheritDoc
   */
  commitTransaction() {
    return this._pageStateManager.commitTransaction();
  }

  /**
   * @inheritDoc
   */
  cancelTransaction() {
    return this._pageStateManager.cancelTransaction();
  }
}
