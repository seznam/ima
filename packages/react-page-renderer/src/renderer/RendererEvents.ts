/**
 * Events constants, which is firing to app.
 */
enum RendererEvents {
  /**
   * PageRenderer fires event {@code $IMA.$PageRenderer.mounted} after
   * current page view is mounted to the DOM. Event's data contain
   * {@code {type: string}}.
   */
   MOUNTED = '$IMA.$PageRenderer.mounted',

   /**
    * PageRenderer fires event {@code $IMA.$PageRenderer.updated} after
    * current state is updated in the DOM. Event's data contain
    * {@code {state: Object<string, *>}}.
    */
   UPDATED = '$IMA.$PageRenderer.updated',
 
   /**
    * PageRenderer fires event {@code $IMA.$PageRenderer.unmounted} after current view is
    * unmounted from the DOM. Event's data contain
    * {@code {type: string}}.
    */
   UNMOUNTED = '$IMA.$PageRenderer.unmounted',
 
   /**
    * PageRenderer fires event {@code $IMA.$PageRenderer.error} when there is
    * no _viewContainer in _renderToDOM method. Event's data contain
    * {@code {message: string}}.
    */
   ERROR = '$IMA.$PageRenderer.error'
};

export default RendererEvents;

