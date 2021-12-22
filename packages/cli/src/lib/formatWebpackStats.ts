import fs from 'fs';
import pc from 'picocolors';
import { StatsError } from 'webpack';
import { highlight, fromJson } from 'cli-highlight';

import { createSourceFragment, parseCompileError } from './compileErrorParser';
import logger from './logger';

/**
 * Prints formatted webpack errors (stripped from duplicates) into console.
 */
function formatWebpackErrors(errors: StatsError[] | undefined): void {
  if (!errors) {
    return;
  }

  // Parse errors
  const parsedErrors = [];
  for (const error of errors) {
    const parsedError = parseCompileError(error);

    if (parsedError) {
      parsedErrors.push(parsedError);
    }
  }

  // Filter out duplicates
  let filteredParsedErrors = [];
  for (const parsedError of parsedErrors) {
    if (
      filteredParsedErrors.findIndex(
        error =>
          error.name === parsedError.name &&
          error.message === parsedError.message &&
          error.fileUri === parsedError.fileUri
      ) === -1
    ) {
      filteredParsedErrors.push(parsedError);
    }
  }

  // Print only syntax errors
  if (filteredParsedErrors.some(error => error.name === 'Syntax error')) {
    filteredParsedErrors = filteredParsedErrors.filter(
      error => error.name === 'Syntax error'
    );
  }

  // Print filtered errors
  filteredParsedErrors.forEach(parsedError => {
    // Print message right away, if we don't manage to parse it
    if (!parsedError.fileUri || !parsedError.lineNumber) {
      return logger.error(
        `${pc.underline(parsedError.name + ':')} ${parsedError.message}\n`
      );
    }

    const file = fs.readFileSync(parsedError.fileUri, 'utf8');
    const fileLines = createSourceFragment(parsedError.lineNumber, file, 4);

    // Print error
    logger.error(`at ${pc.cyan(parsedError.fileUri)}`);
    console.log(
      `${pc.underline(parsedError.name + ':')} ${parsedError.message}\n`
    );

    // Print source fragment
    fileLines.forEach(line => {
      console.log(
        pc.gray(`${line.highlight ? pc.red('>') : ' '}  ${line.line} | `),
        highlight(line.source, {
          language: parsedError.fileUri?.split('.').pop() ?? 'javascript',
          ignoreIllegals: true,
          theme: fromJson({
            keyword: 'cyan',
            class: 'yellow',
            built_in: 'yellow',
            function: 'magenta',
            string: 'green',
            tag: 'gray',
            attr: 'cyan',
            doctag: 'gray',
            comment: 'gray',
            deletion: ['red', 'strikethrough'],
            regexp: 'yellow',
            literal: 'magenta',
            number: 'magenta',
            attribute: 'red'
          })
        })
      );
    });

    // Empty newline
    console.log('');
  });
}

/**
 * Prints cleaned up webpack warnings.
 */
function formatWebpackWarnings(
  warnings: StatsError[] | undefined,
  rootDir: string
): void {
  if (!warnings) {
    return;
  }

  warnings.forEach(warning => {
    let message = warning.message;

    // Shorten absolute paths to relative
    message = message.replace(new RegExp(rootDir, 'gim'), '.');

    // Cleanup webpack headers
    const lines = message
      .split('\n')
      .filter(line => !line.includes('Module Warning (from'));

    // Print warning
    logger.warn(lines.join('\n'));
  });
}

export { formatWebpackErrors, formatWebpackWarnings };
