/* @if server **
export class ClientWindow {};
/* @else */
import { Window, CaptureOptions } from './Window';
import { UnknownParameters } from '../types';

/**
 * Client-side implementation of the {@link Window} utility API.
 */
export class ClientWindow extends Window {
  private _scopedListeners = new WeakMap();

  static get $dependencies() {
    return [];
  }

  /**
   * @inheritDoc
   */
  isClient() {
    return true;
  }

  /**
   * @inheritDoc
   */
  isCookieEnabled() {
    return navigator.cookieEnabled;
  }

  /**
   * @inheritDoc
   */
  hasSessionStorage() {
    try {
      if (window.sessionStorage) {
        const sessionKey = 'IMA.jsTest';

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
   * @inheritDoc
   */
  setTitle(title: string) {
    document.title = title;
  }

  /**
   * @inheritDoc
   */
  getWindow() {
    return window;
  }

  /**
   * @inheritDoc
   */
  getDocument() {
    return document;
  }

  /**
   * @inheritDoc
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
   * @inheritDoc
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
   * @inheritDoc
   */
  scrollTo(x: number, y: number) {
    window.scrollTo(x, y);
  }

  /**
   * @inheritDoc
   */
  getDomain() {
    return window.location.protocol + '//' + window.location.host;
  }

  /**
   * @inheritDoc
   */
  getHost() {
    return window.location.host;
  }

  /**
   * @inheritDoc
   */
  getPath() {
    return window.location.pathname + window.location.search;
  }

  /**
   * @inheritDoc
   */
  getUrl() {
    return window.location.href;
  }

  /**
   * @inheritDoc
   */
  getBody() {
    return document.body;
  }

  /**
   * @inheritDoc
   */
  getElementById(id: string) {
    return document.getElementById(id);
  }

  /**
   * @inheritDoc
   */
  getHistoryState() {
    return window.history.state;
  }

  /**
   * @inheritDoc
   */
  querySelector(selector: string) {
    return document.querySelector(selector);
  }

  /**
   * @inheritDoc
   */
  querySelectorAll(selector: string) {
    return document.querySelectorAll(selector);
  }

  /**
   * @inheritDoc
   */
  redirect(url: string) {
    window.location.href = url;
  }

  /**
   * @inheritDoc
   */
  pushState(state: UnknownParameters, title: string, url?: string) {
    if (window.history.pushState) {
      window.history.pushState(state, title, url);
    }
  }

  /**
   * @inheritDoc
   */
  replaceState(state: UnknownParameters, title: string, url?: string) {
    if (window.history.replaceState) {
      window.history.replaceState(state, title, url);
    }
  }

  /**
   * @inheritDoc
   */
  createCustomEvent(name: string, options: UnknownParameters) {
    return new CustomEvent(name, options);
  }

  /**
   * @inheritDoc
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
   * @inheritDoc
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
    useCapture: boolean | CaptureOptions,
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
