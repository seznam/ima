import { StatsError } from 'webpack';

import { RE_VALID_FRAME_FIREFOX } from '#/helpers';

import { CompileError, extractErrorLoc, extractFileUri } from './parserUtils';

const RE_EXTRACT_LOCATIONS_CHROME = /\(((.*):(\d+):(\d+))\)/;
const RE_EXTRACT_LOCATIONS_FIREFOX = /(.*):(\d+):(\d+)/;

/**
 * General webpack compile error parser which tries to parse all remaining
 * errors from error stack and stats params.
 */
function webpackErrorParser(error: StatsError | Error): CompileError {
  // Parse error message
  const compileError: CompileError = {
    name: 'Webpack error',
    message: error.message.replace(/module not found: error:/gi, '').trim(),
  };

  if ((error as StatsError).loc && (error as StatsError).moduleIdentifier) {
    // Extract error location from stats params.
    const { line, column } = extractErrorLoc((error as StatsError).loc);
    const fileUri = extractFileUri(
      (error as StatsError).moduleIdentifier ?? ''
    );

    compileError.line = line;
    compileError.column = column;
    compileError.fileUri = fileUri;
  } else if (error.stack) {
    const stackLines = error.stack?.split('\n');

    // Extract location from stack trace
    if (RE_VALID_FRAME_FIREFOX.test(error.stack)) {
      // Extract important part from stack line
      const stackLine = stackLines[0].split('@').pop();
      const match = stackLine?.match(RE_EXTRACT_LOCATIONS_FIREFOX);

      if (match) {
        compileError.fileUri = match[1];
        compileError.line = parseInt(match[2]) || undefined;
        compileError.column = parseInt(match[3]) || undefined;
      }
    } else {
      // Skip first line containing error message.
      const match = stackLines[1].match(RE_EXTRACT_LOCATIONS_CHROME);

      if (match) {
        compileError.fileUri = match[2];
        compileError.line = parseInt(match[3]) || undefined;
        compileError.column = parseInt(match[4]) || undefined;
      }
    }
  }

  return compileError;
}

export { webpackErrorParser };
