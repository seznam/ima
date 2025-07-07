/* @if server **
export class ClientWindow {};
/* @else */
import { Window } from './Window';

/**
 * Client-side implementation of the {@link Window} utility API.
 */
export class ClientWindow extends Window {
  #scopedListeners = new WeakMap();

  static get $dependencies() {
    return [];
  }

  /**
   * @inheritDoc
   */
  isClient(): boolean {
    return true;
  }

  /**
   * @inheritDoc
   */
  isCookieEnabled(): boolean {
    return navigator.cookieEnabled;
  }

  /**
   * @inheritDoc
   */
  hasSessionStorage(): boolean {
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
  setTitle(title: string): void {
    document.title = title;
  }

  /**
   * @inheritDoc
   */
  getWindow(): globalThis.Window {
    return window;
  }

  /**
   * @inheritDoc
   */
  getDocument(): globalThis.Document {
    return document;
  }

  /**
   * @inheritDoc
   */
  getScrollX(): number {
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
  getScrollY(): number {
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
  scrollTo(x: number, y: number): void {
    window.scrollTo(x, y);
  }

  /**
   * @inheritDoc
   */
  getDomain(): string {
    return window.location.protocol + '//' + window.location.host;
  }

  /**
   * @inheritDoc
   */
  getHost(): string {
    return window.location.host;
  }

  /**
   * @inheritDoc
   */
  getPath(): string {
    return window.location.pathname + window.location.search;
  }

  /**
   * @inheritDoc
   */
  getUrl(): string {
    return window.location.href;
  }

  /**
   * @inheritDoc
   */
  getBody(): undefined | HTMLElement {
    return document.body;
  }

  /**
   * @inheritDoc
   */
  getElementById(id: string): null | HTMLElement {
    return document.getElementById(id);
  }

  /**
   * @inheritDoc
   */
  getHistoryState(): History['state'] {
    return window.history.state;
  }

  /**
   * @inheritDoc
   */
  querySelector<E extends Element = Element>(selector: string): E | null {
    return document.querySelector(selector);
  }

  /**
   * @inheritDoc
   */
  querySelectorAll<E extends Element = Element>(
    selector: string
  ): NodeListOf<E> {
    return document.querySelectorAll(selector);
  }

  /**
   * @inheritDoc
   */
  redirect(url: string): void {
    window.location.href = url;
  }

  /**
   * @inheritDoc
   */
  pushState<T>(state: T, title: string, url?: string): void {
    if (window.history.pushState) {
      window.history.pushState(state, title, url);
    }
  }

  /**
   * @inheritDoc
   */
  replaceState<T>(state: T, title: string, url?: string): void {
    if (window.history.replaceState) {
      window.history.replaceState(state, title, url);
    }
  }

  /**
   * @inheritDoc
   */
  createCustomEvent<T>(
    name: string,
    options: CustomEventInit<T>
  ): CustomEvent<T> {
    return new CustomEvent(name, options);
  }

  /**
   * @inheritDoc
   */
  bindEventListener<T extends EventTarget, E extends Event, S>(
    eventTarget: T,
    event: string,
    listener: (event: E) => void,
    options: boolean | AddEventListenerOptions = false,
    scope?: S
  ): void {
    if (!eventTarget.addEventListener) {
      return;
    }

    let scopedListener;

    if (scope) {
      scopedListener = this._findScopedListener(
        eventTarget,
        event,
        listener,
        options,
        scope
      );

      if (!scopedListener) {
        scopedListener = listener.bind(scope);

        // Add scoped listener
        if (!this.#scopedListeners.has(eventTarget)) {
          this.#scopedListeners.set(eventTarget, new Map());
        }

        const scopedListeners = this.#scopedListeners.get(eventTarget);
        scopedListeners.set(
          [event, listener, this._getListenerCapture(options), scope],
          scopedListener
        );
      }
    }

    eventTarget.addEventListener(event, scopedListener ?? listener, options);
  }

  /**
   * @inheritDoc
   */
  unbindEventListener<T extends EventTarget, E extends Event = Event, S = any>(
    eventTarget: T,
    event: string,
    listener: (event: E) => void,
    options: boolean | EventListenerOptions = false,
    scope?: S
  ): void {
    if (!eventTarget.addEventListener) {
      return;
    }

    let scopedListener;

    if (scope) {
      scopedListener = this._findScopedListener(
        eventTarget,
        event,
        listener,
        options,
        scope,
        true
      );

      if ($Debug && !scopedListener) {
        console.warn(
          'ima.core.window.ClientWindow.unbindEventListener(): the provided ' +
            `listener '${listener}' is not registered for the ` +
            `specified event '${
              event as string
            }' and scope '${scope}'. Check ` +
            `your workflow.`,
          {
            event,
            listener,
            scope,
          }
        );
      }
    }

    eventTarget.removeEventListener(event, scopedListener ?? listener, options);
  }

  private _findScopedListener<T extends EventTarget, E extends Event, S>(
    eventTarget: T,
    event: string,
    listener: (event: E) => void,
    options: boolean | AddEventListenerOptions,
    scope: S,
    remove = false
  ) {
    if (!this.#scopedListeners.has(eventTarget)) {
      return;
    }

    const scopedListeners = this.#scopedListeners.get(eventTarget);

    for (const key of scopedListeners.keys()) {
      const [scopedEvent, scopedListener, scopedCapture, scopedScope] = key;

      if (
        event === scopedEvent &&
        listener === scopedListener &&
        this._getListenerCapture(options) === scopedCapture &&
        scope === scopedScope
      ) {
        const usedListener = scopedListeners.get(key);

        if (remove) {
          scopedListeners.delete(key);

          if (!scopedListeners.size) {
            this.#scopedListeners.delete(eventTarget);
          }
        }

        return usedListener;
      }
    }
  }

  private _getListenerCapture(
    options: boolean | EventListenerOptions
  ): boolean {
    return typeof options === 'boolean' ? options : (options.capture ?? false);
  }
}
// @endif
