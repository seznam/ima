/**
 * @jest-environment jsdom
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ClientWindow, MetaManager, MetaManagerImpl, Window } from '../../../';
import { PageMetaHandler, IMA_META_DATA_ATTR } from '../PageMetaHandler';

describe('PageMetaHandlerSpec', () => {
  let metaManager: MetaManager,
    window: Window,
    pageMetaHandler: PageMetaHandler;

  beforeEach(() => {
    metaManager = new MetaManagerImpl();
    metaManager.setTitle('Page Title');
    metaManager.setLink('stylesheet', 'https://styles.css');
    metaManager.setMetaProperty('og:title', 'Test Page', {
      with: 'additional-params',
    });
    metaManager.setMetaName('description', 'Test Page', {
      value: 'value',
      invalid: null,
    });

    window = new ClientWindow();
    pageMetaHandler = new PageMetaHandler(window, metaManager);
  });

  afterEach(() => {
    global.document.head.innerHTML = '';
    vi.clearAllMocks();
  });

  describe('handlePreManagedState', () => {
    it('should clear metaManager internal state', () => {
      expect(metaManager.getTitle()).toBe('Page Title');
      expect(metaManager.getLinks()).toHaveLength(1);
      expect(metaManager.getMetaNames()).toHaveLength(1);
      expect(metaManager.getMetaProperties()).toHaveLength(1);

      pageMetaHandler.handlePreManagedState();

      expect(metaManager.getTitle()).toBe('');
      expect(metaManager.getLinks()).toHaveLength(0);
      expect(metaManager.getMetaNames()).toHaveLength(0);
      expect(metaManager.getMetaProperties()).toHaveLength(0);
    });
  });

  describe('handlePostManagedState', () => {
    it('should skip first update for SSR render', () => {
      const ssrMeta = '<meta data-ima-meta="" name="simulated-ssr-meta">';
      document.head.innerHTML = ssrMeta;

      pageMetaHandler.handlePostManagedState();

      expect(document.head.innerHTML).toBe(ssrMeta);

      pageMetaHandler.handlePostManagedState();

      expect(document.head.innerHTML).not.toBe(ssrMeta);
      expect(window.querySelectorAll(`[${IMA_META_DATA_ATTR}]`)).toHaveLength(
        3
      );
    });

    it('should set meta immediately in SPA', () => {
      // @ts-expect-error
      global.window.$IMA = { SPA: true };

      const ssrMeta = '<meta data-ima-meta="" name="simulated-ssr-meta">';
      document.head.innerHTML = ssrMeta;

      pageMetaHandler.handlePostManagedState();

      expect(document.head.innerHTML).not.toBe(ssrMeta);
      expect(window.querySelectorAll(`[${IMA_META_DATA_ATTR}]`)).toHaveLength(
        3
      );
    });

    it('should set meta immediately where they are empty', () => {
      const ssrMeta = '';
      document.head.innerHTML = ssrMeta;

      expect(window.querySelectorAll(`[${IMA_META_DATA_ATTR}]`)).toHaveLength(
        0
      );

      pageMetaHandler.handlePostManagedState();

      expect(document.head.innerHTML).not.toBe(ssrMeta);
      expect(window.querySelectorAll(`[${IMA_META_DATA_ATTR}]`)).toHaveLength(
        3
      );
    });

    it('should render meta tags from meta manager into document.head', () => {
      pageMetaHandler.handlePostManagedState();

      expect(global.document.head.innerHTML).toMatchSnapshot();
      expect(window.querySelectorAll(`[${IMA_META_DATA_ATTR}]`)).toHaveLength(
        3
      );
    });

    it('should update existing meta tags with updated values', () => {
      metaManager.setLink('stylesheet', 'https://new-styles.css');
      metaManager.setMetaProperty('og:title', 'Test Page', {
        with: 'additional-params',
        andWith: 'another-additional-params',
      });
      metaManager.setMetaName('description', 'Test Page', {
        value: null,
      });

      pageMetaHandler.handlePostManagedState();

      expect(global.document.head.innerHTML).toMatchSnapshot();
      expect(window.querySelectorAll(`[${IMA_META_DATA_ATTR}]`)).toHaveLength(
        3
      );
    });

    it('should replace old meta with new set', () => {
      pageMetaHandler.handlePreManagedState();

      metaManager.setLink('preload', 'https://api.com');
      pageMetaHandler.handlePostManagedState();

      expect(global.document.head.innerHTML).toMatchSnapshot();
      expect(window.querySelectorAll(`[${IMA_META_DATA_ATTR}]`)).toHaveLength(
        1
      );
    });
  });
});
