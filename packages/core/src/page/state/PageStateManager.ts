export type PageState = { [key: string]: any };

/**
 * Manager of the current page state and state history.
 */
export abstract class PageStateManager<S extends PageState = {}> {
  onChange?: (newState: S) => void;

  /**
   * Clears the state history.
   */
  clear(): void {
    return;
  }

  /**
   * Sets a new page state by applying the provided patch to the current
   * state.
   *
   * @param statePatch The patch of the current state.
   */
  setState<K extends keyof S>(patchState: Pick<S, K> | S | null): void {
    return;
  }

  /**
   * Returns the current page state.
   *
   * @return The current page state.
   */
  getState(): S {
    return {} as S;
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
  getAllStates(): S[] {
    return [];
  }

  /**
   * Returns queueing state patches off the main state from the begin of transaction.
   *
   * @return State patches from the begin of transaction.
   */
  getTransactionStatePatches(): (Pick<S, any> | S | null)[] {
    return [];
  }

  /**
   * Starts queueing state patches off the main state. While the transaction
   * is active every `setState` call has no effect on the current state.
   *
   * Note that call to `getState` after the transaction has begun will
   * return state as it was before the transaction.
   */
  beginTransaction(): void {
    return;
  }

  /**
   * Applies queued state patches to the main state. All patches are squashed
   * and applied with one `setState` call.
   */
  commitTransaction(): void {
    return;
  }

  /**
   * Cancels ongoing transaction. Uncommitted state changes are lost.
   */
  cancelTransaction(): void {
    return;
  }
}
