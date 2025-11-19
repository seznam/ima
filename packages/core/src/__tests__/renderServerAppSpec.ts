/**
 * @jest-environment jsdom
 */

import {
  defaultCssClasses as cssClassNameProcessor,
  PageRendererFactory,
  ServerPageRenderer,
  AbstractPureComponent,
} from '@ima/react-page-renderer';
import { Response as ExpressResponse } from 'express';
import React from 'react';

import {
  AbstractController,
  bootClientApp,
  Cache,
  ComponentUtils,
  createImaApp,
  getClientBootConfig,
  getNamespace,
  ObjectContainer,
  PageRenderer,
  Router,
} from '../index';
import { Response } from '../router/Response';

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

describe('render server application', () => {
  let router: Router;
  const ReactDOM = {
    render() {
      return {
        setState: () => {
          return;
        },
      };
    },
  };
  const expressResponse = {
    send() {
      return;
    },
    status() {
      return;
    },
  };

  $IMA.$Protocol = 'http:';
  $IMA.$Host = 'localhost';

  const routerConfig = {
    $Protocol: 'http:',
    $Root: '',
    $LanguagePartPath: '',
    $Host: 'localhost',
  };

  class DocumentView extends AbstractPureComponent {
    render() {
      return null;
    }
  }

  const options = {
    onlyUpdate: false,
    autoScroll: true,
    documentView: DocumentView,
  };

  function View() {
    return React.createElement('div', {});
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

  beforeAll(async () => {
    const app = createImaApp();
    const bootConfig = getClientBootConfig({
      initServicesApp: (
        ns: ReturnType<typeof getNamespace>,
        oc: ObjectContainer
      ) => {
        (oc.get(Response) as Response).init(
          expressResponse as unknown as ExpressResponse
        );
      },
      initRoutes: () => {
        return;
      },
      initBindApp: (
        ns: ReturnType<typeof getNamespace>,
        oc: ObjectContainer
      ) => {
        oc.bind('$CssClasses', function () {
          return cssClassNameProcessor;
        });

        (oc.get(ComponentUtils) as ComponentUtils).register({
          $CssClasses: '$CssClasses',
        });

        oc.inject(PageRendererFactory, [ComponentUtils]);
        oc.bind('$PageRendererFactory', PageRendererFactory);

        global.$Debug = false;
        oc.provide(PageRenderer, ServerPageRenderer, [
          PageRendererFactory,
          '$Helper',
          '$Dispatcher',
          '$Settings',
          Cache,
        ]);
        global.$Debug = true;

        oc.bind('$PageRenderer', PageRenderer);

        router = oc.get('$Router') as Router;
        router.init(routerConfig);
        router.add(
          'reviveClientApp',
          '/reviveClientApp',
          Controller,
          View,
          options
        );

        oc.inject(Controller, []);

        if (!oc.has('$Utils')) {
          oc.constant('$Utils', {});
        }
      },
      // @ts-expect-error This is intentional
      settings: {
        $Http: {
          cacheOptions: {},
        },
        $Router: {
          middlewareTimeout: 30000,
        },
        $Page: {
          $Render: {
            masterElementId: 'id',
          },
        },
      },
    });

    await bootClientApp(app, bootConfig);

    jest
      .spyOn(ReactDOM, 'render')
      .mockImplementation(() => ({ setState: () => undefined }));
  });

  it('should response with status code 200 and page state', async () => {
    const response = await router.route('/reviveClientApp');

    expect(response?.status).toBe(200);
  });
});
