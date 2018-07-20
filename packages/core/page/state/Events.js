/**
 * Events constants, which is firing to app.
 *
 * @enum {string}
 */
const Events = Object.freeze({
  /**
   * PateStateManager fire event {@code $IMA.$Dispatcher.beforeChangeState} before
   * state is patched. Event's data contain
   * {@code { oldState: Object<string, *>, newState: Object<string, *>,
   * pathState:  Object<string, *> }}.
   *
   * @const
   * @type {string}
   */
  BEFORE_CHANGE_STATE: '$IMA.$Dispatcher.beforeChangeState',

  /**
   * Router fire event {@code $IMA.$Dispatcher.afterChangeState} after state
   * is patched. Event's data contain {@code {newState: Object<string, *>}.
   *
   * @const
   * @type {string}
   */
  AFTER_CHANGE_STATE: '$IMA.$Dispatcher.afterChangeState'
});

export default Events;
