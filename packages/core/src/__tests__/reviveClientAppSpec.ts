import { TextEncoder, TextDecoder } from 'util';

globalThis.TextEncoder = TextEncoder;
// @ts-ignore
globalThis.TextDecoder = TextDecoder;

import React from 'react';
import jsdom from 'jsdom';
import {
  AbstractPureComponent,
  defaultCssClasses as cssClassNameProcessor,
  PageRendererFactory,
} from '@ima/react-page-renderer';
import ClientPageRenderer from '@ima/react-page-renderer/dist/esm/client/LegacyClientPageRenderer';
import { AbstractController, getNamespace, ObjectContainer, Router, reviveClientApp, PageRenderer, ComponentUtils, ClientWindow, Window as ImaWindow } from '../index';

jest.mock('fs');
jest.mock('path', () => {
  const original = jest.requireActual('path');
  const resolve = (...args: unknown[]) => {
    if (args[1] === undefined && args[0] === '@ima/core') {
      return original.join(process.cwd(), 'index.js');
    }

    return original.resolve(...args);
  };

  return Object.assign({}, original, { resolve });
});

const MASTER_ELEMENT_ID = 'some-id';

describe('revive client application', () => {
  let router = null;

  let routerConfig = {
    $Protocol: 'http:',
    $Root: '',
    $LanguagePartPath: '',
    $Host: 'localhost',
  };

  function View() {
    return React.createElement('div', {});
  }

  class DocumentView extends AbstractPureComponent {
    render() {
      return null;
    }
  }

  class Controller extends AbstractController {
    getHttpStatus() {
      return 200;
    }

    getExtensions() {
      return [];
    }

    load() {
      return { hello: 'Hello' };
    }
  }

  let options = {
    onlyUpdate: false,
    autoScroll: true,
    allowSPA: true,
    documentView: DocumentView,
  };

  function propagateToGlobal(win: Window) {
    const forbiddenKeys = ['localStorage', 'sessionStorage'];

    for (let key of Object.keys(win)) {
      if (forbiddenKeys.includes(key)) {
        return;
      }

      // @ts-ignore
      global[key] = global[key] ? global[key] : win[key];
    }
  }

  beforeAll(() => {
    let doc = Reflect.construct(jsdom.JSDOM, [
      `<!DOCTYPE html><html><head></head><body><div id="${MASTER_ELEMENT_ID}"></div></body></html>`,
    ]);

    propagateToGlobal(doc.window);

    global.$IMA = Object.assign({}, global.$IMA || {}, routerConfig, {
      $Env: 'prod',
      $Version: 1,
    });

    global.document = doc.window.document;
    global.window = doc.window;
    global.window.$IMA = global.$IMA;
    global.window.$Debug = global.$Debug;
    doc.reconfigure({
      url: `${routerConfig.$Protocol}//${routerConfig.$Host}`,
    });

    //mock
    global.window.scrollTo = () => { };
  });

  it('revive client app', async () => {
    let bootConfig = Object.assign(
      {
        initServicesApp: () => { },
        initRoutes: () => { },
        initSettings: () => {
          return {
            prod: {
              $Http: {},
              $Page: {
                $Render: {
                  masterElementId: MASTER_ELEMENT_ID
                },
              },
            },
          };
        },
      },
      {
        initBindApp: (ns: ReturnType<typeof getNamespace>,
          oc: ObjectContainer) => {
          oc.provide(ImaWindow, ClientWindow);

          oc.bind('$Window', ImaWindow);

          oc.bind('$CssClasses', function () {
            return cssClassNameProcessor;
          });

          (oc.get(ComponentUtils) as ComponentUtils).register({
            $CssClasses: '$CssClasses',
          });

          oc.inject(PageRendererFactory, [ComponentUtils]);
          oc.bind('$PageRendererFactory', PageRendererFactory);

          oc.provide(PageRenderer, ClientPageRenderer, [
            PageRendererFactory,
            '$Helper',
            '$Dispatcher',
            '$Settings',
            Window,
          ]);

          oc.bind('$PageRenderer', PageRenderer);

          router = oc.get('$Router') as Router;
          router.init(routerConfig);
          router.add('reviveClientApp', '/', Controller, View, options);

          oc.inject(Controller, []);

          if (!oc.has('$Utils')) {
            oc.constant('$Utils', {});
          }
        },
      }
    );

    const response = await reviveClientApp(bootConfig)

    expect(response.status).toBe(200);
    expect(response.pageState).toStrictEqual({ hello: 'Hello' });
    expect(response.content).toBeNull();
  });
});
