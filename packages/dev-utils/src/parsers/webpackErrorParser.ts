import { parse } from 'stacktrace-parser';
import { StatsError } from 'webpack';

import { CompileError, extractErrorLoc, extractFileUri } from './parserUtils';

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
    const parsedStack = parse(error.stack);

    compileError.column = parsedStack[0].column || 1;
    compileError.fileUri = parsedStack[0].file || '';
    compileError.line = parsedStack[0].lineNumber || 1;
  }

  return compileError;
}

export { webpackErrorParser };
