import {
  NullablePosition,
  NullableMappedPosition,
  BasicSourceMapConsumer
} from 'source-map';

/**
 * A wrapped instance of a <code>{@link https://github.com/mozilla/source-map SourceMapConsumer}</code>.
 *
 * This exposes methods which will be indifferent to changes made in <code>{@link https://github.com/mozilla/source-map source-map}</code>.
 */
export default class SourceMap {
  private sourceMap: BasicSourceMapConsumer;

  constructor(sourceMap: BasicSourceMapConsumer) {
    this.sourceMap = sourceMap;
  }

  /**
   * Returns the original code position for a generated code position.
   * @param {number} line The line of the generated code position.
   * @param {number} column The column of the generated code position.
   */
  getOriginalPosition(
    line: number,
    column: number
  ): Partial<NullableMappedPosition> {
    return this.sourceMap.originalPositionFor({
      line,
      column
    });
  }

  /**
   * Returns the generated code position for an original position.
   * @param {string} source The source file of the original code position.
   * @param {number} line The line of the original code position.
   * @param {number} column The column of the original code position.
   */
  getGeneratedPosition(
    source: string,
    line: number,
    column: number
  ): NullablePosition {
    return this.sourceMap.generatedPositionFor({
      source,
      line,
      column
    });
  }

  /**
   * Returns the code for a given source file name.
   * @param {string} sourceName The name of the source file.
   */
  getSource(sourceName: string): string | null {
    return this.sourceMap.sourceContentFor(sourceName);
  }

  getSources(): string[] {
    return this.sourceMap.sources;
  }
}
