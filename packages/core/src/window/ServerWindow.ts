/* @if client **
export class ServerWindow {};
/* @else */
import { Window } from './Window';
import { GenericError } from '../error/GenericError';
import { UnknownParameters } from '../types';

/**
 * Server-side implementation of the `Window` utility API.
 */
export class ServerWindow extends Window {
  static get $dependencies() {
    return [];
  }

  /**
   * @inheritDoc
   */
  isClient() {
    return false;
  }

  /**
   * @inheritDoc
   */
  isCookieEnabled() {
    return false;
  }

  /**
   * @inheritDoc
   */
  hasSessionStorage() {
    return false;
  }

  /**
   * @inheritDoc
   */
  setTitle() {
    throw new GenericError('The setTitle() is denied on server side.');
  }

  /**
   * @inheritDoc
   */
  getWindow() {
    return undefined;
  }

  /**
   * @inheritDoc
   */
  getDocument() {
    return undefined;
  }

  /**
   * @inheritDoc
   */
  getScrollX() {
    return 0;
  }

  /**
   * @inheritDoc
   */
  getScrollY() {
    return 0;
  }

  /**
   * @inheritDoc
   */
  scrollTo() {
    return;
  }

  /**
   * @inheritDoc
   */
  getDomain() {
    return '';
  }

  /**
   * @inheritDoc
   */
  getHost() {
    return '';
  }

  /**
   * @inheritDoc
   */
  getPath() {
    return '';
  }

  /**
   * @inheritDoc
   */
  getUrl() {
    return '';
  }

  /**
   * @inheritDoc
   */
  getBody() {
    return undefined;
  }

  /**
   * @inheritDoc
   */
  getElementById() {
    return null;
  }

  /**
   * @inheritDoc
   */
  getHistoryState() {
    return {};
  }

  /**
   * @inheritDoc
   */
  querySelector() {
    return null;
  }

  /**
   * @inheritDoc
   */
  querySelectorAll(_selector: string) {
    class DummyNodeList extends NodeList {
      length: number;
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
   * @inheritDoc
   */
  redirect() {
    return;
  }

  /**
   * @inheritDoc
   */
  pushState() {
    return;
  }

  /**
   * @inheritDoc
   */
  replaceState() {
    return;
  }

  /**
   * @inheritDoc
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
   * @inheritDoc
   */
  bindEventListener() {
    return;
  }

  /**
   * @inheritDoc
   */
  unbindEventListener() {
    return;
  }
}
// @endif
