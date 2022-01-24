interface SourceFragmentLine {
  line: string;
  source: string;
  highlight: boolean;
}

/**
 * StackFrame entity. It contains information about parsed stack frame
 * with optional original source fileName, line, column and source if available.
 */
class StackFrame {
  fileName?: string;
  functionName?: string | null;
  sourceFragment?: SourceFragmentLine[] | null;

  lineNumber?: number;
  columnNumber?: number;

  originalFileName?: string | null;
  originalLineNumber?: number | null;
  originalColumnNumber?: number | null;
  originalSourceFragment?: SourceFragmentLine[] | null;

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
  static createSourceFragment(
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

  constructor({
    fileName,
    functionName,
    sourceFragment,
    lineNumber,
    columnNumber,
    originalFileName,
    originalLineNumber,
    originalColumnNumber,
    originalSourceFragment,
  }: {
    fileName?: string;
    functionName?: string | null;
    sourceFragment?: SourceFragmentLine[] | null;
    lineNumber?: number;
    columnNumber?: number;
    originalFileName?: string | null;
    originalLineNumber?: number | null;
    originalColumnNumber?: number | null;
    originalSourceFragment?: SourceFragmentLine[] | null;
  }) {
    this.fileName = fileName;
    this.functionName = functionName;
    this.sourceFragment = sourceFragment;

    this.lineNumber = lineNumber;
    this.columnNumber = columnNumber;

    this.originalFileName = originalFileName;
    this.originalLineNumber = originalLineNumber;
    this.originalColumnNumber = originalColumnNumber;
    this.originalSourceFragment = originalSourceFragment;
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
    return (
      this.originalFileName?.split('/').pop() ?? '(unable to parse filename)'
    );
  }

  /**
   * Return original fileUri stripped of path prefixes.
   *
   * @returns {string|undefined}
   */
  getPrettyOriginalFileUri(): string | undefined {
    const strippedUri = this.originalFileName?.replace(
      /^(webpack:\/\/|webpack-internal:\/\/\/)/gi,
      ''
    );

    const indexOfFirstSlash = strippedUri?.indexOf('/');

    // Print path relative from project dir
    return indexOfFirstSlash
      ? `./${strippedUri?.substring(indexOfFirstSlash + 1)}`
      : strippedUri;
  }
}

export { StackFrame, SourceFragmentLine };
