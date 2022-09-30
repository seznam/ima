import { UnknownParameters } from '../../CommonTypes';

/**
 * Manager of the current page state and state history.
 */
export default abstract class PageStateManager {
  onChange?: (newState: UnknownParameters) => void;

  /**
   * Clears the state history.
   */
  abstract clear(): void;

  /**
   * Sets a new page state by applying the provided patch to the current
   * state.
   *
   * @param statePatch The patch of the current state.
   */
  abstract setState(statePatch: UnknownParameters): void;

  /**
   * Returns the current page state.
   *
   * @return The current page state.
   */
  abstract getState(): UnknownParameters;

  /**
   * Returns the recorded history of page states. The states will be
   * chronologically sorted from the oldest to the newest.
   *
   * Note that the implementation may limit the size of the recorded history,
   * therefore the complete history may not be available.
   *
   * @return The recorded history of page states.
   */
  abstract getAllStates(): UnknownParameters[];

  /**
   * Returns queueing state patches off the main state from the begin of transaction.
   *
   * @return State patches from the begin of transaction.
   */
  abstract getTransactionStatePatches(): UnknownParameters[];

  /**
   * Starts queueing state patches off the main state. While the transaction
   * is active every `setState` call has no effect on the current state.
   *
   * Note that call to `getState` after the transaction has begun will
   * return state as it was before the transaction.
   */
  abstract beginTransaction(): void;

  /**
   * Applies queued state patches to the main state. All patches are squashed
   * and applied with one `setState` call.
   */
  abstract commitTransaction(): void;

  /**
   * Cancels ongoing transaction. Uncommited state changes are lost.
   */
  abstract cancelTransaction(): void;
}
