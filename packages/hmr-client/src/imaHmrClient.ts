import debounce from 'lodash.debounce';
import { StatsError } from 'webpack';

import {
  handleRuntimeError,
  showCompileError,
  clearRuntimeErrors,
  clearCompileError,
} from '#/lib/hmrClient';
import { HMROptions } from '#/types';

// Prevents rapid executions from fast refresh
const debouncedHandleRuntimeError = debounce(
  (error: Error) => handleRuntimeError(error),
  100,
  {
    leading: true,
    trailing: false,
  }
);

// Prevents rapid executions from fast refresh
const debouncedshowCompileError = debounce(
  (error: StatsError) => showCompileError(error),
  100,
  {
    leading: true,
    trailing: false,
  }
);

// Parse hmr options from webpack resource query
// @ts-expect-error yeah I don't know...
const options = Object.fromEntries(
  new URLSearchParams(__resourceQuery)
) as HMROptions;

// Save hmr callbacks to window
window.__ima_hmr = {
  options,
  clearRuntimeErrors,
  clearCompileError,
  handleRuntimeError: debouncedHandleRuntimeError,
  showCompileError: debouncedshowCompileError,
};
