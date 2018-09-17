import PageManagerHandler from './PageHandler';
import Window from '../../window/Window';
import { ActionTypes } from '../../router/ClientRouter';

/**
 *
 */
export default class PageNavigationHandler extends PageManagerHandler {
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
  handlePreManagedState(managedPage, nextManagedState, action) {
    if (managedPage && action && action.type !== ActionTypes.POP_STATE) {
      this._saveScrollHistory();
      this._setAddressBar(action.url);
    }
  }

  /**
   * @inheritDoc
   */
  handlePostManagedState(managedPage, previousManagedPage, action) {
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
   * Scrolls to give coordinates on a page.
   *
   * @param {Object} scroll
   * @param {number} [scroll.x]
   * @param {number} [scroll.y]
   */
  _scrollTo({ x = 0, y = 0 }) {
    setTimeout(() => {
      this._window.scrollTo(x, y);
    }, 0);
  }

  /**
   * Sets the provided URL to the browser's address bar by pushing a new
   * state to the history.
   *
   * The state object pushed to the history will be an object with the
   * following structure: {@code {url: string}}. The {@code url} field will
   * be set to the provided URL.
   *
   * @param {string} url The URL.
   */
  _setAddressBar(url) {
    let scroll = {
      x: 0,
      y: 0
    };
    let state = { url, scroll };

    this._window.pushState(state, null, url);
  }
}
