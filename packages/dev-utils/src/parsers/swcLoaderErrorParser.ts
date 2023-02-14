import stripAnsi from 'strip-ansi';
import { StatsError } from 'webpack';

import { RE_FILE_PATH_REGEX, CompileError } from './parserUtils';
import { RE_VALID_FRAME_FIREFOX } from '../helpers';

const RE_SWC_LINE_NUMBER = /(\d+) │/;

/**
 * https://github.com/swc-project/swc/pull/3946
 *
 * SWC loader-specific error parser. Tries to parse error location from
 * webpack stats error object or browsers Error object.
 */
function swcLoaderErrorParser(error: StatsError | Error): CompileError {
  const cleanedMessage = stripAnsi(error.message);
  const messageLines = cleanedMessage.split('\n');

  // Parse error message
  const compileError: CompileError = {
    name: 'Syntax error',
    message: messageLines[2].replace(/×/gi, '').trim(),
    column: 1, // swc-loader does not report columns reliably
  };

  // Parse error location
  const lineNumberMatch = cleanedMessage.match(RE_SWC_LINE_NUMBER);
  if (lineNumberMatch && lineNumberMatch[1]) {
    compileError.line = parseInt(lineNumberMatch[1]);
  }

  if ((error as StatsError).moduleIdentifier) {
    // Parse filename from moduleIdentifier
    compileError.fileUri = (error as StatsError).moduleIdentifier?.includes('!')
      ? (error as StatsError).moduleIdentifier?.split('!').pop() ?? undefined
      : (error as StatsError).moduleIdentifier;
  } else if (error.stack) {
    /**
     * Parse from error stack. The location is always on the first line
     * since swc-loader throws an error in this broken module.
     */
    if (RE_VALID_FRAME_FIREFOX.test(error.stack)) {
      compileError.fileUri = error.stack.split('\n')[0].split('@').shift();
    } else {
      const cleanedStackLines = error.stack
        .replace(error.message, '')
        .split('\n');

      for (const line of cleanedStackLines) {
        const fileUriMatch = line.match(RE_FILE_PATH_REGEX);

        if (fileUriMatch) {
          compileError.fileUri = fileUriMatch[0];
          break;
        }
      }
    }
  }

  return compileError;
}

export { swcLoaderErrorParser };
