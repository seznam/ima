import { init, isUpToDate, processUpdate } from '@/utils';

if (!module.hot) {
  throw new Error(
    "[HMR] HMR is disabled, make sure that you're using webpack.HotModuleReplacementPlugin in your webpack config."
  );
}

const { emitter, eventSource, indicator, options, logger } = init();

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

        // Send error to error-overlay
        emitter.emit('error', {
          error: data.errors[0],
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
        logger.info('Checking for updates on the server...');
        processUpdate(data.hash, options, logger);
      }

      indicator.destroy();
      break;
  }
});
