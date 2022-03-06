import { RE_VALID_FRAME_CHROME, RE_VALID_FRAME_FIREFOX } from './helpers';

export type TraceLine = {
  functionName?: string;
  fileUri?: string;
  line?: number;
  column?: number;
};

export type RuntimeError = {
  name: string;
  message: string;
  stack: string;
  parsedStack: TraceLine[];
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
  line: number;
  column: number;
} {
  const [fileUri, line, column] =
    RE_EXTRACT_LOCATIONS.exec(token)?.slice(1) || [];

  return {
    fileUri,
    line: parseInt(line),
    column: parseInt(column),
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
 * @param {number} maxStackLines Maximum number of stack lines to extract.
 * @returns {TraceLine[]}
 */
function parseStack(stack: string[], maxStackLines: number): TraceLine[] {
  return stack
    .filter(
      traceLine =>
        RE_VALID_FRAME_CHROME.test(traceLine) ||
        RE_VALID_FRAME_FIREFOX.test(traceLine)
    )
    .slice(0, maxStackLines)
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
        const { fileUri, line, column } =
          (traceToken && extractLocation(traceToken)) || {};

        return {
          functionName: data.join('@') || (isEval ? 'eval' : undefined),
          fileUri,
          line,
          column,
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
      const { fileUri, line, column } =
        (traceToken && extractLocation(traceToken)) || {};

      return {
        functionName: data.join(' ') || undefined,
        fileUri,
        line,
        column,
      };
    });
}

/**
 * Parses Error object or stack lines into parsed stack trace lines.
 *
 * @param {Error} error Error, trace or similar object.
 * @param {number} maxStackLines Maximum number of stack lines to extract.
 * @returns {RuntimeError}
 */
function parseRuntimeError(
  error: Error,
  maxStackLines = Infinity
): RuntimeError {
  if (error === null) {
    throw new Error('You cannot pass a null object.');
  }

  if (typeof error.stack === 'string') {
    return {
      message: error.message,
      name: error.name,
      stack: error.stack,
      parsedStack: parseStack(error.stack.split('\n'), maxStackLines),
    };
  }

  throw new Error('The error you provided does not contain a stack trace.');
}

export { parseRuntimeError };
