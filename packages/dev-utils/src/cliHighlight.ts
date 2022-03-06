import fs from 'fs';

import chalk from 'chalk';
import { highlight, fromJson } from 'cli-highlight';
import { StatsError } from 'webpack';

import { parseCompileError } from './compileErrorParser';
import { parseRuntimeError } from './runtimeErrorParser';
import { createSourceFragment } from './sourceFragment';

function highlightError(
  error: Error | StatsError,
  type?: 'compile' | 'runtime',
  rootDir?: string
): string {
  let fileUri: string | undefined,
    line: number | undefined,
    column: number | undefined,
    name: string | undefined,
    message: string | undefined,
    stack: string | undefined,
    functionName: string | undefined,
    sourceFragment: string[] | undefined;

  if (!error) {
    return '';
  }

  // Try to parse an error
  try {
    if (type === 'compile') {
      const compileError = parseCompileError(error);

      name = compileError?.name;
      message = compileError?.message;
      fileUri = compileError?.fileUri;
      column = compileError?.column;
      line = compileError?.line;
    } else if (type === 'runtime') {
      const runtimeError = parseRuntimeError(error as Error);
      const { parsedStack } = runtimeError;

      name = runtimeError?.name;
      message = runtimeError?.message;
      stack = runtimeError.stack;
      functionName = parsedStack[0].functionName;
      fileUri = parsedStack[0].fileUri;
      column = parsedStack[0].column;
      line = parsedStack[0].line;
    } else {
      name = error.name;
      message = error.message;
      stack = error.stack;
    }
  } catch (error) {
    if (error && error instanceof Error) {
      name = error.name;
      message = error.message;
      stack = error.stack;
    }
  }

  // Normalize fileUri
  if (fileUri && rootDir) {
    fileUri = fileUri.replace(rootDir, '.');
  }

  // Print source fragment
  if (fileUri && line && column) {
    const file = fs.readFileSync(fileUri, 'utf8');
    const fileLines = createSourceFragment(line, file, 4);

    sourceFragment = fileLines.map(
      line =>
        chalk.gray(
          `${line.highlight ? chalk.red('>') : ' '}  ${line.line} | `
        ) +
        // Replace tabs with spaces and highlight
        highlight(line.source.replace(/\t/g, '    '), {
          language: fileUri?.split('.').pop() ?? 'javascript',
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
            attribute: 'red',
          }),
        })
    );
  }

  // Assemble error message
  return [
    fileUri &&
      [
        functionName && `${chalk.magenta(`${functionName}`)} at`,
        chalk.cyan(`${fileUri}:${line}:${column}`),
      ].filter(Boolean),
    `${chalk.underline(`${name}:`)} ${message}`,
    ...(sourceFragment ? ['', ...sourceFragment] : []),
    stack && `\n${chalk.gray(stack)}`,
    '', // Empty line
  ]
    .filter(value => value === '' || !!value)
    .join('\n');
}

export { highlightError };
