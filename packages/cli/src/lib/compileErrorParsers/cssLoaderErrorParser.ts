import { StatsError } from 'webpack';

import { ParsedCompileError } from './parserHelpers';

/**
 * css and post-css loader errors line hook
 *
 * https://github.com/webpack-contrib/css-loader/blob/master/src/CssSyntaxError.js
 */
const RE_CSS_LOADER_LINE = /(^\((\d+):(\d+)\))?\s?(\.?(\/[^/\n :,]+)+)\s(.*)/;

/**
 * less-loader specific parser. Tries to parse less compiler errors from
 * error message.
 */
function cssLoaderErrorParser(error: StatsError): ParsedCompileError {
  const messageLines = error.message.split('\n');
  const compileError: ParsedCompileError = {
    name: 'Syntax error',
    message: '',
  };

  for (let i = 0; i < messageLines.length; i++) {
    const match = messageLines[i].match(RE_CSS_LOADER_LINE);

    if (match) {
      compileError.lineNumber = parseInt(match[2]) || undefined;
      compileError.columnNumber = parseInt(match[3]) || 1;
      compileError.fileUri = match[4];
      compileError.message = match[6].trim();

      break;
    }
  }

  return compileError;
}

export { cssLoaderErrorParser };
