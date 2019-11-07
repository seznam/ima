/**
 * Returns modified default options object that is passed to recast
 * in jscodeshift toSource function.
 *
 * @returns {Object} JSCodeshift output recast options.
 */
export function getOptions() {
  return {
    quote: 'single',
    trailingComma: {
      objects: false,
      arrays: false,
      functions: false
    }
  };
}

/**
 * Returns transformed ast tree with default testing options.
 * It is essentially wrapper for ast.toSource with default options.
 *
 * @param {Collection} ast root AST collection.
 * @returns {string|*} transformed AST source code.
 */
export function source(ast) {
  return ast.toSource(getOptions());
}

module.exports = {
  getOptions,
  source
};
