import { LoaderDefinitionFunction } from 'webpack';

export interface JsStringLoaderOptions {
  /** Whether to include source maps in the output string */
  includeSourceMap?: boolean;
}

/**
 * Converts compiled JavaScript/TypeScript source into a string export.
 * This loader should be placed before swc-loader in the chain.
 * The compilation is handled by subsequent loaders (swc-loader),
 * this loader just wraps the result as a string export.
 */
const JsStringLoader: LoaderDefinitionFunction<JsStringLoaderOptions> =
  function (source) {
    const options = this.getOptions();
    const { includeSourceMap = false } = options;

    // If we have source maps and they're requested, include them
    if (includeSourceMap && this.sourceMap) {
      const sourceMapComment = `\n//# sourceMappingURL=data:application/json;base64,${Buffer.from(
        JSON.stringify(this.sourceMap)
      ).toString('base64')}`;

      return `export default ${JSON.stringify(source + sourceMapComment)};`;
    }

    // Return the compiled source as a string export
    return `export default ${JSON.stringify(source)};`;
  };

export default JsStringLoader;
