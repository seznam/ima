import { ansiToText } from 'anser';
import { ParsedCompileStack } from 'types';
import { StatsError } from 'webpack';

const FilePathRegExp = /^\.(\/[^/\n ]+)+\.[^/\n ]+$/;
const LineNumberRegExps = Object.freeze({
  /**
   * css and post-css loader errors
   *
   * https://github.com/webpack-contrib/css-loader/blob/master/src/CssSyntaxError.js
   */
  css: /^\((\d+):(\d+)\)/,

  /**
   * Babel syntax errors
   *
   * Based on syntax error formatting of babylon parser
   * https://github.com/babel/babylon/blob/v7.0.0-beta.22/src/parser/location.js#L19
   */
  babel: /^.*\((\d+):(\d+)\)$/,

  /**
   * less-loader errors
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

  // Columns are indexed from 0 so we need to compensate for that
  return [parseInt(line), parseInt(column) + 1];
}

/**
 * Removes and formats webpack error messages into meaningful output.
 * Stripping all redundant and additional information we already show
 * using frame source fragments.
 */
function formatMessage(
  message: string,
  type?: keyof typeof LineNumberRegExps
): [name: string, message: string] {
  if (message && message.indexOf('Module not found: ') === 0) {
    message = message
      .replace('Error: ', '')
      .replace("Module not found: Can't resolve", "Can't resolve:");
  }

  if (type === 'babel') {
    // Remove error location info
    message = message.replace('SyntaxError:', 'Syntax error:');
    message = message.substring(0, message.lastIndexOf(' '));

    // Remove affected file path (since we show it in the source code frame)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [name, _, ...restMessage] = message.split(':');
    message = [name, ...restMessage].join(':');
  }

  if (type === 'less') {
    message = `Syntax error: ${message}`;
  }

  if (type === 'css') {
    // Remove affected file path and error location
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [errorLocation, filePath, ...restMessage] = message.split(' ');
    message = ['SyntaxError:', ...restMessage].join(' ');
  }

  const [name, ...restMessage] = message.split(':');

  return [name, restMessage.join(':')];
}

/**
 * Tries to parse error location from webpack Error object.
 * Either by directly pulling the location from the error object
 * or by parsing the error message, which is inspired by create-react-app solution
 * https://github.com/facebook/create-react-app/blob/main/packages/react-error-overlay/src/utils/parseCompileError.js.
 */
function parseCompileError(error: StatsError): ParsedCompileStack | null {
  const fileUri = sanitizeModuleName(error.moduleName);

  // We can't reliably parse error message without known moduleName (fileUri)
  if (!fileUri) {
    return null;
  }

  let [lineNumber = 0, columnNumber = 0] = parseErrorLoc(error.loc);

  // Return error location if already known from error object
  if (fileUri && lineNumber) {
    // Parse error message and name
    const [name, message] = formatMessage(error.message);

    return { name, message, fileUri, lineNumber, columnNumber };
  }

  const lines = error.message.split('\n');
  const fileUriNeedle = fileUri.startsWith('.')
    ? fileUri.substring(1)
    : fileUri;

  const errorLineIndex = lines.findIndex(line => line.includes(fileUriNeedle));

  if (errorLineIndex === -1) {
    return null;
  }

  const errorLine = ansiToText(lines[errorLineIndex]);

  for (const lineRE in LineNumberRegExps) {
    const match = errorLine.match(
      LineNumberRegExps[lineRE as keyof typeof LineNumberRegExps]
    );

    if (match) {
      lineNumber = parseInt(match[1], 10);

      // We append '@import globals.less' in every less file, so we need to subtract these lines from result
      if (fileUri.endsWith('less')) {
        lineNumber -= 2;
      }

      // Column starts with 0, so add 1
      columnNumber = parseInt(match[2], 10) + 1 || 1;

      /**
       * Parse error message and name. less errors have
       * message context one line above error line.
       */
      const [name, message] = formatMessage(
        ['less'].includes(lineRE)
          ? lines[Math.max(errorLineIndex - 1, 0)]
          : errorLine,
        lineRE as keyof typeof LineNumberRegExps
      );

      return { name, message, fileUri, lineNumber, columnNumber };
    }
  }

  return null;
}

export { parseCompileError, formatMessage };
