import { ActionTypes, Window } from '@ima/core';

import ManagedPage from '../manager/ManagedPage';
import PageHandlerAction from './PageHandlerAction';
import PageHandlerInterface from './PageHandlerInterface';
import RouteOptions from '../manager/RouteOptions';

/**
 *
 */
export default class PageNavigationHandler implements PageHandlerInterface {
  static get $dependencies() {
    return [Window];
  }

  private _window: Window;

  /**
   * @param window The utility for manipulating the global context
   *        and global client-side-specific APIs.
   */
  constructor(window: Window) {
    /**
     * The utility for manipulating the global context and global
     * client-side-specific APIs.
     */
    this._window = window;
  }

  /**
   * @inheritDoc
   */
  init() {
    // Setup history object to leave the scrolling to us and to not interfere
    const browserWindow = this._window.getWindow();

    if ('scrollRestoration' in browserWindow!.history) {
      browserWindow!.history.scrollRestoration = 'manual';
    }
  }

  /**
   * @inheritDoc
   */
  handlePreManagedState(managedPage: ManagedPage, nextManagedPage: ManagedPage, action: PageHandlerAction) {
    const { autoScroll } = nextManagedPage.options as RouteOptions;

    if (
      managedPage &&
      action &&
      action.type !== ActionTypes.POP_STATE &&
      action.type !== ActionTypes.ERROR
    ) {
      const isRedirection = action.type === ActionTypes.REDIRECT;

      if (!isRedirection) {
        this._saveScrollHistory();
      }
      this._setAddressBar(action.url, isRedirection);
    }

    if (autoScroll) {
      this._scrollTo({ x: 0, y: 0 });
    }
  }

  /**
   * @inheritDoc
   */
  handlePostManagedState(managedPage: ManagedPage, previousManagedPage: ManagedPage, action: PageHandlerAction) {
    const { event } = action;
    const { autoScroll } = managedPage.options as RouteOptions;

    if (event && event.state && event.state.scroll && autoScroll) {
      this._scrollTo(event.state.scroll);
    }
  }

  destroy(): void { }

  /**
   * Save user's scroll state to history.
   *
   * Replace scroll values in current state for actual scroll values in
   * document.
   */
  private _saveScrollHistory() {
    const url = this._window.getUrl();
    const scroll = {
      x: this._window.getScrollX(),
      y: this._window.getScrollY(),
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
  private _scrollTo({ x = 0, y = 0 }) {
    setTimeout(() => {
      this._window.scrollTo(x, y);
    }, 0);
  }

  /**
   * Sets the provided URL to the browser's address bar by pushing or replacing a new
   * state to the history.
   *
   * The state object pushed to or replaced in the history will be an object with the
   * following structure: {@code {url: string}}. The {@code url} field will
   * be set to the provided URL.
   *
   * @param url The URL.
   * @param isRedirection If replaceState should be used instead of pushState.
   */
  private _setAddressBar(url: string, isRedirection: boolean) {
    let scroll = {
      x: 0,
      y: 0,
    };
    let state = { url, scroll };

    if (isRedirection) {
      this._window.replaceState(state, null, url);
    } else {
      this._window.pushState(state, null, url);
    }
  }
}
