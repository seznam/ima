/* @if client **
export default class ServerWindow {};
/* @else */
import Window from './Window';
import GenericError from '../error/GenericError';
import { UnknownParameters } from '../CommonTypes';

/**
 * Server-side implementation of the `Window` utility API.
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
  setTitle() {
    throw new GenericError('The setTitle() is denied on server side.');
  }

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
  scrollTo() {
    return;
  }

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
  querySelectorAll(_selector: string) {
    class DummyNodeList extends NodeList {
      public length: number;
      constructor() {
        super();
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
  redirect() {
    return;
  }

  /**
   * @inheritdoc
   */
  pushState() {
    return;
  }

  /**
   * @inheritdoc
   */
  replaceState() {
    return;
  }

  /**
   * @inheritdoc
   */
  createCustomEvent(name: string, options: UnknownParameters) {
    const dummyCustomEvent = {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      initCustomEvent: () => {},
      detail: {},
    } as unknown as CustomEvent;

    return Object.assign(dummyCustomEvent, options);
  }

  /**
   * @inheritdoc
   */
  bindEventListener() {
    throw new GenericError('The bindEventListener() is denied on server side.');
  }

  /**
   * @inheritdoc
   */
  unbindEventListener() {
    throw new GenericError(
      'The unbindEventListener() is denied on server side.'
    );
  }
}
// @endif
