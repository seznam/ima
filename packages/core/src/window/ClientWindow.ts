/* @if server **
export default class ClientWindow {};
/* @else */
import Window, { listenerOptions } from './Window';

/**
 * Client-side implementation of the `Window` utility API.
 */
export default class ClientWindow implements Window {
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
        const sessionKey = 'IMA.jsTest';

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
  setTitle(title: string) {
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
    const { pageXOffset } = window;
    const pageOffsetSupported = pageXOffset !== undefined;
    const isCSS1Compatible = (document.compatMode || '') === 'CSS1Compat';

    return pageOffsetSupported
      ? pageXOffset
      : isCSS1Compatible
      ? document.documentElement.scrollLeft
      : document.body.scrollLeft;
  }

  /**
   * @inheritdoc
   */
  getScrollY() {
    const { pageYOffset } = window;
    const pageOffsetSupported = pageYOffset !== undefined;
    const isCSS1Compatible = (document.compatMode || '') === 'CSS1Compat';

    return pageOffsetSupported
      ? pageYOffset
      : isCSS1Compatible
      ? document.documentElement.scrollTop
      : document.body.scrollTop;
  }

  /**
   * @inheritdoc
   */
  scrollTo(x: number, y: number): void {
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
  getElementById(id: string) {
    return document.getElementById(id);
  }

  /**
   * @inheritdoc
   */
  getHistoryState() {
    return window.history.state;
  }

  /**
   * @inheritdoc
   */
  querySelector(selector: string): null | HTMLElement {
    return document.querySelector(selector);
  }

  /**
   * @inheritdoc
   */
  querySelectorAll(selector: string): NodeList {
    return document.querySelectorAll(selector);
  }

  /**
   * @inheritdoc
   */
  redirect(url: string): void {
    window.location.href = url;
  }

  /**
   * @inheritdoc
   */
  pushState(
    state: { [key: string]: unknown },
    title: string,
    url: string | null = null
  ) {
    if (window.history.pushState) {
      window.history.pushState(state, title, url);
    }
  }

  /**
   * @inheritdoc
   */
  replaceState(
    state: { [key: string]: unknown },
    title: string,
    url: string | null = null
  ) {
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
  bindEventListener(
    eventTarget: EventTarget,
    event: string,
    listener: (event: Event) => void,
    useCapture: boolean | listenerOptions = false
  ) {
    if (eventTarget.addEventListener) {
      eventTarget.addEventListener(event, listener, useCapture);
    }
  }

  /**
   * @inheritdoc
   */
  unbindEventListener(
    eventTarget: EventTarget,
    event: string,
    listener: (event: Event) => void,
    useCapture: boolean | listenerOptions = false
  ) {
    if (eventTarget.removeEventListener) {
      eventTarget.removeEventListener(event, listener, useCapture);
    }
  }
}
// @endif
