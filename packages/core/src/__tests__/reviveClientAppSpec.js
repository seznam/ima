import React from 'react';
import ReactDOM from 'react-dom';
import jsdom from 'jsdom';
import ControllerInterface from '../controller/Controller';
import AbstractDocumentView from '../page/AbstractDocumentView';
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

const MASTER_ELEMENT_ID = 'some-id';

describe('revive client application', () => {
  let router = null;

  let routerConfig = {
    $Protocol: 'http:',
    $Root: '',
    $LanguagePartPath: '',
    $Host: 'www.domain.com',
  };

  function View() {
    return React.createElement('div', {});
  }

  class DocumentView extends AbstractDocumentView {
    static get masterElementId() {
      return MASTER_ELEMENT_ID;
    }
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

  let options = {
    onlyUpdate: false,
    autoScroll: true,
    allowSPA: true,
    documentView: DocumentView,
  };

  function propagateToGlobal(win) {
    const forbiddenKeys = ['localStorage', 'sessionStorage'];

    for (let key of Object.keys(win)) {
      if (forbiddenKeys.includes(key)) {
        return;
      }

      global[key] = global[key] ? global[key] : win[key];
    }
  }

  beforeAll(done => {
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
    global.window.scrollTo = () => {};

    jest.spyOn(ReactDOM, 'render');

    done();
  });

  it('revive client app', done => {
    let bootConfig = Object.assign(
      {
        initServicesApp: () => {},
        initBindApp: () => {},
        initRoutes: () => {},
        initSettings: () => {
          return {
            prod: {
              $Http: {},
              $Page: {
                $Render: {},
              },
            },
          };
        },
      },
      {
        initBindApp: (ns, oc) => {
          router = oc.get('$Router');
          router.init(routerConfig);
          router.add('reviveClientApp', '/', Controller, View, options);

          oc.inject(Controller, []);

          if (!oc.has('$Utils')) {
            oc.constant('$Utils', {});
          }
        },
      }
    );

    ima
      .reviveClientApp(bootConfig)
      .then(response => {
        expect(response.status).toBe(200);
        expect(response.pageState).toStrictEqual({ hello: 'Hello' });
        expect(response.content).toBeNull();
        expect(ReactDOM.render).toHaveBeenCalled();
        done();
      })
      .catch(error => {
        done(error);
      });
  });
});
