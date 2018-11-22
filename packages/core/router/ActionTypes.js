/**
 * Name of actions that can trigger routing
 *
 * @enum {string}
 * @type {Object<string, string>}
 */
const ActionTypes = Object.freeze({
  /**
   * @const
   * @type {string}
   */
  REDIRECT: 'redirect',

  /**
   * @const
   * @type {string}
   */
  CLICK: 'click',

  /**
   * @const
   * @type {string}
   */
  POP_STATE: 'popstate',

  /**
   * @const
   * @type {string}
   */
  ERROR: 'error'
});

export default ActionTypes;
