import { VerboseOptions } from './types';
import { createWebpackConfig } from './webpack/utils';
import {
  createSourceFragment,
  parseCompileError
} from './lib/compileErrorParser';
import { createDevServer } from './dev-server';
import ScrambleCssPlugin from './plugins/scramble-css';
import AmpPlugin from './plugins/amp';

export {
  createWebpackConfig,
  createDevServer,
  createSourceFragment,
  parseCompileError,
  VerboseOptions,
  ScrambleCssPlugin,
  AmpPlugin
};
