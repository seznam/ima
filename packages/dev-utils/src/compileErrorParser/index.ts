import { StatsError } from 'webpack';

import {
  babelLoaderErrorParser,
  cssLoaderErrorParser,
  lessLoaderErrorParser,
  swcLoaderErrorParser,
  webpackErrorParser,
  CompileError,
} from './parsers';

/**
 * Tries to parse error location from an error object. Which can be
 * either webpack stats error or simple Error object.
 *
 * @param {StatsError | Error} error webpack stats object or error instance.
 * @returns {CompileError | null} Parsed compile error.
 */
function parseCompileError(error: StatsError | Error): CompileError | null {
  // Parse compile errors
  if (error.message?.includes('swc-loader')) {
    return swcLoaderErrorParser(error);
  } else if (error.message?.includes('babel-loader')) {
    return babelLoaderErrorParser(error);
  } else if (error.message?.includes('less-loader')) {
    return lessLoaderErrorParser(error);
  } else if (
    error.message?.includes('postcss-loader') ||
    error.message?.includes('css-loader')
  ) {
    return cssLoaderErrorParser(error);
  }

  // Fallback to general webpack error parser
  return webpackErrorParser(error);
}

export { parseCompileError, CompileError };
