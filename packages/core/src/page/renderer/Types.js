/**
 * Events constants, which is firing to app.
 *
 * @enum {string}
 */
const Types = Object.freeze({
  /**
   * The RENDER type is set if mounting use React.render method.
   *
   * @const
   * @type {string}
   */
  RENDER: '$IMA.$PageRenderer.type.render',
  /**
   * The HYDRATE type is set if mounting use React.hydrate method.
   *
   * @const
   * @type {string}
   */
  HYDRATE: '$IMA.$PageRenderer.type.hydrate',
  /**
   * The UNMOUNT type is set if unmounting use React.unmountComponentAtNode method.
   *
   * @const
   * @type {string}
   */
  UNMOUNT: '$IMA.$PageRenderer.type.unmount',
  /**
   * The CLEAR_STATE type is set if unmounting only clear component state.
   *
   * @const
   * @type {string}
   */
  CLEAR_STATE: '$IMA.$PageRenderer.type.clearState'
});

export default Types;
