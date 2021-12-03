interface SourceFragmentLine {
  line: number;
  source: string;
  highlight: boolean;
}

// FIXME Optimize splitting every source (many errors can share one source)
class SourceFragment {
  public errLine: number;
  public lines: SourceFragmentLine[];

  // TODO maybe create context lines dynamic, so the first line can have more around?
  static createFragment(
    line: number,
    source: string,
    contextLines = 4
  ): SourceFragment {
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
        line: i + 1,
        source: lines[i],
        highlight: i === line - 1
      });
    }

    return new SourceFragment(line, fragmentLines);
  }

  constructor(errLine: number, lines: SourceFragmentLine[]) {
    this.errLine = errLine;
    this.lines = lines;
  }
}

export { SourceFragment };
