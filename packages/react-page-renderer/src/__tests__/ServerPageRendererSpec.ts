/* eslint-disable @typescript-eslint/ban-ts-comment */

import { TextEncoder, TextDecoder } from 'util';

globalThis.TextEncoder = TextEncoder;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
globalThis.TextDecoder = TextDecoder;

import {
  Cache,
  ControllerDecorator,
  Dispatcher,
  GenericError,
  MetaManager,
} from '@ima/core';
import * as Helper from '@ima/helpers';
import { toMockedInstance } from 'to-mock';

import { RouteOptions, Settings } from '@/types';

import AbstractPureComponent from '../AbstractPureComponent';
import BlankManagedRootView from '../BlankManagedRootView';
import PageRendererFactory from '../PageRendererFactory';
import ServerPageRenderer from '../ServerPageRenderer';

globalThis.$Debug = true;

class DocumentView extends AbstractPureComponent {
  render() {
    return null;
  }
}

const routeOptions = {
  autoScroll: false,
  allowSPA: false,
} as RouteOptions;

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
} as Settings;

describe('ServerPageRenderer', () => {
  let pageRenderer: ServerPageRenderer;
  const metaManager = toMockedInstance(MetaManager, {
    getLinks: () => [],
    getMetaNames: () => [],
    getMetaProperties: () => [],
  });
  const cache = toMockedInstance(Cache);
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
      settings,
      cache
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

      expect(response.documentView).toEqual(
        pageRenderer['_getDocumentView'](routeOptions)
      );
      expect(response.documentViewProps.$Utils).toEqual(
        pageRendererFactory.getUtils()
      );
      expect(response.documentViewProps.metaManager).toEqual(
        controller.getMetaManager()
      );
      expect(response.react).toBeTruthy();
      expect(response.reactDOM).toBeTruthy();
      expect(response.settings).toEqual(settings);
      expect(response.status).toEqual(controller.getHttpStatus());
      expect(response.viewAdapter).toEqual(
        pageRenderer['_getViewAdapterElement']()
      );
    });
  });

  describe('update method', () => {
    it('should reject promise with error', async () => {
      try {
        await pageRenderer.update();
      } catch (error) {
        expect(error instanceof GenericError).toBeTruthy();
      }
    });
  });
});
