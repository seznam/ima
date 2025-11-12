/**
 * @jest-environment jsdom
 */

import {
  AbstractPureComponent,
  defaultCssClasses as cssClassNameProcessor,
  PageRendererFactory,
} from '@ima/react-page-renderer';
import { ClientPageRenderer } from '@ima/react-page-renderer/renderer/ClientPageRenderer';
import React from 'react';

import {
  AbstractController,
  getNamespace,
  ObjectContainer,
  Router,
  reviveClientApp,
  PageRenderer,
  ComponentUtils,
  ClientWindow,
  Window,
} from '../index';

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

  const routerConfig = {
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

  const options = {
    onlyUpdate: false,
    autoScroll: true,
    documentView: DocumentView,
  };

  beforeAll(() => {
    const viewContainer = document.createElement('div');
    viewContainer.id = MASTER_ELEMENT_ID;

    document.body.innerHTML = '';
    document.body.appendChild(viewContainer);

    global.$IMA = Object.assign({}, global.$IMA || {}, routerConfig, {
      $Env: 'prod',
      $Version: 1,
    });

    global.window.$IMA = global.$IMA;
    global.window.$Debug = global.$Debug;

    //mock
    global.window.scrollTo = () => {
      return;
    };
  });

  it('revive client app', async () => {
    const bootConfig = Object.assign(
      {
        initServicesApp: () => {
          return;
        },
        initRoutes: () => {
          return;
        },
        initSettings: () => {
          return {
            prod: {
              $Http: {},
              $Router: {
                middlewareTimeout: 30000,
              },
              $Page: {
                $Render: {
                  masterElementId: MASTER_ELEMENT_ID,
                },
              },
            },
          };
        },
      },
      {
        initBindApp: (
          ns: ReturnType<typeof getNamespace>,
          oc: ObjectContainer
        ) => {
          oc.provide(Window, ClientWindow);

          oc.bind('$Window', Window);

          // @ts-expect-error
          oc.bind('$CssClasses', function () {
            return cssClassNameProcessor;
          });

          (oc.get(ComponentUtils) as ComponentUtils).register({
            $CssClasses: '$CssClasses',
          });

          oc.inject(PageRendererFactory, [ComponentUtils]);
          // @ts-expect-error
          oc.bind('$PageRendererFactory', PageRendererFactory);

          global.$Debug = false;
          oc.provide(PageRenderer, ClientPageRenderer, [
            PageRendererFactory,
            '$Helper',
            '$Dispatcher',
            '$Settings',
            Window,
          ]);
          global.$Debug = true;

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

    // @ts-expect-error
    const response = await reviveClientApp(bootConfig);

    expect(response.status).toBe(200);
  });
});
