import Window from './Window';

// @server-side class ServerWindow extends __VARIABLE__ {__CLEAR__}\nexports.default = ServerWindow;

/**
 * Server-side implementation of the {@code Window} utility API.
 */
export default class ServerWindow extends Window {
  //#if _SERVER
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
  setTitle() {}

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
  scrollTo() {}

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
  getElementById() {
    return null;
  }

  /**
   * @inheritdoc
   */
  getHistoryState() {
    return {};
  }

  /**
   * @inheritdoc
   */
  querySelector() {
    return null;
  }

  /**
   * @inheritdoc
   */
  querySelectorAll() {
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
  redirect() {}

  /**
   * @inheritdoc
   */
  pushState() {}

  /**
   * @inheritdoc
   */
  replaceState() {}

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
  bindEventListener() {}

  /**
   * @inheritdoc
   */
  unbindEventListener() {}
  //#endif
}
