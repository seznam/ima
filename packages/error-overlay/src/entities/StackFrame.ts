import { FragmentLine } from '@ima/dev-utils/sourceFragment';

/**
 * StackFrame entity. It contains information about parsed stack frame
 * with optional original source fileName, line, column and source if available.
 */
class StackFrame {
  rootDir?: string;

  fileName?: string;
  line?: number;
  column?: number;
  sourceFragment?: FragmentLine[] | null;
  functionName?: string | null;

  orgFileName?: string | null;
  orgLine?: number | null;
  orgColumn?: number | null;
  orgSourceFragment?: FragmentLine[] | null;

  constructor({
    rootDir,
    fileName,
    line,
    column,
    sourceFragment,
    functionName,
    orgFileName,
    orgLine,
    orgColumn,
    orgSourceFragment,
  }: {
    rootDir?: string;
    fileName?: string;
    line?: number;
    column?: number;
    functionName?: string | null;
    sourceFragment?: FragmentLine[] | null;
    orgFileName?: string | null;
    orgLine?: number | null;
    orgColumn?: number | null;
    orgSourceFragment?: FragmentLine[] | null;
  }) {
    this.rootDir = rootDir;

    this.fileName = fileName;
    this.line = line;
    this.column = column;
    this.sourceFragment = sourceFragment;
    this.functionName = functionName;

    this.orgFileName = orgFileName;
    this.orgLine = orgLine;
    this.orgColumn = orgColumn;
    this.orgSourceFragment = orgSourceFragment;
  }

  /**
   * Returns the name of stack frame function.
   *
   * @returns {string} Name of the function (anonymous) if unavailable.
   */
  getFunctionName(): string {
    return this.functionName || '(anonymous function)';
  }

  /**
   * Returns the file name at originalFileName path
   *
   * @returns {string} Name of the file (after last slash).
   */
  getPrettyFileName(): string {
    return this.orgFileName?.split('/').pop() ?? '(unable to parse filename)';
  }

  /**
   * Return original fileUri stripped of path prefixes.
   *
   * @returns {string|undefined}
   */
  getPrettyOriginalFileUri(): string | undefined {
    const strippedUri = this.orgFileName?.replace(
      /^(webpack:\/\/|webpack-internal:\/\/\/)/gi,
      ''
    );

    const indexOfFirstSlash = strippedUri?.indexOf('/');

    // Print paths relative to app dir
    if (indexOfFirstSlash) {
      return `./${strippedUri?.substring(indexOfFirstSlash + 1)}`;
    }

    if (this.rootDir) {
      return strippedUri?.replace(this.rootDir, '.');
    }

    return strippedUri;
  }
}

export { StackFrame };
