import { ErrorOverlayEmitter } from '@ima/dev-utils/dist/ErrorOverlayEmitter';

import { HMROptions, HMRMessageData } from '@/types';
import { HMREventSource, HMRIndicator } from '@/utils';

// Parse hmr options from webpack resource query
const options = Object.fromEntries(
  new URLSearchParams(__resourceQuery)
) as unknown as HMROptions;

/**
 * Initialize HMR client with indication, event emitter api
 * and event source listener
 */
const hmrIndicator = new HMRIndicator();
const eventSource = new HMREventSource(options.publicUrl);
window.__IMA_HMR = new ErrorOverlayEmitter();

// Init overlay.js script file which loads error overlay
const overlayJs = document.createElement('script');
overlayJs.setAttribute(
  'src',
  `${options.publicUrl}/__error-overlay-static/js/overlay.js`
);

// Init error overlay on source load
overlayJs.onload = () => {
  // Create and append the custom <ima-error-overlay /> element
  const imaErrorOverlay = document.createElement('ima-error-overlay');
  imaErrorOverlay.setAttribute('public-url', options.publicUrl);
  document.body.appendChild(imaErrorOverlay);

  // Track compile errors state so we know when to call emit('clear') event.
  let hadCompileErrors = false;

  // Connect client to HMR Event source
  eventSource.addListener('message', (data: HMRMessageData) => {
    // Compile error handler
    if (data.action === 'built') {
      if (Array.isArray(data?.errors) && data?.errors?.length > 0) {
        hadCompileErrors = true;
        window.__IMA_HMR.emit('error', {
          error: data.errors[0],
          type: 'compile',
        });
      } else {
        // Clear only when there were any compile errors previously
        if (hadCompileErrors) {
          window.__IMA_HMR.emit('clear');
        }

        hadCompileErrors = false;
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
    hmrIndicator.create('invalid');
  });

  // Reload page to re-initialize disconnected hmr
  eventSource.addListener('reconnect', () => {
    location.reload();
  });
};

// Add overlay source files to the document
document.body.appendChild(overlayJs);
