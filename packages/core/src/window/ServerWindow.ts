/* @if client **
export class ServerWindow {};
/* @else */
import { Window } from './Window';
import { GenericError } from '../error/GenericError';

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
  isClient(): false {
    return false;
  }

  /**
   * @inheritDoc
   */
  isCookieEnabled(): false {
    return false;
  }

  /**
   * @inheritDoc
   */
  hasSessionStorage(): false {
    return false;
  }

  /**
   * @inheritDoc
   */
  setTitle(): never {
    throw new GenericError('The setTitle() is denied on server side.');
  }

  /**
   * @inheritDoc
   */
  getWindow(): undefined {
    return undefined;
  }

  /**
   * @inheritDoc
   */
  getDocument(): undefined {
    return undefined;
  }

  /**
   * @inheritDoc
   */
  getScrollX(): 0 {
    return 0;
  }

  /**
   * @inheritDoc
   */
  getScrollY(): 0 {
    return 0;
  }

  /**
   * @inheritDoc
   */
  scrollTo(): void {
    return;
  }

  /**
   * @inheritDoc
   */
  getDomain(): '' {
    return '';
  }

  /**
   * @inheritDoc
   */
  getHost(): '' {
    return '';
  }

  /**
   * @inheritDoc
   */
  getPath(): '' {
    return '';
  }

  /**
   * @inheritDoc
   */
  getUrl(): '' {
    return '';
  }

  /**
   * @inheritDoc
   */
  getBody(): undefined {
    return undefined;
  }

  /**
   * @inheritDoc
   */
  getElementById(): null {
    return null;
  }

  /**
   * @inheritDoc
   */
  getHistoryState(): undefined {
    return;
  }

  /**
   * @inheritDoc
   */
  querySelector(): null {
    return null;
  }

  /**
   * @inheritDoc
   */
  querySelectorAll<E extends Element = Element>(
    selector: string
  ): NodeListOf<E> {
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

    return new DummyNodeList() as unknown as NodeListOf<E>;
  }

  /**
   * @inheritDoc
   */
  redirect(): void {
    return;
  }

  /**
   * @inheritDoc
   */
  pushState(): void {
    return;
  }

  /**
   * @inheritDoc
   */
  replaceState(): void {
    return;
  }

  /**
   * @inheritDoc
   */
  createCustomEvent<T>(
    name: string,
    options: CustomEventInit<T>
  ): CustomEvent<T> {
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
  bindEventListener(): void {
    return;
  }

  /**
   * @inheritDoc
   */
  unbindEventListener(): void {
    return;
  }
}
// @endif
