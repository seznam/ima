import { overlayBridge } from '#/utils';

/**
 * Invoked when a RUNTIME error is CAUGHT (e.g. during module init or execution).
 *
 * @param {Error} error
 */
function handleRuntimeError(error: Error): void {
  if (!error) {
    return;
  }

  overlayBridge.init();
  overlayBridge.runtimeError(error);
}

/**
 * Invoked when a module is RE-INIT via "Fast Refresh".
 */
function clearRuntimeErrors(): void {
  overlayBridge.clearRuntimeErrors();
  overlayBridge.destroy();
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

  overlayBridge.init();
  overlayBridge.compileError(webpackErrorMessage);
}

/**
 * Invoked when a new Webpack compilation is started (i.e. HMR rebuild).
 */
function clearCompileError(): void {
  overlayBridge.clearCompileErrors();
  overlayBridge.destroy();
}

export {
  handleRuntimeError,
  clearRuntimeErrors,
  showCompileError,
  clearCompileError
};
