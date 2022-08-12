import React from 'react';
import ControllerInterface from '../controller/Controller';
import ServerPageRenderer from '../page/renderer/ServerPageRenderer';
import Response from '../router/Response';
import * as ima from '../index';

jest.mock('fs');
jest.mock('path', () => {
  const original = jest.requireActual('path');
  const resolve = (...args) => {
    if (args[1] === undefined && args[0] === '@ima/core') {
      return original.join(process.cwd(), 'index.js');
    }

    return original.resolve(...args);
  };

  return Object.assign({}, original, { resolve });
});

describe('render server application', () => {
  let router = null;
  let ReactDOM = {
    render() {
      return {
        setState: () => {},
      };
    },
  };
  let expressReponse = {
    send() {},
    status() {},
  };

  let routerConfig = {
    $Protocol: 'http:',
    $Root: '',
    $LanguagePartPath: '',
    $Host: 'www.domain.com',
  };

  let options = {
    onlyUpdate: false,
    autoScroll: true,
    allowSPA: true,
    documentView: null,
  };

  function View() {
    return React.createElement('div', {});
  }

  class Controller extends ControllerInterface {
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

  beforeAll(done => {
    let app = ima.createImaApp();
    let bootConfig = ima.getClientBootConfig(
      Object.assign(
        {
          initServicesApp: (ns, oc) => {
            oc.get(Response).init(expressReponse);
          },
          initBindApp: () => {},
          initRoutes: () => {},
        },
        {
          initBindApp: (ns, oc) => {
            router = oc.get('$Router');
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
        }
      )
    );
    ima.bootClientApp(app, bootConfig);

    spyOn(ReactDOM, 'render');

    done();
  });

  it('should response with status code 200, content null and pageState', done => {
    spyOn(
      ServerPageRenderer.prototype,
      '_renderPageContentToString'
    ).and.returnValue('html');

    router
      .route('/reviveClientApp')
      .then(response => {
        expect(response.status).toBe(200);
        expect(response.content).toBe('html');
        expect(response.pageState).toStrictEqual({ hello: 'Hello' });
        done();
      })
      .catch(error => {
        done(error);
      });
  });
});
