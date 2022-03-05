import { StatsError } from 'webpack';

import { CompileError } from '#/types';

import {
  babelLoaderErrorParser,
  cssLoaderErrorParser,
  lessLoaderErrorParser,
  swcLoaderErrorParser,
  webpackErrorParser,
} from './parsers';

export interface SourceFragmentLine {
  line: string;
  source: string;
  highlight: boolean;
}

/**
 * Create fragment of code lines around input line (above and below), created
 * created from provided source code.
 *
 * @param {number} line Source code line number, around which
 *        you want to created source fragment.
 * @param {string} source Source file's source code.
 * @param {number} [contextLines=4] Number of lines to generate,
 *        below and after watched line.
 * @returns {SourceFragmentLine[]} Array of source code lines.
 */
function createSourceFragment(
  line: number,
  source: string,
  contextLines = 4
): SourceFragmentLine[] {
  const lines = source.split('\n');
  const startLine = Math.max(0, line - contextLines - 1);
  const endLine = Math.min(lines.length, line + contextLines);
  const fragmentLines: SourceFragmentLine[] = [];

  /**
   * Lines are numbered from 1 up, but indexes are from 0 up,
   * so we need to adjust line number and highlighted line accordingly.
   */
  for (let i = startLine; i < endLine; i++) {
    fragmentLines.push({
      line: (i + 1).toString(),
      source: lines[i],
      highlight: i === line - 1,
    });
  }

  // Adjust line paddings
  const endLineWidth = fragmentLines[fragmentLines.length - 1].line.length;
  fragmentLines.forEach(fragmentLine => {
    fragmentLine.line = fragmentLine.line.padStart(endLineWidth, ' ');
  });

  return fragmentLines;
}

/**
 * Tries to parse error location from an error object. Which can be
 * either webpack stats error or simple Error object.
 *
 * @param {StatsError & Error} error webpack stats object or error instance.
 * @returns {CompileError | null} Parsed compile error.
 */
function parseCompileError(error: StatsError & Error): CompileError | null {
  // Parse compile errors
  if (error.message?.includes('swc-loader')) {
    return swcLoaderErrorParser(error);
  } else if (error.message?.includes('babel-loader')) {
    return babelLoaderErrorParser(error);
  } else if (error.message?.includes('less-loader')) {
    return lessLoaderErrorParser(error);
  } else if (
    error.message?.includes('postcss-loader') ||
    error.message?.includes('css-loader')
  ) {
    return cssLoaderErrorParser(error);
  }

  // Fallback to general webpack error parser
  return webpackErrorParser(error);
}

export { parseCompileError, createSourceFragment };
