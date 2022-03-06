import {
  NullablePosition,
  NullableMappedPosition,
  BasicSourceMapConsumer,
} from 'source-map';

/**
 * Original {@link https://github.com/facebook/create-react-app/blob/main/packages/react-dev-utils/evalSourceMapMiddleware.js}.
 * Wrapper around {@link https://www.npmjs.com/package/source-map} with unified interface.
 */
class SourceMap {
  private _sourceMap: BasicSourceMapConsumer;

  constructor(sourceMap: BasicSourceMapConsumer) {
    this._sourceMap = sourceMap;
  }

  /**
   * Returns the original code position for a generated code position.
   *
   * @param {number} line The line of the generated code position.
   * @param {number} column The column of the generated code position.
   * @returns {NullableMappedPosition}
   */
  originalPositionFor(
    line: number,
    column: number
  ): Partial<NullableMappedPosition> {
    return this._sourceMap.originalPositionFor({
      line,
      column,
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
  generatedPositionFor(
    source: string,
    line: number,
    column: number
  ): NullablePosition {
    return this._sourceMap.generatedPositionFor({
      source,
      line,
      column,
    });
  }

  /**
   * Returns the code for a given source file name.
   *
   * @param {string} sourceName The name of the source file.
   * @returns {string | null}
   */
  sourceContentFor(sourceName: string): string | null {
    return this._sourceMap.sourceContentFor(sourceName);
  }

  /**
   * Returns list of all source files this sourceMap manages.
   *
   * @returns {string[]}
   */
  getSources(): string[] {
    return this._sourceMap.sources;
  }

  /**
   * Destroy loaded source map to free up allocated memory by wasm module.
   */
  destroy(): void {
    this._sourceMap.destroy();
  }
}

export { SourceMap };
