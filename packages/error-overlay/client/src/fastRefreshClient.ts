import { createOverlayIframe, overlayBridge } from '#/utils';

let iframe: HTMLIFrameElement | null = null;

function init() {
  if (iframe) {
    return;
  }

  iframe = createOverlayIframe();
  overlayBridge.init(iframe);
}

/**
 * Invoked when a RUNTIME error is CAUGHT (e.g. during module init or execution).
 *
 * @param {Error} error
 */
function handleRuntimeError(error: Error): void {
  if (!error) {
    return;
  }

  init();

  overlayBridge.runtimeError(error);
  // eslint-disable-next-line no-console
  console.count('handleRuntimeError');
}

/**
 * Invoked when a module is RE-INIT via "Fast Refresh".
 */
function clearRuntimeErrors(): void {
  overlayBridge.clearRuntimeErrors();
  // eslint-disable-next-line no-console
  console.count('clearRuntimeErrors');

  if (module.hot) {
    module.hot.addStatusHandler(status => {
      if (status === 'apply') {
        window.location.reload();
      }
    });
  }
}

/**
 * Invoked when an error occurred during a Webpack compilation
 * (NOTE: webpackErrorMessage might be ANSI encoded depending on the integration).
 *
 * @param {string} webpackErrorMessage
 */
function showCompileError(webpackErrorMessage: string): void {
  if (!webpackErrorMessage) {
    return;
  }

  init();

  overlayBridge.compileError(webpackErrorMessage);
  // eslint-disable-next-line no-console
  console.log('showCompileError', webpackErrorMessage);
}

/**
 * Invoked when a new Webpack compilation is started (i.e. HMR rebuild).
 */
function clearCompileError(): void {
  overlayBridge.clearCompileErrors();
  // eslint-disable-next-line no-console
  console.count('clearCompileError');

  if (module.hot) {
    module.hot.addStatusHandler(status => {
      if (status === 'apply') {
        window.location.reload();
      }
    });
  }
}

export {
  handleRuntimeError,
  clearRuntimeErrors,
  showCompileError,
  clearCompileError
};
