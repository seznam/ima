import { StatsError } from 'webpack';

import {
  ParsedCompileError,
  extractErrorLoc,
  extractFileUri,
  RE_VALID_FRAME_FIREFOX,
} from './parserHelpers';

const RE_EXTRACT_LOCATIONS_CHROME = /\(((.*):(\d+):(\d+))\)/;
const RE_EXTRACT_LOCATIONS_FIREFOX = /(.*):(\d+):(\d+)/;

/**
 * General webpack compile error parser which tries to parse all remaining
 * errors from error stack and stats params.
 */
function webpackErrorParser(error: StatsError): ParsedCompileError {
  // Parse error message
  const compileError: ParsedCompileError = {
    name: 'Webpack error',
    message: error.message.replace(/module not found: error:/gi, '').trim(),
  };

  if (error.loc && error.moduleIdentifier) {
    // Extract error location from stats params.
    const [lineNumber, columnNumber] = extractErrorLoc(error.loc);
    const fileUri = extractFileUri(error.moduleIdentifier);

    compileError.lineNumber = lineNumber;
    compileError.columnNumber = columnNumber;
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
        compileError.lineNumber = parseInt(match[2]) || undefined;
        compileError.columnNumber = parseInt(match[3]) || undefined;
      }
    } else {
      // Skip first line containing error message.
      const match = stackLines[1].match(RE_EXTRACT_LOCATIONS_CHROME);

      if (match) {
        compileError.fileUri = match[2];
        compileError.lineNumber = parseInt(match[3]) || undefined;
        compileError.columnNumber = parseInt(match[4]) || undefined;
      }
    }
  }

  return compileError;
}

export { webpackErrorParser };