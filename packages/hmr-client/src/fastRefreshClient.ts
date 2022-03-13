/**
 * @pmmmwh/react-refresh-webpack-plugin module which connects
 * the fast refresh handlers to existing IMA_HMR api
 * already bind to the current window.
 */

const clearErrors = () => {
  if (!window?.__IMA_HMR) {
    return;
  }

  window.__IMA_HMR.emit('clear');
};

const handleRuntimeError = (error: Error) => {
  if (!window?.__IMA_HMR) {
    return;
  }

  // Ignore HMR apply errors
  if (error.stack?.includes('Object.hotApply')) {
    return;
  }

  // Ignore unknown errors (usually promise rejectsion etc.)
  if (error.message === 'Unknown') {
    return;
  }

  // Compile error catched in webpack runtime
  if (
    error.message.startsWith('Module build failed') ||
    error.message.startsWith('Cannot find module')
  ) {
    return window.__IMA_HMR.emit('error', { error, type: 'compile' });
  }

  window.__IMA_HMR.emit('error', { error, type: 'runtime' });
};

/**
 * Exports correspond to the @pmmmwh/react-refresh-webpack-plugin
 * module interface.
 */
export {
  handleRuntimeError,
  clearErrors as clearRuntimeErrors,
  clearErrors as clearCompileError,
};
