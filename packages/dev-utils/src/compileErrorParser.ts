import { StatsError } from 'webpack';

import {
  cssLoaderErrorParser,
  lessLoaderErrorParser,
  swcLoaderErrorParser,
  webpackErrorParser,
  CompileError,
} from './parsers';

export const COMPILE_ERROR_NEEDLES_RE = [
  /error:\s?module/i,
  /module\s\w*\s?failed/i,
];

export function resolveErrorType(
  error: Error | StatsError
): 'compile' | 'runtime' {
  if ((error as StatsError)?.loc) {
    return 'compile';
  }

  return COMPILE_ERROR_NEEDLES_RE.some(re =>
    re.test(error?.message || error?.stack || '')
  )
    ? 'compile'
    : 'runtime';
}

/**
 * Tries to parse error location from an error. Which can be
 * either webpack stats error or simple Error object.
 *
 * @param {StatsError | Error} error webpack stats object or error instance.
 * @returns {CompileError | null} Parsed compile error.
 */
export function parseCompileError(
  error: StatsError | Error
): CompileError | null {
  // Parse compile errors
  if (error.message?.includes('swc-loader')) {
    return swcLoaderErrorParser(error);
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

export { CompileError };
