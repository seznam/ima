import fs from 'fs';

import chalk from 'chalk';
import { highlight, fromJson } from 'cli-highlight';
import { SourceMapConsumer, RawSourceMap } from 'source-map-js';
import * as stackTraceParser from 'stacktrace-parser';
import { StatsError } from 'webpack';

import { parseCompileError } from './compileErrorParser';
import { createSourceFragment, FragmentLine } from './sourceFragment';
import { extractSourceMappingUrl } from './sourceMapUtils';

/**
 * Get source fragment from provided source metadata.
 * Optionally it tries to parse original content if
 * source maps are available.
 *
 * @param {string?} fileUri source file uri.
 * @param {number?} line errored line number.
 * @param {number?} column errored column number.
 * @param {boolean} [parseSourceMaps=true] flag to
 *  parse source maps or not.
 * @returns {Promise<string[]>} Formatted error lines.
 */
async function getSource(
  fileUri?: string,
  line?: number,
  column = 0,
  parseSourceMaps = true
): Promise<string[] | undefined> {
  if (!fileUri || typeof line !== 'number') {
    return;
  }

  let sourceLines: FragmentLine[] = [];
  const fileContents = await fs.promises.readFile(fileUri, 'utf8');

  // Parse source maps
  if (parseSourceMaps) {
    const sourceMapUrl = extractSourceMappingUrl(fileUri, fileContents);

    // Try to parse original content
    if (sourceMapUrl && fs.existsSync(sourceMapUrl)) {
      const rawSourceMap = JSON.parse(
        await fs.promises.readFile(sourceMapUrl, 'utf8')
      ) as RawSourceMap;

      const sourceMap = await new SourceMapConsumer(rawSourceMap);
      const orgPosition = sourceMap.originalPositionFor({
        column,
        line,
      });

      if (orgPosition.source === null || orgPosition.line === null) {
        return [];
      }

      const orgSource = sourceMap.sourceContentFor(orgPosition.source);

      if (!orgSource) {
        return [];
      }

      // Create source fragment for original content
      sourceLines = createSourceFragment(orgPosition.line, orgSource + '', 4);
    }
  }

  // Fallback to bundeled sources
  if (sourceLines.length === 0) {
    sourceLines = createSourceFragment(line, fileContents, 4);
  }

  return sourceLines.map(
    line =>
      chalk.gray(`${line.highlight ? chalk.red('>') : ' '}  ${line.line} | `) +
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

/**
 * Formats provided error object into readable format including
 * the errored source code fragment with line highlight. Works
 * with runtime and compile errors while trying to show all
 * relevant information that can be extracted from provided object.
 *
 * @param {Error|StatsError} Error object to format.
 * @param {string?} type Error type (affects error parsing).
 * @param {string?} rootDir Optional root directory used to print
 *  absolute URLs as relative to the current rootDir.
 * @param {string[]?} uniqueTracker Array of error identifiers to
 *  track uniques, if the error matches identifier already included
 *  in this array, this function returns empty string.
 * @returns {Promise<string>} Formatted error output.
 */
async function formatError(
  error: Error | StatsError,
  type?: 'compile' | 'runtime',
  options?: {
    rootDir?: string;
    parseSourceMaps?: boolean;
    uniqueTracker?: string[];
  }
): Promise<string> {
  let fileUri: string | undefined,
    line: number | undefined,
    column: number | undefined,
    name: string | undefined,
    message: string | undefined,
    stack: string | undefined,
    functionName: string | undefined,
    sourceFragment: string[] | undefined;

  const optionsWithDefaults = {
    rootDir: process.cwd(),
    parseSourceMaps: true,
    ...options,
  };

  if (!error) {
    return `${chalk.underline(`Empty ${type} error`)}`;
  }

  // Try to parse an error
  try {
    if (type === 'compile') {
      const compileError = parseCompileError(error);

      // Extract parsed parts
      name = compileError?.name;
      message = compileError?.message;
      fileUri = compileError?.fileUri;
      column = compileError?.column;
      line = compileError?.line;
    } else if (type === 'runtime') {
      name = error?.name;
      message = error?.message;
      stack = error.stack;

      // Extract parsed parts
      if (error.stack) {
        const parsedStack = stackTraceParser.parse(error.stack);
        functionName = parsedStack[0].methodName;
        fileUri = parsedStack[0].file ?? undefined;
        column = parsedStack[0].column ?? undefined;
        line = parsedStack[0].lineNumber ?? undefined;
      }
    } else {
      name = error.name;
      message = error.message;
      stack = error.stack;
    }

    // Get source fragment
    sourceFragment = await getSource(
      fileUri,
      line,
      column,
      optionsWithDefaults.parseSourceMaps
    );

    // Normalize fileUri
    if (fileUri && optionsWithDefaults.rootDir) {
      fileUri = fileUri.replace(optionsWithDefaults.rootDir, '.');
    }
  } catch (error) {
    if (error && error instanceof Error) {
      name = error.name;
      message = error.message;
      stack = error.stack;
    } else {
      // Fallback in case everything fails
      return `${chalk.underline(`Unknown ${type} error`)}:\n${error}`;
    }
  }

  // Track unique errors
  if (options && Array.isArray(options?.uniqueTracker)) {
    const errorIdentifier = `${fileUri}:${line}:${column}`;

    // Return empty string for already processed errors
    if (options?.uniqueTracker.includes(errorIdentifier)) {
      return '';
    } else {
      options.uniqueTracker.push(errorIdentifier);
    }
  }

  // Assemble error message
  return [
    fileUri &&
      [
        functionName && `${chalk.magenta(`${functionName}`)} at`,
        chalk.cyan(`${fileUri}:${line}:${column}`),
      ]
        .filter(Boolean)
        .join(' '),
    `${chalk.underline(`${name}:`)} ${message}`,
    ...(sourceFragment ? ['', ...sourceFragment] : []),
    stack && `\n${chalk.gray(stack)}`,
    '', // Empty line
  ]
    .filter(value => value === '' || !!value)
    .join('\n');
}

export { formatError };
