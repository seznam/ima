import MetaManager, {
  MetaManagerRecord,
  MetaManagerRecordNames,
} from '../../meta/MetaManager';
import Window from '../../window/Window';
import { ManagedPage } from '../PageTypes';
import PageHandler from './PageHandler';

export default class PageMetaHandler extends PageHandler {
  #window: Window;
  #metaManager: MetaManager;

  static get $dependencies() {
    return [Window, MetaManager];
  }

  constructor(window: Window, metaManager: MetaManager) {
    super();

    this.#window = window;
    this.#metaManager = metaManager;
  }

  /**
   * @inheritDoc
   */
  handlePostManagedState(managedPage: ManagedPage | null) {
    if (!managedPage?.decoratedController) {
      return;
    }

    const { decoratedController } = managedPage;

    decoratedController.setMetaParams(decoratedController.getState());
    this.#metaManager.clearMetaAttributes();
    this._updateMetaAttributes();
  }

  /**
   * Update specified meta or link tags in DOM.
   *
   * @param metaManager meta attributes storage providing the
   *        new values for page meta elements and title.
   */
  private _updateMetaAttributes() {
    this.#window.setTitle(this.#metaManager.getTitle());

    // Remove IMA managed meta tags
    this.#window
      .querySelectorAll(`[data-ima-meta]`)
      .forEach(el => (el as HTMLElement)?.remove());

    // Update meta tags
    this.#updateMetaTag<'href'>(this.#metaManager.getLinksIterator(), 'link');
    this.#updateMetaTag<'property'>(
      this.#metaManager.getMetaPropertiesIterator(),
      'meta'
    );
    this.#updateMetaTag<'content'>(
      this.#metaManager.getMetaNamesIterator(),
      'meta'
    );
  }

  /**
   * Helper to update specific meta tags in page document.
   *
   * @param iterator Collection of meta records to update.
   * @param tagName Tag name for the given collection.
   * @param valueName Name of the main value for given meta collection.
   */
  #updateMetaTag<R extends MetaManagerRecordNames>(
    iterator: IterableIterator<[string, MetaManagerRecord<R>]> | never[],
    tagName: 'link' | 'meta'
  ): void {
    const document = this.#window.getDocument()!;

    for (const [key, value] of iterator) {
      const attributes = {
        [tagName === 'link' ? 'rel' : 'name']: key,
        ...value,
      };

      const metaTag = document.createElement(tagName);
      metaTag.setAttribute('data-ima-meta', '');

      for (const [attrName, attrValue] of Object.entries(attributes)) {
        // Skip empty values
        if (attrValue === undefined || attrValue === null) {
          continue;
        }

        metaTag?.setAttribute(attrName, attrValue.toString());
      }

      document?.head.appendChild(metaTag);
    }
  }
}
