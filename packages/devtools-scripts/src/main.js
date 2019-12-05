import { aop, createHook, hookName, createCallTrap } from 'to-aop';
import uid from 'easy-uid';
import DevToolManager from './DevToolManager';

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
      payload: meta.payload
    };
  }

  //eslint-disable-line no-undef
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
      payload: payloadPromise
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
            promises: pendingPromises > 0 ? 'pending' : 'resolved'
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
          promises: pendingPromises > 0 ? 'pending' : 'resolved'
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
      promises: pendingPromises > 0 ? 'pending' : null
    });
  }

  function importIMAClass(path) {
    try {
      const file = $IMA.Loader.importSync(path);

      return file.default ? file.default : file;
    } catch (_) {
      let ima;

      // for older IMA app which haven't got some classes
      try {
        ima = $IMA.Loader.importSync('ima');
      } catch (_) {
        return {};
      }

      if (path === 'ima/main') {
        return ima;
      }

      let parts = path.split('/');
      return ima[parts[parts.length - 1]] || {};
    }
  }

  $IMA.Runner.registerPreRunCommand(function() {
    registerHook({
      importIMAClass,
      aop,
      createHook,
      hookName,
      createCallTrap,
      emit
    });

    // TODO CHANGE FOR IMA@17
    let imaMain = importIMAClass('ima/main');

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

    Object.keys(imaMain).forEach(property => {
      const key = `__${property}__`;
      Object.defineProperty(imaMain, key, {
        value: imaMain[property],
        enumerable: false,
        configurable: false,
        writable: false
      });
      imaMain[key] = imaMain[property];
      imaMain[property] = createCallTrap({
        target: imaMain,
        object: imaMain,
        property: key,
        pattern: revivePattern
      });
    });
  });
}
