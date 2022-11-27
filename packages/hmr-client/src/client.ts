import {
  init,
  isUpToDate,
  parseEventSourceError,
  processUpdate,
} from './utils';

if (!module.hot) {
  throw new Error(
    "[HMR] HMR is disabled, make sure that you're using webpack.HotModuleReplacementPlugin in your webpack config."
  );
}

const { emitter, eventSource, indicator, options, logger } =
  init(__resourceQuery);

eventSource.addListener(options.name, data => {
  let applyUpdate = true;

  switch (data.action) {
    case 'building':
      indicator.create('loading');
      break;

    case 'built':
    case 'sync':
      // Handle errors
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        applyUpdate = false;

        // Event source sends flatten errors, so we have to parse it back
        emitter.emit('error', {
          error: parseEventSourceError(data.errors[0]),
        });
      } else if (Array.isArray(data.warnings) && data.warnings.length > 0) {
        // TODO handle warnings... maybe
      } else {
        emitter.emit('clear');
      }

      // Process update to modules
      if (
        applyUpdate &&
        !isUpToDate(data.hash) &&
        module.hot?.status() === 'idle'
      ) {
        logger.info(false, 'Checking for updates on the server...');
        processUpdate({
          hash: data.hash,
          options,
          logger,
          emitter,
        });
      }

      indicator.destroy();
      break;
  }
});
