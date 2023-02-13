/* eslint-disable @typescript-eslint/no-unused-vars */

import { UnknownParameters } from '../../types';

/**
 * Manager of the current page state and state history.
 */
export abstract class PageStateManager {
  onChange?: (newState: UnknownParameters) => void;

  /**
   * Clears the state history.
   */
  clear() {
    return;
  }

  /**
   * Sets a new page state by applying the provided patch to the current
   * state.
   *
   * @param statePatch The patch of the current state.
   */
  setState(statePatch: UnknownParameters) {
    return;
  }

  /**
   * Returns the current page state.
   *
   * @return The current page state.
   */
  getState(): UnknownParameters {
    return {};
  }

  /**
   * Returns the recorded history of page states. The states will be
   * chronologically sorted from the oldest to the newest.
   *
   * Note that the implementation may limit the size of the recorded history,
   * therefore the complete history may not be available.
   *
   * @return The recorded history of page states.
   */
  getAllStates(): UnknownParameters[] {
    return [];
  }

  /**
   * Returns queueing state patches off the main state from the begin of transaction.
   *
   * @return State patches from the begin of transaction.
   */
  getTransactionStatePatches(): UnknownParameters[] {
    return [];
  }

  /**
   * Starts queueing state patches off the main state. While the transaction
   * is active every `setState` call has no effect on the current state.
   *
   * Note that call to `getState` after the transaction has begun will
   * return state as it was before the transaction.
   */
  beginTransaction() {
    return;
  }

  /**
   * Applies queued state patches to the main state. All patches are squashed
   * and applied with one `setState` call.
   */
  commitTransaction() {
    return;
  }

  /**
   * Cancels ongoing transaction. Uncommitted state changes are lost.
   */
  cancelTransaction() {
    return;
  }
}
