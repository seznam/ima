import { ErrorEventEmitter } from '@ima/dev-utils/dist/ErrorEventEmitter';
import { StatsError } from 'webpack';

import { HMRMessageData } from '#/types';
import { getEventSource, HMRIndicator } from '#/utils';
/**
 * Invoked when a RUNTIME error is CAUGHT (e.g. during module init or execution).
 *
 * @param {Error} error
 */
function handleRuntimeError(error: Error): void {
  if (!error) {
    return;
  }

  window.__IMA_HMR.emit('error', { error, type: 'runtime' });
}

/**
 * Invoked when a module is RE-INIT via "Fast Refresh".
 */
function clearRuntimeErrors(): void {
  window.__IMA_HMR.emit('clear');
}

/**
 * Invoked when an error occurred during a Webpack compilation
 * (NOTE: webpackErrorMessage might be ANSI encoded depending on the integration).
 *
 * @param {string} webpackErrorMessage
 */
function showCompileError(error: StatsError): void {
  if (!error) {
    return;
  }

  window.__IMA_HMR.emit('error', { error, type: 'compile' });
}

/**
 * Invoked when a new Webpack compilation is started (i.e. HMR rebuild).
 */
function clearCompileError(): void {
  window.__IMA_HMR.emit('clear');
}

const hmrIndicator = new HMRIndicator();
window.__IMA_HMR = new ErrorEventEmitter();

window.__IMA_HMR.on('close', async () => {
  console.log('hmr:close');
});

// Add overlay source files
const overlayJs = document.createElement('script');
overlayJs.setAttribute(
  'src',
  'http://localhost:3101/__error-overlay-static/overlay.js'
);

// TODO fixme
// Init error overlay
overlayJs.onload = () => {
  const imaErrorOverlay = document.createElement('ima-error-overlay');
  imaErrorOverlay.setAttribute('public', 'http://localhost:3101/');
  document.body.append(imaErrorOverlay);

  // Connect client to HMR Event source
  getEventSource().addListener('message', (data: HMRMessageData) => {
    // Compile error handler
    if (data.action === 'built') {
      if (Array.isArray(data?.errors) && data?.errors?.length > 0) {
        showCompileError(data.errors[0]);
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

  getEventSource().addListener('error', () => {
    // Show invalid indicator to indicate lost connection
    hmrIndicator.create('invalid');
  });

  getEventSource().addListener('reconnect', () => {
    hmrIndicator.destroy();

    // Reload page to re-initialize disconnected hmr
    location.reload();
  });
};

document.body.append(overlayJs);

export {
  handleRuntimeError,
  clearRuntimeErrors,
  showCompileError,
  clearCompileError,
};
