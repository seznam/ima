/* @if server **
export default class ClientWindow {};
/* @else */
import Window, { ListenerOptions } from './Window';

/**
 * Client-side implementation of the {@code Window} utility API.
 */
export default class ClientWindow extends Window {
  private _scopedListeners = new WeakMap();

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

        sessionStorage.setItem(sessionKey, '1');
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
    let { pageXOffset } = window;
    let pageOffsetSupported = pageXOffset !== undefined;
    let isCSS1Compatible = (document.compatMode || '') === 'CSS1Compat';

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
    let { pageYOffset } = window;
    let pageOffsetSupported = pageYOffset !== undefined;
    let isCSS1Compatible = (document.compatMode || '') === 'CSS1Compat';

    return pageOffsetSupported
      ? pageYOffset
      : isCSS1Compatible
      ? document.documentElement.scrollTop
      : document.body.scrollTop;
  }

  /**
   * @inheritdoc
   */
  scrollTo(x: number, y: number) {
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
  querySelector(selector: string) {
    return document.querySelector(selector);
  }

  /**
   * @inheritdoc
   */
  querySelectorAll(selector: string) {
    return document.querySelectorAll(selector);
  }

  /**
   * @inheritdoc
   */
  redirect(url: string) {
    window.location.href = url;
  }

  /**
   * @inheritdoc
   */
  pushState(state: { [key: string]: unknown }, title: string, url?: string) {
    if (window.history.pushState) {
      window.history.pushState(state, title, url);
    }
  }

  /**
   * @inheritdoc
   */
  replaceState(state: { [key: string]: unknown }, title: string, url?: string) {
    if (window.history.replaceState) {
      window.history.replaceState(state, title, url);
    }
  }

  /**
   * @inheritdoc
   */
  createCustomEvent(name: string, options: { [key: string]: unknown }) {
    return new CustomEvent(name, options);
  }

  /**
   * @inheritdoc
   */
  bindEventListener(
    eventTarget: EventTarget,
    event: string,
    listener: (event: Event) => void,
    useCapture = false,
    scope?: unknown
  ) {
    if (eventTarget.addEventListener) {
      let usedListener = listener;

      if (scope) {
        usedListener = this._findScopedListener(
          eventTarget,
          event,
          listener,
          useCapture,
          scope
        );

        if (!usedListener) {
          usedListener = listener.bind(scope);

          this._addScopedListener(
            eventTarget,
            event,
            listener,
            useCapture,
            scope,
            usedListener
          );
        }
      }

      eventTarget.addEventListener(event, usedListener, useCapture);
    }
  }

  /**
   * @inheritdoc
   */
  unbindEventListener(
    eventTarget: EventTarget,
    event: string,
    listener: (event: Event) => void,
    useCapture = false,
    scope?: unknown
  ) {
    if (eventTarget.removeEventListener) {
      let usedListener = listener;

      if (scope) {
        usedListener = this._findScopedListener(
          eventTarget,
          event,
          listener,
          useCapture,
          scope,
          true
        );

        if ($Debug && !usedListener) {
          console.warn(
            'ima.core.window.ClientWindow.unbindEventListener(): the provided ' +
              `listener '${listener}' is not registered for the ` +
              `specified event '${event}' and scope '${scope}'. Check ` +
              `your workflow.`,
            {
              event,
              listener,
              scope,
            }
          );
        }
      }

      eventTarget.removeEventListener(event, usedListener, useCapture);
    }
  }

  _addScopedListener(
    eventTarget: EventTarget,
    event: string,
    listener: (event: Event) => void,
    useCapture = false,
    scope?: unknown,
    usedListener?: (event: Event) => void
  ) {
    if (!this._scopedListeners.has(eventTarget)) {
      this._scopedListeners.set(eventTarget, new Map());
    }

    const scopedListeners = this._scopedListeners.get(eventTarget);

    scopedListeners.set([event, listener, useCapture, scope], usedListener);
  }

  _findScopedListener(
    eventTarget: EventTarget,
    event: string,
    listener: (event: Event) => void,
    useCapture: boolean | ListenerOptions,
    scope: unknown,
    remove = false
  ) {
    if (this._scopedListeners.has(eventTarget)) {
      const scopedListeners = this._scopedListeners.get(eventTarget);

      for (const key of scopedListeners.keys()) {
        const [_event, _listener, _useCapture, _scope] = key;

        if (
          event === _event &&
          listener === _listener &&
          useCapture === _useCapture &&
          scope === _scope
        ) {
          const usedListener = scopedListeners.get(key);

          if (remove) {
            scopedListeners.delete(key);

            if (!scopedListeners.size) {
              this._scopedListeners.delete(eventTarget);
            }
          }

          return usedListener;
        }
      }
    }
  }
}
// @endif
