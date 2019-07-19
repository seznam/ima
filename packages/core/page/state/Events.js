/**
 * Events constants, which is firing to app.
 *
 * @enum {string}
 */
const Events = Object.freeze({
  /**
   * PateStateManager fire event {@code $IMA.$PageStateManager.beforeChangeState} before
   * state is patched. Event's data contain
   * {@code { oldState: Object<string, *>, newState: Object<string, *>,
   * pathState:  Object<string, *> }}.
   *
   * @const
   * @type {string}
   */
  BEFORE_CHANGE_STATE: '$IMA.$PageStateManager.beforeChangeState',

  /**
   * PateStateManager fire event {@code $IMA.$PageStateManager.afterChangeState} after state
   * is patched. Event's data contain {@code {newState: Object<string, *>}}.
   *
   * @const
   * @type {string}
   */
  AFTER_CHANGE_STATE: '$IMA.$PageStateManager.afterChangeState'
});

export default Events;
