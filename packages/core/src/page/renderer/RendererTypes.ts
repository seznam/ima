/**
 * Events constants, which is firing to app.
 */
export enum RendererTypes {
  /**
   * The RENDER type is set if mounting use React.render method.
   */
  RENDER = '$IMA.$PageRenderer.type.render',
  /**
   * The HYDRATE type is set if mounting use React.hydrate method.
   */
  HYDRATE = '$IMA.$PageRenderer.type.hydrate',
  /**
   * The UNMOUNT type is set if unmounting use React.unmountComponentAtNode method.
   */
  UNMOUNT = '$IMA.$PageRenderer.type.unmount',
}
