/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  handleRuntimeError,
  clearRuntimeErrors,
  showCompileError,
  clearCompileError
} from './src/client';

window.__ima_hmr = {
  handleRuntimeError,
  clearRuntimeErrors,
  showCompileError,
  clearCompileError
};
