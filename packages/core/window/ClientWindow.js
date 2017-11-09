// @client-side

import Window from './Window';

/**
 * Client-side implementation of the {@code Window} utility API.
 */
export default class ClientWindow extends Window {
  static get $dependencies() {
    return [];
  }

  /**
   * @inheritdoc
   */
  isClient() {
    return true;
  }

  /**
   * @inheritdoc
   */
  isCookieEnabled() {
    return navigator.cookieEnabled;
  }

  /**
   * @inheritdoc
   */
  hasSessionStorage() {
    try {
      if (window.sessionStorage) {
        let sessionKey = 'IMA.jsTest';

        sessionStorage.setItem(sessionKey, 1);
        sessionStorage.removeItem(sessionKey);

        return true;
      }
    } catch (error) {
      if ($Debug) {
        console.warn('Session Storage is not accessible!', error);
      }
      return false;
    }
    return false;
  }

  /**
   * @inheritdoc
   */
  setTitle(title) {
    document.title = title;
  }

  /**
   * @inheritdoc
   */
  getWindow() {
    return window;
  }

  /**
   * @inheritdoc
   */
  getDocument() {
    return document;
  }

  /**
   * @inheritdoc
   */
  getScrollX() {
    let pageOffsetSupported = window.pageXOffset !== undefined;
    let isCSS1Compatible = (document.compatMode || '') === 'CSS1Compat';

    return pageOffsetSupported
      ? window.pageXOffset
      : isCSS1Compatible
        ? document.documentElement.scrollLeft
        : document.body.scrollLeft;
  }

  /**
   * @inheritdoc
   */
  getScrollY() {
    let pageOffsetSupported = window.pageYOffset !== undefined;
    let isCSS1Compatible = (document.compatMode || '') === 'CSS1Compat';

    return pageOffsetSupported
      ? window.pageYOffset
      : isCSS1Compatible
        ? document.documentElement.scrollTop
        : document.body.scrollTop;
  }

  /**
   * @inheritdoc
   */
  scrollTo(x, y) {
    window.scrollTo(x, y);
  }

  /**
   * @inheritdoc
   */
  getDomain() {
    return window.location.protocol + '//' + window.location.host;
  }

  /**
   * @inheritdoc
   */
  getHost() {
    return window.location.host;
  }

  /**
   * @inheritdoc
   */
  getPath() {
    return window.location.pathname + window.location.search;
  }

  /**
   * @inheritdoc
   */
  getUrl() {
    return window.location.href;
  }

  /**
   * @inheritdoc
   */
  getBody() {
    return document.body;
  }

  /**
   * @inheritdoc
   */
  getElementById(id) {
    return document.getElementById(id);
  }

  /**
   * @inheritdoc
   */
  querySelector(selector) {
    return document.querySelector(selector);
  }

  /**
   * @inheritdoc
   */
  querySelectorAll(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * @inheritdoc
   */
  redirect(url) {
    window.location.href = url;
  }

  /**
   * @inheritdoc
   */
  pushState(state, title, url) {
    if (window.history.pushState) {
      window.history.pushState(state, title, url);
    }
  }

  /**
   * @inheritdoc
   */
  replaceState(state, title, url) {
    if (window.history.replaceState) {
      window.history.replaceState(state, title, url);
    }
  }

  /**
   * @inheritdoc
   */
  createCustomEvent(name, options) {
    return new CustomEvent(name, options);
  }

  /**
   * @inheritdoc
   */
  bindEventListener(eventTarget, event, listener, useCapture = false) {
    if (eventTarget.addEventListener) {
      eventTarget.addEventListener(event, listener, useCapture);
    }
  }

  /**
   * @inheritdoc
   */
  unbindEventListener(eventTarget, event, listener, useCapture = false) {
    if (eventTarget.removeEventListener) {
      eventTarget.removeEventListener(event, listener, useCapture);
    }
  }
}
