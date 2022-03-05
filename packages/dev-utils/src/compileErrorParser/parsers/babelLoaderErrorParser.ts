import { StatsError } from 'webpack';

import { CompileError } from './parserUtils';

/**
 * babel-loader error line hook
 *
 * https://github.com/webpack-contrib/less-loader/blob/master/src/LessError.js#L11
 */
const RE_BABEL_LOADER_LINE = /^(.*):(.*):(.*)(\((\d+):(\d+)\))$/;

/**
 * babel-loader parser, tries to parse compiler error location from the error message.
 */
function babelLoaderErrorParser(error: StatsError | Error): CompileError {
  const messageLines = error.message.split('\n');
  const compileError: CompileError = {
    name: 'Syntax error',
    message: '',
  };

  // Skip first line containing error message
  const match = messageLines[1].match(RE_BABEL_LOADER_LINE);

  if (match) {
    compileError.fileUri = match[2].trim();
    compileError.message = match[3].trim();
    compileError.line = parseInt(match[5]) || undefined;
    compileError.column = parseInt(match[6]) || undefined;
  }

  return compileError;
}

export { babelLoaderErrorParser };
