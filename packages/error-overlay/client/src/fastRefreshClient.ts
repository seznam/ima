import { createOverlayIframe, overlayBridge } from '#/utils';

let iframe: HTMLIFrameElement | null = null;
let errorCount = 0;

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

  errorCount++;
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

  errorCount++;
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

  // if (errorCount > 0) {
  //   window.location.reload();
  //   errorCount = 0;
  // }
}

export {
  handleRuntimeError,
  clearRuntimeErrors,
  showCompileError,
  clearCompileError
};
