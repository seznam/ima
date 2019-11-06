/**
 * Find import statements with specified package name.
 *
 * @param {core.JSCodeshift|core} j Reference to the jscodeshift library.
 * @param {Collection} ast Root collection of AST.
 * @param {string} pkg Package name.
 * @returns {Collection}
 */
function findImport(j, ast, pkg) {
  return ast.find(j.ImportDeclaration, {
    source: {
      value: pkg
    }
  });
}

/**
 * Add named imports to JS import statement with specified package name.
 * If some import from specified package already exists, named imports are
 * added to this import statement. Otherwise new import statement is created
 * and added to top of the transformed file.
 *
 * @example
 * addNamedImports(j, ast, ['LinkHelper'], '@cns/utils');
 *
 * @param {core.JSCodeshift|core} j Reference to the jscodeshift library.
 * @param {Collection} ast Root collection of AST.
 * @param {[string]} names Named import names.
 * @param {string} pkg Package name.
 */
function addNamedImports(j, ast, names, pkg) {
  // Add to existing import declaration if it exists
  const existingImport = findImport(j, ast, pkg);
  if (existingImport.size()) {
    const specifiersRoot = existingImport.get('specifiers', 0);

    names.map(name => {
      // Check for duplicates
      const isDupe = existingImport
        .find(j.ImportSpecifier, {
          imported: {
            name
          }
        })
        .size();

      if (!isDupe) {
        specifiersRoot.insertBefore(j.importSpecifier(j.identifier(name)));
      }
    });
  } else {
    ast
      .find(j.Program)
      .get('body', 0)
      .insertBefore(
        j.importDeclaration(
          names.map(name => {
            return j.importSpecifier(j.identifier(name));
          }),
          j.literal(pkg)
        )
      );
  }
}

module.exports = {
  findImport,
  addNamedImports
};
