import { StatsError } from 'webpack';

import { getOverlayBridge, getEventSource, HMRIndicator } from '#/utils';

const overlayBridge = getOverlayBridge();

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
}

/**
 * Invoked when an error occurred during a Webpack compilation
 * (NOTE: webpackErrorMessage might be ANSI encoded depending on the integration).
 *
 * @param {string} webpackErrorMessage
 */
function showCompileErrors(errors: StatsError[]): void {
  if (!Array.isArray(errors) || errors.length === 0) {
    return;
  }

  overlayBridge.init();
  overlayBridge.compileError(errors);
}

/**
 * Invoked when a new Webpack compilation is started (i.e. HMR rebuild).
 */
function clearCompileError(): void {
  overlayBridge.clearCompileErrors();
}

const hmrIndicator = new HMRIndicator();

// Connect client to HMR Event source
getEventSource().addListener(data => {
  // Compile error handler
  if (data.action === 'built') {
    if (Array.isArray(data?.errors) && data?.errors?.length > 0) {
      showCompileErrors(data.errors);
    } else {
      clearCompileError();
    }
  }

  // Show loading indicator
  if (data.action === 'building') {
    hmrIndicator.create('loading');
  } else {
    hmrIndicator.destroy();
  }
});

getEventSource().addErrorListener(() => {
  // Show invalid indicator to indicate lost connection
  hmrIndicator.create('invalid');
});

export {
  handleRuntimeError,
  clearRuntimeErrors,
  showCompileErrors,
  clearCompileError,
};
