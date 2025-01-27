import uid from 'easy-uid';
import { aop, createHook, hookName, createCallTrap } from 'to-aop';

import DevToolManager from './DevToolManager';

const ImaMainModules = [
  'onLoad',
  'getInitialImaConfigFunctions',
  'getNamespace',
  'getInitialPluginConfig',
  'createImaApp',
  'getClientBootConfig',
  'bootClientApp',
  'routeClientApp',
  'reviveClientApp',
];

// eslint-disable-next-line no-unused-vars
function createDevtool(registerHook) {
  $IMA.devtool = $IMA.devtool || {};

  function separatePromisesAndValues(dataMap) {
    let promises = {};
    let values = {};

    if (dataMap === undefined) {
      return { promises, values };
    }

    for (let field of Object.keys(dataMap)) {
      let value = dataMap[field];

      if (value instanceof Promise) {
        promises[field] = value;
      } else {
        values[field] = value;
      }
    }

    return { promises, values };
  }

  function clone(data, deep = 1) {
    if (data === undefined) {
      return 'undefined';
    }

    try {
      return JSON.parse(JSON.stringify(data));
    } catch (e) {
      if (deep === 0) {
        return e.message;
      }

      return Object.keys(data).reduce((result, property) => {
        return (result[property] = clone(data[property], deep - 1));
      }, {});
    }
  }

  function generateState(meta, overrides) {
    if (overrides.state) {
      return overrides.state;
    }

    return {
      args: meta.args,
      payload: meta.payload,
    };
  }

  function emit(identifier, meta, options, overrides = {}) {
    const id = uid();
    const label = overrides.label
      ? overrides.label
      : identifier + ':' + meta.property;
    let state = generateState(meta, overrides);

    let { promises: argsPromise } = separatePromisesAndValues(state.args);
    let { promises: payloadPromise } = separatePromisesAndValues(state.payload);

    const promise = {
      args: argsPromise,
      payload: payloadPromise,
    };
    const stateKeys = ['args', 'payload'];
    let pendingPromises = stateKeys
      .map(key => Object.keys(promise[key]).length)
      .reduce((sum, value) => sum + value, 0);

    stateKeys.map(key => {
      Object.keys(promise[key]).map(property => {
        promise[key][property].then(value => {
          pendingPromises--;
          state[key][property] = value;

          $IMA.devtool.postMessage({
            id,
            label,
            type: meta.property,
            origin: identifier,
            time: new Date().getTime(),
            state: clone(state, 2),
            color: options.color,
            promises: pendingPromises > 0 ? 'pending' : 'resolved',
          });
        });
      });
    });

    if (state.payload instanceof Promise) {
      pendingPromises += 1;

      state.payload.then(value => {
        pendingPromises--;
        state.payload = value;

        $IMA.devtool.postMessage({
          id,
          label,
          type: meta.property,
          origin: identifier,
          time: new Date().getTime(),
          state: clone(state, 2),
          color: options.color,
          promises: pendingPromises > 0 ? 'pending' : 'resolved',
        });
      });
    }

    $IMA.devtool.postMessage({
      id,
      label,
      type: meta.property,
      origin: identifier,
      time: new Date().getTime(),
      state: clone(state, 2),
      color: options.color,
      promises: pendingPromises > 0 ? 'pending' : null,
    });
  }

  function importIMAClass(path, module = null) {
    try {
      const file = $IMA.Loader.importSync(path);
      const key = module ? module : 'default';
      return file[key] ? file[key] : file;
    } catch (e) {
      console.error('[IMA Devtools]', e.message);
    }
  }

  $IMA.Runner.registerPreRunCommand(function () {
    if (!window.__IMA_DEVTOOLS_INIT) {
      return;
    }

    registerHook({
      importIMAClass,
      clone,
      aop,
      createHook,
      hookName,
      createCallTrap,
      emit,
    });

    let revivePattern = createHook(
      hookName.afterMethod,
      'reviveClientApp',
      meta => {
        if (meta.payload && typeof meta.payload.then === 'function') {
          meta.payload.then(page => {
            if (page.app) {
              const oc = page.app.oc;
              $IMA.devtool.oc = oc;
              $IMA.devtool.bootstrap = page.app.bootstrap;

              $IMA.devtool.manager = oc.create(DevToolManager);
              $IMA.devtool.manager.init();
            }
          });
        }
      }
    );

    let imaCore = importIMAClass('@ima/core', true);
    ImaMainModules.forEach(moduleName => {
      const key = `__${moduleName}__`;

      Object.defineProperty(imaCore, key, {
        value: imaCore[moduleName],
        enumerable: false,
        configurable: false,
        writable: false,
      });

      imaCore[key] = imaCore[moduleName];
      imaCore[moduleName] = createCallTrap({
        target: imaCore,
        object: imaCore,
        property: key,
        pattern: revivePattern,
      });
    });
  });
}

// IMA v17 check
$IMA.Runner.registerPreRunCommand(function () {
  try {
    window.__IMA_DEVTOOLS_INIT = true;
    $IMA.Loader.importSync('@ima/core');
  } catch (_) {
    $IMA.devtool.postMessage(
      { message: 'Current IMA.js version is not supported' },
      'ima:devtool:unsupported'
    );
    window.__IMA_DEVTOOLS_INIT = false;
  }
});
