import { ansiToText } from 'anser';
import { ParsedStack } from 'types';
import { StatsError } from 'webpack';

const LineNumberRegExps = Object.freeze({
  /**
   * Babel syntax errors
   *
   * Based on syntax error formatting of babylon parser
   * https://github.com/babel/babylon/blob/v7.0.0-beta.22/src/parser/location.js#L19
   */
  babel: /^.*\((\d+):(\d+)\)$/,

  /**
   * Less loader errors
   * https://github.com/webpack-contrib/less-loader/blob/master/src/LessError.js#L11
   */
  less: /^.*\(line\s(\d+),\scolumn\s(\d+)\)$/
});

/**
 * // TODO maybe not necessary? since there should always be error at the latest loader
 * Remove loaders from module name.
 */
function sanitizeModuleName(moduleName: string | undefined): null | string {
  if (!moduleName) {
    return null;
  }

  return moduleName.includes('!')
    ? moduleName.split('!').pop() ?? null
    : moduleName;
}

function parseErrorLoc(errorLocation?: string): [number, number] | [] {
  if (!errorLocation || !errorLocation.includes(':')) {
    return [];
  }

  const [line, columns] = errorLocation.split(':');
  const column = (columns.includes('-') ? columns.split('-') : columns)[0];

  // Locations are indexed from 0 so we need to compensate for that
  return [parseInt(line) + 1, parseInt(column) + 1];
}

/**
 * Tries to parse error location from webpack Error object.
 * Either by directly pulling the location from the error object
 * or by parsing the error message, which is inspired by create-react-app solution
 * https://github.com/facebook/create-react-app/blob/main/packages/react-error-overlay/src/utils/parseCompileError.js.
 */
function parseCompileError(error: StatsError): ParsedStack[] {
  const fileUri = sanitizeModuleName(error.moduleName);

  // We can't reliably parse error message without known moduleName (fileUri)
  if (!fileUri) {
    return [];
  }

  let [lineNumber = 0, columnNumber = 0] = parseErrorLoc(error.loc);

  // Return error location if already known from error object
  if (fileUri && lineNumber) {
    return [{ fileUri, lineNumber, columnNumber }];
  }

  const lines = error.message.split('\n');
  const fileUriNeedle = fileUri.startsWith('.')
    ? fileUri.substring(1)
    : fileUri;

  const errorLine = ansiToText(
    lines.find(line => line.includes(fileUriNeedle)) ?? ''
  );

  if (!errorLine) {
    return [];
  }

  for (const lineRegexp in LineNumberRegExps) {
    const match = errorLine.match(
      LineNumberRegExps[lineRegexp as keyof typeof LineNumberRegExps]
    );

    if (match) {
      // We append '@import globals.less' in every less file, so we need to subtract these lines from result
      lineNumber = parseInt(match[1], 10) + (lineRegexp === 'less' ? -2 : 0);
      // Column starts with 0, so add 1
      columnNumber = parseInt(match[2], 10) + 1 || 1;

      return [{ fileUri, lineNumber, columnNumber }];
    }
  }

  return [];
}

export { parseCompileError };
