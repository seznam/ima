import { StatsError } from 'webpack';

// Connect to already existing ima hmr client API
const clearRuntimeErrors = () => {
  if (!window?.__ima_hmr) {
    return;
  }

  window.__ima_hmr.clearRuntimeErrors();
};

const clearCompileError = () => {
  if (!window?.__ima_hmr) {
    return;
  }

  window.__ima_hmr.clearCompileError();
};

const handleRuntimeError = (error: Error) => {
  // Ignore HMR apply errors
  if (error.stack?.includes('Object.hotApply')) {
    return;
  }

  if (!window?.__ima_hmr) {
    return;
  }

  // Compile error catched in webpack runtime
  if (
    error.message.startsWith('Module build failed') ||
    error.message.startsWith('Cannot find module')
  ) {
    return window.__ima_hmr.showCompileErrors([error as StatsError]);
  }

  window.__ima_hmr.handleRuntimeError(error);
};

export { handleRuntimeError, clearRuntimeErrors, clearCompileError };