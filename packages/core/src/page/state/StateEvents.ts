/**
 * Events constants, which is firing to app.
 */
export enum StateEvents {
  /**
   * PateStateManager fire event `$IMA.$PageStateManager.beforeChangeState` before
   * state is patched. Event's data contain
   * `{ oldState: Object<string, *>, newState: Object<string, *>,
   * pathState:  Object<string, *> }`.
   */
  BEFORE_CHANGE_STATE = '$IMA.$PageStateManager.beforeChangeState',

  /**
   * PateStateManager fire event `$IMA.$PageStateManager.afterChangeState` after state
   * is patched. Event's data contain `{newState: Object<string, *>}`.
   */
  AFTER_CHANGE_STATE = '$IMA.$PageStateManager.afterChangeState',
}
