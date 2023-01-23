import MetaManager, {
  MetaAttributes,
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

    this.#updateMetaTag<'href'>(
      this.#metaManager.getLinksIterator(),
      'link',
      'href'
    );
    this.#updateMetaTag<'property'>(
      this.#metaManager.getMetaPropertiesIterator(),
      'meta',
      'property'
    );
    this.#updateMetaTag<'content'>(
      this.#metaManager.getMetaNamesIterator(),
      'meta',
      'content'
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
    tagName: 'link' | 'meta',
    valueName: MetaManagerRecordNames
  ): void {
    const document = this.#window.getDocument();

    if (!document) {
      return;
    }

    for (const [key, value] of iterator) {
      const attributes = {
        [tagName === 'link' ? 'rel' : 'name']: key,
        ...(typeof value === 'object' ? value : { [valueName]: value }),
      } as MetaAttributes;

      // TODO IMA@19 - remove backwards compatibility
      const existingMetaTag = this.#window.querySelector(`meta[name="${key}"]`);

      if (existingMetaTag) {
        existingMetaTag.setAttribute(
          valueName,
          attributes[valueName] as string
        );

        continue;
      }

      // TODO IMA@19 - following should be default from IMA@19
      const metaTag = document.createElement(tagName);
      metaTag.setAttribute('data-ima-meta', '');

      for (const [attrName, attrValue] of Object.entries(attributes)) {
        // Skip invalid values
        if (attrValue === undefined || attrValue === null) {
          continue;
        }

        metaTag?.setAttribute(attrName, attrValue.toString());
      }

      document?.head.appendChild(metaTag);
      document.head.innerHTML += 'meta-tagy';
    }
  }
}
