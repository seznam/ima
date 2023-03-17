/**
 * Events constants, which is firing to app.
 */
export enum RendererEvents {
  /**
   * PageRenderer fires event `$IMA.$PageRenderer.mounted` after
   * current page view is mounted to the DOM. Event's data contain
   * `{type: string}`.
   */
  MOUNTED = '$IMA.$PageRenderer.mounted',

  /**
   * PageRenderer fires event `$IMA.$PageRenderer.updated` after
   * current state is updated in the DOM. Event's data contain
   * `{state: Object<string, *>}`.
   */
  UPDATED = '$IMA.$PageRenderer.updated',

  /**
   * PageRenderer fires event `$IMA.$PageRenderer.unmounted` after current view is
   * unmounted from the DOM. Event's data contain
   * `{type: string}`.
   */
  UNMOUNTED = '$IMA.$PageRenderer.unmounted',

  /**
   * PageRenderer fires event `$IMA.$PageRenderer.error` when there is
   * no _viewContainer in _renderToDOM method. Event's data contain
   * `{message: string}`.
   */
  ERROR = '$IMA.$PageRenderer.error',

  /**
   * Fired when problem occurs during hydratation.
   */
  HYDRATE_ERROR = '$IMA.$PageRenderer.hydrateError',
}
