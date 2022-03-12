import { ErrorEventEmitter } from '@ima/dev-utils/dist/ErrorEventEmitter';

import { HMROptions, HMRMessageData } from '#/types';
import { HMREventSource, HMRIndicator } from '#/utils';

// Parse hmr options from webpack resource query
// @ts-expect-error yeah I don't know how to type this...
const options = Object.fromEntries(
  new URLSearchParams(__resourceQuery)
) as HMROptions;

/**
 * Initialize HMR client with indication, event emitter api
 * and event source listener
 */
const hmrIndicator = new HMRIndicator();
const eventSource = new HMREventSource(options.publicUrl);
window.__IMA_HMR = new ErrorEventEmitter();

// Create overlay.js script file which loads error overlay
const overlayJs = document.createElement('script');
overlayJs.setAttribute(
  'src',
  `${options.publicUrl}/__error-overlay-static/overlay.js`
);

// Init error overlay on source load
overlayJs.onload = () => {
  // Create and append the custom <ima-error-overlay /> element
  const imaErrorOverlay = document.createElement('ima-error-overlay');
  imaErrorOverlay.setAttribute('public-url', options.publicUrl);
  document.body.appendChild(imaErrorOverlay);

  // Connect client to HMR Event source
  eventSource.addListener('message', (data: HMRMessageData) => {
    // Compile error handler
    if (data.action === 'built') {
      if (Array.isArray(data?.errors) && data?.errors?.length > 0) {
        window.__IMA_HMR.emit('error', {
          error: data.errors[0],
          type: 'compile',
        });
      } else {
        window.__IMA_HMR.emit('clear');
      }
    }

    // Show loading indicator
    if (data.action === 'building') {
      hmrIndicator.create('loading');
    } else {
      hmrIndicator.destroy();
    }
  });

  // Show invalid indicator to indicate lost connection
  eventSource.addListener('error', () => {
    console.log('ERROR');

    hmrIndicator.create('invalid');
  });

  // Reload page to re-initialize disconnected hmr
  eventSource.addListener('reconnect', () => {
    location.reload();
  });
};

// Add overlay source files to the document
document.body.appendChild(overlayJs);
