const RE_VALID_FRAME_CHROME = /^\s*(at|in)\s.+(:\d+)/;
const RE_VALID_FRAME_FIREFOX =
  /(^|\/?@)\S+:\d+|.+line\s+\d+\s+>\s+(eval|Function).+/;

export interface FragmentLine {
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
 * @returns {FragmentLine[]} Array of source code lines.
 */
function createSourceFragment(
  line: number,
  source: string,
  contextLines = 4
): FragmentLine[] {
  const lines = source.split('\n');
  const startLine = Math.max(0, line - contextLines - 1);
  const endLine = Math.min(lines.length, line + contextLines);
  const fragmentLines: FragmentLine[] = [];

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

export { RE_VALID_FRAME_CHROME, RE_VALID_FRAME_FIREFOX, createSourceFragment };
