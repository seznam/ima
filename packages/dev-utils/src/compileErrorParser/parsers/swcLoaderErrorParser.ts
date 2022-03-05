import { StatsError } from 'webpack';

import { CompileError } from '#/types';

import { RE_FILE_PATH_REGEX, RE_VALID_FRAME_FIREFOX } from './parserUtils';

const RE_SWC_LINE_NUMBER = /(\d+) \|/;

/**
 * SWC loader-specific error parser. Tries to parse error location from
 * webpack stats error object or browsers Error object.
 */
function swcLoaderErrorParser(error: StatsError & Error): CompileError {
  const messageLines = error.message.split('\n');

  // Parse error message
  const compileError: CompileError = {
    name: 'Syntax error',
    message: messageLines[1].replace(/error:/gi, '').trim(),
    columnNumber: 1, // swc-loader does not report columns reliably
  };

  // Parse error location
  const lineNumberMatch = error.message.match(RE_SWC_LINE_NUMBER);
  if (lineNumberMatch && lineNumberMatch[1]) {
    compileError.lineNumber = parseInt(lineNumberMatch[1]);
  }

  if (error.moduleIdentifier) {
    // Parse filename from moduleIdentifier
    compileError.fileUri = error.moduleIdentifier.includes('!')
      ? error.moduleIdentifier.split('!').pop() ?? undefined
      : error.moduleIdentifier;
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
