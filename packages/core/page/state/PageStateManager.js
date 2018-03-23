/**
 * Manager of the current page state and state history.
 */
export default class PageStateManager {
  /**
   * Clears the state history.
   */
  clear() {}

  /**
   * Sets a new page state by applying the provided patch to the current
   * state.
   *
   * @param {Object<string, *>} statePatch The patch of the current state.
   */
  setState() {}

  /**
   * Returns the current page state.
   *
   * @return {Object<string, *>} The current page state.
   */
  getState() {}

  /**
   * Returns the recorded history of page states. The states will be
   * chronologically sorted from the oldest to the newest.
   *
   * Note that the implementation may limit the size of the recorded history,
   * therefore the complete history may not be available.
   *
   * @return {Object<string, *>[]} The recorded history of page states.
   */
  getAllStates() {}
}
