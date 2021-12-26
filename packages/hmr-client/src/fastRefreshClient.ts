// Connect to already existing ima hmr client API
const clearRuntimeErrors = () => {
  window.__ima_hmr.clearRuntimeErrors();
};

const clearCompileError = () => {
  window.__ima_hmr.clearCompileError();
};

const handleRuntimeError = (error: Error) => {
  // Ignore HMR apply errors
  if (error.stack?.includes('Object.hotApply')) {
    return;
  }

  window.__ima_hmr.handleRuntimeError(error);
};

export { handleRuntimeError, clearRuntimeErrors, clearCompileError };
