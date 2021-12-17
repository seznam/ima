/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  handleRuntimeError,
  clearRuntimeErrors,
  showCompileErrors,
  clearCompileError
} from './src/client';

window.__ima_hmr = {
  handleRuntimeError,
  clearRuntimeErrors,
  showCompileErrors,
  clearCompileError
};
