import ns from '../namespace';
import Window from './Window';

ns.namespace('ima.window');

/**
 * Server-side implementation of the {@code Window} utility API.
 */
export default class ServerWindow extends Window {
  static get $dependencies() {
    return [];
  }

  /**
	 * @inheritdoc
	 */
  isClient() {
    return false;
  }

  /**
	 * @inheritdoc
	 */
  isCookieEnabled() {
    return false;
  }

  /**
	 * @inheritdoc
	 */
  hasSessionStorage() {
    return false;
  }

  /**
	 * @inheritdoc
	 */
  setTitle(title) {}

  /**
	 * @inheritdoc
	 */
  getWindow() {
    return undefined;
  }

  /**
	 * @inheritdoc
	 */
  getDocument() {
    return undefined;
  }

  /**
	 * @inheritdoc
	 */
  getScrollX() {
    return 0;
  }

  /**
	 * @inheritdoc
	 */
  getScrollY() {
    return 0;
  }

  /**
	 * @inheritdoc
	 */
  scrollTo(x, y) {}

  /**
	 * @inheritdoc
	 */
  getDomain() {
    return '';
  }

  /**
	 * @inheritdoc
	 */
  getHost() {
    return '';
  }

  /**
	 * @inheritdoc
	 */
  getPath() {
    return '';
  }

  /**
	 * @inheritdoc
	 */
  getUrl() {
    return '';
  }

  /**
	 * @inheritdoc
	 */
  getBody() {
    return undefined;
  }

  /**
	 * @inheritdoc
	 */
  getElementById(id) {
    return null;
  }

  /**
	 * @inheritdoc
	 */
  querySelector(selector) {
    return null;
  }

  /**
	 * @inheritdoc
	 */
  querySelectorAll(selector) {
    class DummyNodeList {
      constructor() {
        this.length = 0;
      }

      item() {
        return null;
      }
    }

    return new DummyNodeList();
  }

  /**
	 * @inheritdoc
	 */
  redirect(url) {}

  /**
	 * @inheritdoc
	 */
  pushState(state, title, url) {}

  /**
	 * @inheritdoc
	 */
  replaceState(state, title, url) {}

  /**
	 * @inheritdoc
	 */
  createCustomEvent(name, options) {
    let dummyCustomEvent = { initCustomEvent: () => {}, detail: {} };

    return Object.assign(dummyCustomEvent, options);
  }

  /**
	 * @inheritdoc
	 */
  bindEventListener(eventTarget, event, listener, useCapture = false) {}

  /**
	 * @inheritdoc
	 */
  unbindEventListener(eventTarget, event, listener, useCapture = false) {}
}

ns.ima.window.ServerWindow = ServerWindow;
