import type { RouteOptions } from '@ima/core';
import {
  ControllerDecorator,
  Dispatcher,
  GenericError,
  MetaManager,
  Settings,
} from '@ima/core';
import * as Helper from '@ima/helpers';
import { toMockedInstance } from 'to-mock';
import { beforeEach, describe, expect, it } from 'vitest';

import { AbstractPureComponent } from '../../component/AbstractPureComponent';
import { BlankManagedRootView } from '../../component/BlankManagedRootView';
import { PageData } from '../AbstractPageRenderer';
import { PageRendererFactory } from '../PageRendererFactory';
import { ServerPageRenderer } from '../ServerPageRenderer';

class DocumentView extends AbstractPureComponent {
  render() {
    return null;
  }
}

const routeOptions: RouteOptions = {
  autoScroll: true,
  documentView: null,
  managedRootView: null,
  onlyUpdate: false,
  viewAdapter: null,
  middlewares: [],
};

const settings = {
  $App: undefined,
  $Debug: true,
  $Env: undefined,
  $Host: undefined,
  $Language: undefined,
  $LanguagePartPath: undefined,
  $Path: undefined,
  $Page: {
    $Render: {
      documentView: DocumentView,
      masterElementId: 'page',
    },
  },
  $Protocol: undefined,
  $Root: undefined,
  $Version: undefined,
} as unknown as Settings;

describe('ServerPageRenderer', () => {
  let pageRenderer: ServerPageRenderer;
  const metaManager = toMockedInstance(MetaManager, {
    getLinks: () => [],
    getMetaNames: () => [],
    getMetaProperties: () => [],
  });
  const controller = toMockedInstance(ControllerDecorator, {
    getMetaManager: () => metaManager,
  });
  const pageRendererFactory = toMockedInstance(PageRendererFactory, {
    getManagedRootView: () => BlankManagedRootView,
  });
  const dispatcher = toMockedInstance(Dispatcher);

  beforeEach(() => {
    pageRenderer = new ServerPageRenderer(
      pageRendererFactory,
      Helper,
      dispatcher,
      settings
    );
  });

  describe('mount method', () => {
    it('should return already sent data to the client', async () => {
      const pageResources = {
        param1: 'param1',
        param2: Promise.resolve('param2'),
      };

      const response = await pageRenderer.mount(
        controller,
        () => null,
        pageResources,
        routeOptions
      );

      expect((response as PageData).documentView).toEqual(
        pageRenderer['_getDocumentView'](routeOptions)
      );
      expect((response as PageData).documentViewProps?.$Utils).toEqual(
        pageRendererFactory.getUtils()
      );
      expect((response as PageData).documentViewProps?.metaManager).toEqual(
        controller.getMetaManager()
      );
      expect((response as PageData).react).toBeTruthy();
      expect((response as PageData).reactDOM).toBeTruthy();
      expect((response as PageData).status).toEqual(controller.getHttpStatus());
      expect((response as PageData).viewAdapter).toEqual(
        pageRenderer['_getViewAdapterElement']()
      );
    });
  });

  describe('update method', () => {
    it('should reject promise with error', async () => {
      let error;

      try {
        await pageRenderer.update();
      } catch (err) {
        error = err;
      } finally {
        expect(error instanceof GenericError).toBeTruthy();
      }
    });
  });
});
