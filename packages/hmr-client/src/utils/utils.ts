import { getEventSource, HMRMessageData } from './EventSourceWrapper';
import { HMREmitter } from './HMREmitter';
import { getIndicator } from './IndicatorWrapper';
import { logger } from './Logger';

const FAILURE_STATUSES = ['abort', 'fail'];
const HMR_DOCS_URL = 'https://webpack.js.org/concepts/hot-module-replacement/';

export interface HMROptions {
  name: 'server' | 'client' | 'client.es';
  port: number;
  hostname: string;
  publicUrl: string;
}

/**
 * Parses options provided through webpack import query with defaults.
 */
export function parseOptions(): HMROptions {
  return Object.fromEntries(
    new URLSearchParams(__resourceQuery)
  ) as unknown as HMROptions;
}

/**
 * Initializes EventSource, Indicator icon, ErrorOverlay and it's emitter.
 */
export function init() {
  const options = parseOptions();
  const overlayScriptEl = document.createElement('script');

  // Init ErrorOverlay
  overlayScriptEl.setAttribute(
    'src',
    `${options.publicUrl}/__error-overlay-static/js/overlay.js`
  );
  overlayScriptEl.onload = () => {
    const imaErrorOverlay = document.createElement('ima-error-overlay');
    imaErrorOverlay.setAttribute('public-url', options.publicUrl);
    document.body.appendChild(imaErrorOverlay);
  };

  return {
    options,
    eventSource: getEventSource(options),
    indicator: getIndicator(),
    emitter: new HMREmitter(),
  };
}

/**
 * Compares given hash with current webpack compilation hash. This let's
 * us know if we are up to date with all hot updates with current compilation.
 */
export const isUpToDate = (() => {
  let lastHash = __webpack_hash__;

  return (hash?: HMRMessageData['hash']) => {
    if (hash) {
      lastHash = hash;
    }

    return lastHash === __webpack_hash__;
  };
})();

/**
 * Based on:
 *
 * - https://github.com/webpack/webpack/blob/main/hot/log-apply-result.js
 * - https://github.com/webpack-contrib/webpack-hot-middleware/blob/master/client.js
 */
export async function processUpdate(
  hash: HMRMessageData['hash'],
  moduleMap: HMRMessageData['modules'],
  options: HMROptions
) {
  try {
    // Check for updates
    const updatedModules = await module.hot?.check();

    if (!updatedModules) {
      logger.warn('Cannot find update. Need to do a full reload!');
      logger.warn('(Probably because of restarting the webpack-dev-server)');

      return window.location.reload();
    }

    // Apply changes to modules
    const renewedModules = await module.hot?.apply({
      ignoreUnaccepted: true,
      ignoreDeclined: true,
      ignoreErrored: true,
      onUnaccepted: data => {
        logger.warn(
          'Ignored an update to unaccepted module ' + data.chain?.join(' -> ')
        );
      },
      onDeclined: data => {
        logger.warn(
          'Ignored an update to declined module ' + data.chain?.join(' -> ')
        );
      },
      onErrored: data => {
        logger.error(data.error);
        logger.warn(
          'Ignored an error while updating module ' +
            data.moduleId +
            ' (' +
            data.type +
            ')'
        );
      },
    });

    const unacceptedModules = updatedModules.filter(moduleId => {
      return renewedModules && renewedModules.indexOf(moduleId) < 0;
    });

    // Log unaccepted modules info
    if (unacceptedModules.length > 0) {
      logger.warn(
        `[HMR] The following modules couldn't be hot updated: (Full reload needed)\nThis is usually because the modules which have changed (and their parents) do not know how to hot reload themselves. See ${HMR_DOCS_URL} for more details.`
      );

      logger.group('Unaccepted modules:');
      unacceptedModules.forEach(module => console.log(module));
      console.groupEnd();

      return window.location.reload();
    }

    // Log updated modules info
    if (!renewedModules || renewedModules.length === 0) {
      logger.info('Nothing hot updated');
    } else {
      logger.group('Updated modules:');
      renewedModules.forEach(module => console.log(module));
      console.groupEnd();
    }

    // Check if all is up to date
    if (!isUpToDate()) {
      processUpdate(hash, moduleMap, options);
    } else {
      logger.info('App is up to date');
    }
  } catch (error) {
    const status = module.hot?.status();

    if (status && FAILURE_STATUSES.includes(status)) {
      logger.warn('Cannot check for update. Need to do a full reload!', error);

      return window.location.reload();
    } else {
      logger.warn('Update check failed: ', error);
    }
  }
}
