import fs from 'fs';

import chalk from 'chalk';
import { highlight, fromJson } from 'cli-highlight';
import { SourceMapConsumer, RawSourceMap } from 'source-map-js';
import * as stackTraceParser from 'stacktrace-parser';
import { StatsError } from 'webpack';

import { parseCompileError } from './compileErrorParser';
import { createSourceFragment, FragmentLine } from './sourceFragment';
import { extractSourceMappingUrl } from './sourceMapUtils';

export type ParsedErrorData = {
  fileUri?: string;
  line?: number;
  column?: number;
  name?: string;
  message?: string;
  stack?: string;
  functionName?: string;
};

/**
 * Get source fragment from provided source metadata.
 * Optionally it tries to parse original content if
 * source maps are available.
 *
 * @param {string?} fileUri source file uri.
 * @param {number?} line errored line number.
 * @param {number?} column errored column number.
 * @returns {Promise<string[]>} Formatted error lines.
 */
export async function getSource(
  fileUri?: string,
  line?: number,
  column = 0
): Promise<string[] | undefined> {
  if (!fileUri || typeof line !== 'number') {
    return;
  }

  let sourceLines: FragmentLine[] = [];
  const fileContents = await fs.promises.readFile(fileUri, 'utf8');
  const sourceMapUrl = extractSourceMappingUrl(fileUri, fileContents);

  // Parse source maps
  if (sourceMapUrl) {
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
      chalk.gray(
        `  ${line.highlight ? chalk.red('> ') : '  '}${line.line} | `
      ) +
      // Replace tabs with spaces and highlight
      highlight(line.source.replace(/\t/g, '  '), {
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
export async function parseError(
  error: Error | StatsError,
  type?: 'compile' | 'runtime'
): Promise<ParsedErrorData> {
  const parsedErrorData: ParsedErrorData = {
    name: error.name,
    message: error.message,
    stack: error.stack,
  };

  // Try to parse an error
  if (type === 'compile') {
    const compileError = parseCompileError(error);

    // Extract parsed parts
    parsedErrorData.name = compileError?.name;
    parsedErrorData.message = compileError?.message;
    parsedErrorData.fileUri = compileError?.fileUri;
    parsedErrorData.column = compileError?.column;
    parsedErrorData.line = compileError?.line;

    return parsedErrorData;
  }

  if (type === 'runtime' && error.stack) {
    const parsedStack = stackTraceParser.parse(error.stack);

    // Extract parsed parts from error stack
    parsedErrorData.functionName = parsedStack[0].methodName;
    parsedErrorData.fileUri = parsedStack[0].file ?? undefined;
    parsedErrorData.column = parsedStack[0].column ?? undefined;
    parsedErrorData.line = parsedStack[0].lineNumber ?? undefined;

    return parsedErrorData;
  }

  return parsedErrorData;
}

/**
 * Formats provided error object into readable format including
 * the errored source code fragment with line highlight. Works
 * with runtime and compile errors while trying to show all
 * relevant information that can be extracted from provided object.
 *
 * @param {ParsedErrorData} parsedErrorData Parsed error data object
 *  obtained from parseError function (or provided directly).
 * @param {string?} rootDir Optional root directory used to print
 *  absolute URLs as relative to the current rootDir.
 * @param {string[]?} uniqueTracker Array of error identifiers to
 *  track uniques, if the error matches identifier already included
 *  in this array, this function returns empty string.
 * @returns {Promise<string>} Formatted error output.
 */
export async function formatError(
  parsedErrorData: ParsedErrorData,
  rootDir?: string,
  uniqueTracker?: string[]
): Promise<string> {
  let { fileUri } = parsedErrorData;
  const { column, functionName, line, message, name, stack } = parsedErrorData;

  // Normalize fileUri
  if (fileUri && rootDir) {
    fileUri = fileUri.replace(rootDir, '.');
  }

  // Get source fragment
  const sourceFragment = await getSource(fileUri, line, column);

  // Track unique errors
  if (Array.isArray(uniqueTracker)) {
    const errorIdentifier = `${fileUri}:${line}:${column}`;

    // Return empty string for already processed errors
    if (uniqueTracker.includes(errorIdentifier)) {
      return '';
    } else {
      uniqueTracker.push(errorIdentifier);
    }
  }

  // Assemble error message
  return [
    fileUri &&
      [
        functionName && `${chalk.magenta(`${functionName}`)} at`,
        chalk.underline.bold.blueBright(fileUri) + `:${line}:${column}`,
      ]
        .filter(Boolean)
        .join(' '),
    name && `${chalk.redBright(`${name}:`)} ` + message,
    ...(sourceFragment ? ['', ...sourceFragment] : []),
    stack && `\n${chalk.gray(stack.replace('', ''))}`,
    '', // Empty line
  ]
    .filter(value => value === '' || !!value)
    .join('\n');
}
