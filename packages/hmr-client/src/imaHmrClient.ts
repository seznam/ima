import debounce from 'lodash.debounce';
import { StatsError } from 'webpack';

import {
  handleRuntimeError,
  showCompileErrors,
  clearRuntimeErrors,
  clearCompileError
} from '#/lib/hmrClient';

// Prevents rapid executions from fast refresh
const debouncedHandleRuntimeError = debounce(
  (error: Error) => handleRuntimeError(error),
  100,
  {
    leading: true,
    trailing: false
  }
);

// Prevents rapid executions from fast refresh
const debouncedShowCompileErrors = debounce(
  (errors: StatsError[]) => showCompileErrors(errors),
  100,
  {
    leading: true,
    trailing: false
  }
);

window.__ima_hmr = {
  handleRuntimeError: debouncedHandleRuntimeError,
  showCompileErrors: debouncedShowCompileErrors,
  clearRuntimeErrors,
  clearCompileError
};
