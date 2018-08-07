import PageManagerHandler from './PageManagerHandler';
import Window from 'window/Window';

/**
 *
 */
export default class ScrollHandler extends PageManagerHandler {
  static get $dependencies() {
    return [Window];
  }

  /**
   * @param {Window} window The utility for manipulating the global context
   *        and global client-side-specific APIs.
   */
  constructor(window) {
    super();

    /**
     * The utility for manipulating the global context and global
     * client-side-specific APIs.
     *
     * @type {ima.window.Window}
     */
    this._window = window;
  }

  /**
   * @inheritDoc
   */
  handlePreManagedState() {
    this._saveScrollHistory();
  }

  /**
   * @inheritDoc
   */
  handlePostManagedState(previousManagedPage, managedPage, action) {
    const { event } = action;

    if (!event || !event.state || !event.state.scroll) {
      return;
    }

    this._scrollTo(event.state.scroll);
  }

  /**
   * Save user's scroll state to history.
   *
   * Replace scroll values in current state for actual scroll values in
   * document.
   */
  _saveScrollHistory() {
    const url = this._window.getUrl();
    const scroll = {
      x: this._window.getScrollX(),
      y: this._window.getScrollY()
    };
    const state = { url, scroll };

    const oldState = this._window.getHistoryState();
    const newState = Object.assign({}, oldState, state);

    this._window.replaceState(newState, null, url);
  }

  /**
   * @inheritdoc
   */
  _scrollTo({ x = 0, y = 0 }) {
    setTimeout(() => {
      this._window.scrollTo(x, y);
    }, 0);
  }
}
