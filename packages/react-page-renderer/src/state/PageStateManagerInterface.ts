/**
 * Manager of the current page state and state history.
 */
export default interface PageStateManagerInterface {
  /**
   * Clears the state history.
   */
  clear(): void;

  /**
   * Sets a new page state by applying the provided patch to the current
   * state.
   *
   * @param statePatch The patch of the current state.
   */
  setState(patchState: object): void

  /**
   * Returns the current page state.
   *
   * @return The current page state.
   */
  getState(): object

  /**
   * Returns the recorded history of page states. The states will be
   * chronologically sorted from the oldest to the newest.
   *
   * Note that the implementation may limit the size of the recorded history,
   * therefore the complete history may not be available.
   *
   * @return The recorded history of page states.
   */
  getAllStates(): object[]

  /**
   * Returns queueing state patches off the main state from the begin of transaction.
   *
   * @return State patches from the begin of transaction.
   */
  getTransactionStatePatches(): object[]

  /**
   * Starts queueing state patches off the main state. While the transaction
   * is active every {@method setState} call has no effect on the current state.
   *
   * Note that call to {@method getState} after the transaction has begun will
   * return state as it was before the transaction.
   */
  beginTransaction(): void

  /**
   * Applies queued state patches to the main state. All patches are squashed
   * and applied with one {@method setState} call.
   */
  commitTransaction(): void

  /**
   * Cancels ongoing transaction. Uncommited state changes are lost.
   */
  cancelTransaction(): void
}
