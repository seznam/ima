import debounce from 'lodash.debounce';

import {
  handleRuntimeError,
  clearRuntimeErrors,
  clearCompileError
} from './src/client';

// Prevents rapid executions from fast refresh
const debouncedHandleRuntimeError = debounce(
  (error: Error) => handleRuntimeError(error),
  100,
  {
    leading: true,
    trailing: false
  }
);

window.__ima_hmr = {
  handleRuntimeError: debouncedHandleRuntimeError,
  clearRuntimeErrors,
  clearCompileError
};
