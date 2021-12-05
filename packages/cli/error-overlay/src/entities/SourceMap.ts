import {
  NullablePosition,
  NullableMappedPosition,
  BasicSourceMapConsumer
} from 'source-map';

/**
 * Original {@link https://github.com/facebook/create-react-app/blob/main/packages/react-dev-utils/evalSourceMapMiddleware.js}.
 * Wrapper around {@link https://www.npmjs.com/package/source-map} with unified interface.
 */
class SourceMap {
  private sourceMap: BasicSourceMapConsumer;

  constructor(sourceMap: BasicSourceMapConsumer) {
    this.sourceMap = sourceMap;
  }

  /**
   * Returns the original code position for a generated code position.
   *
   * @param {number} line The line of the generated code position.
   * @param {number} column The column of the generated code position.
   * @returns {NullableMappedPosition}
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
   *
   * @param {string} source The source file of the original code position.
   * @param {number} line The line of the original code position.
   * @param {number} column The column of the original code position.
   * @returns {NullablePosition}
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
   *
   * @param {string} sourceName The name of the source file.
   * @returns {string | null}
   */
  getSource(sourceName: string): string | null {
    return this.sourceMap.sourceContentFor(sourceName);
  }

  /**
   * Returns list of all source files this sourceMap manages.
   *
   * @returns {string[]}
   */
  getSources(): string[] {
    return this.sourceMap.sources;
  }
}

export { SourceMap };
