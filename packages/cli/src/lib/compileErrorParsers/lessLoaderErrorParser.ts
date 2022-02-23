import { StatsError } from 'webpack';

import { ParsedCompileError, RE_FILE_PATH_REGEX } from './parserHelpers';

/**
 * less-loader errors line hook
 *
 * https://github.com/webpack-contrib/less-loader/blob/master/src/LessError.js#L11
 */
const RE_LESS_LOADER_LINE = /^.*\(line\s(\d+),\scolumn\s(\d+)\)$/;

/**
 * less-loader specific parser. Tries to parse less compiler errors from
 * error message.
 */
function lessLoaderErrorParser(error: StatsError): ParsedCompileError {
  const messageLines = error.message.split('\n');
  const compileError: ParsedCompileError = {
    name: 'Syntax error',
    message: '',
  };

  for (let i = 0; i < messageLines.length; i++) {
    const match = messageLines[i].match(RE_LESS_LOADER_LINE);

    if (match) {
      compileError.lineNumber = parseInt(match[1]);
      compileError.columnNumber = parseInt(match[2]) || 1;

      // Extract fileUri
      compileError.fileUri = match.input?.match(RE_FILE_PATH_REGEX)?.[0];

      // The error message is one line above the error location
      compileError.message = messageLines[i - 1].trim();

      break;
    }
  }

  return compileError;
}

export { lessLoaderErrorParser };
