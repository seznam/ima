import { RE_VALID_FRAME_CHROME, RE_VALID_FRAME_FIREFOX } from '#/helpers';

export type TraceLine = {
  functionName?: string;
  fileUri?: string;
  lineNumber?: number;
  columnNumber?: number;
};

const RE_EXTRACT_LOCATIONS = /\(?(.+?)(?::(\d+))?(?::(\d+))?\)?$/;

/**
 * Extract file uri, line and column number from
 * parsed token line.
 *
 * @param {string} token Parsed stack trace line.
 * @returns {object}
 */
function extractLocation(token: string): {
  fileUri: string;
  lineNumber: number;
  columnNumber: number;
} {
  const [fileUri, lineNumber, columnNumber] =
    RE_EXTRACT_LOCATIONS.exec(token)?.slice(1) || [];

  return {
    fileUri,
    lineNumber: parseInt(lineNumber),
    columnNumber: parseInt(columnNumber),
  };
}

/**
 * Splits trace line at '@' character ignoring pkg namespace paths.
 * Used for proper parsing of firefox-like stack traces.
 *
 * @param {string} traceLine Stack trace line.
 */
function splitAt(traceLine: string): string[] {
  const traceLineMask = '____AT_MASK____';
  const maskedTraceLine = traceLine.replace(/\/@/g, traceLineMask);
  const parts = maskedTraceLine.split('@');

  return parts.map(part => part.trim().replace(traceLineMask, '/@'));
}

/**
 * Original {@link https://github.com/facebook/create-react-app/blob/main/packages/react-error-overlay/src/utils/parser.js}
 *
 * Parses error stack lines into function name call, file uri
 * line and column numbers of the call.
 *
 * @param {string[]} stack Array of stack lines.
 * @returns {TraceLine[]}
 */
function parseStack(stack: string[]): TraceLine[] {
  return stack
    .filter(
      traceLine =>
        RE_VALID_FRAME_CHROME.test(traceLine) ||
        RE_VALID_FRAME_FIREFOX.test(traceLine)
    )
    .map(traceLine => {
      // Chrome and firefox have different stack trace formats
      const match = traceLine.match(RE_VALID_FRAME_FIREFOX);

      // Validate firefox (if at character contains / prefix, it's namespaced package path)
      if (match && match[1] === '@') {
        let isEval = false;

        // Strip eval
        if (/ > (eval|Function)/.test(traceLine)) {
          traceLine = traceLine.replace(
            / line (\d+)(?: > eval line \d+)* > (eval|Function):\d+:\d+/g,
            ':$1'
          );
          isEval = true;
        }

        const data = splitAt(traceLine);
        const traceToken = data.pop();
        const { fileUri, lineNumber, columnNumber } =
          (traceToken && extractLocation(traceToken)) || {};

        return {
          functionName: data.join('@') || (isEval ? 'eval' : 'anonymous'),
          fileUri,
          lineNumber,
          columnNumber,
        };
      }

      if (traceLine.indexOf('(eval ') !== -1) {
        traceLine = traceLine.replace(/(\(eval at [^()]*)|(\),.*$)/g, '');
      }

      if (traceLine.indexOf('(at ') !== -1) {
        traceLine = traceLine.replace(/\(at /, '(');
      }

      const data = traceLine.trim().split(/\s+/g).slice(1);
      const traceToken = data.pop();
      const { fileUri, lineNumber, columnNumber } =
        (traceToken && extractLocation(traceToken)) || {};

      return {
        functionName: data.join(' ') || 'anonymous',
        fileUri,
        lineNumber,
        columnNumber,
      };
    });
}

/**
 * Parses Error object or stack lines into parsed stack trace lines.
 *
 * @param {Error | string | string[]} error Error, trace or similar object.
 * @returns {TraceLine[]}
 */
function parseRuntimeError(error: Error | string | string[]): TraceLine[] {
  if (error === null) {
    throw new Error('You cannot pass a null object.');
  }

  if (typeof error === 'string') {
    return parseStack(error.split('\n'));
  }

  if (Array.isArray(error)) {
    return parseStack(error);
  }

  if (typeof error.stack === 'string') {
    return parseStack(error.stack.split('\n'));
  }

  throw new Error('The error you provided does not contain a stack trace.');
}

export { parseRuntimeError };
