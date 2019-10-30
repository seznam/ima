/**
 * Events constants, which is firing to app.
 *
 * @enum {string}
 */
const Events = Object.freeze({
  /**
   * PageRenderer fire event {@code $IMA.$PageRenderer.mounted} after
   * current page view is mounted to the DOM. Event's data contain
   * {@code {type: string}}.
   *
   * @const
   * @type {string}
   */
  MOUNTED: '$IMA.$PageRenderer.mounted',

  /**
   * PageRenderer fire event {@code $IMA.$PageRenderer.updated} after
   * current state is updated in the DOM. Event's data contain
   * {@code {state: Object<string, *>}}.
   *
   * @const
   * @type {string}
   */
  UPDATED: '$IMA.$PageRenderer.updated',

  /**
   * PageRenderer fire event {@code $IMA.$PageRenderer.unmounted} after current view is
   * unmounted from the DOM. Event's data contain
   * {@code {type: string}}.
   *
   * @const
   * @type {string}
   */
  UNMOUNTED: '$IMA.$PageRenderer.unmounted',

  /**
   * PageRenderer fire event {@code $IMA.$PageRenderer.error} when there is
   * no _viewContainer in _renderToDOM method. Event's data contain
   * {@code {message: string}}.
   *
   * @const
   * @type {string}
   */
  ERROR: '$IMA.$PageRenderer.error'
});

export default Events;
