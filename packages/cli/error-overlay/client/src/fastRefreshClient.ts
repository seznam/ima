import { createOverlayIframe } from './utils/overlayUtils';
import { overlayBridge } from './utils/OverlayBridge';

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
  init();

  overlayBridge.sendRuntimeError(error);

  console.log('handleRuntimeError');
}

/**
 * Invoked when a module is RE-INIT via "Fast Refresh".
 */
function clearRuntimeErrors(): void {
  overlayBridge.clearErrors();
  console.log('clearRuntimeErrors');
}

/**
 * Invoked when an error occurred during a Webpack compilation
 * (NOTE: webpackErrorMessage might be ANSI encoded depending on the integration).
 *
 * @param {string} webpackErrorMessage
 */
function showCompileError(webpackErrorMessage: string): void {
  init();

  overlayBridge.sendCompileError(webpackErrorMessage);
  console.log('showCompileError', webpackErrorMessage);
}

/**
 * Invoked when a new Webpack compilation is started (i.e. HMR rebuild).
 */
function clearCompileError(): void {
  overlayBridge.clearErrors();
  console.log('clearCompileError');
}

export {
  handleRuntimeError,
  clearRuntimeErrors,
  showCompileError,
  clearCompileError
};
