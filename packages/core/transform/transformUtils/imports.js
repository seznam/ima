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

/**
 * Remove unused import statements with specified package name.
 * If some import from specified package does not exist, it is ignored.
 * Warning! If there are multiple imports from single package,
 * it will be removed completely only if no imported variables are used, otherwise all
 * imports (even those not being unused) are kept. (@todo fix this)
 *
 * @example
 * removeNamedImports(j, ast, '@cns/utils');
 *
 * @param {core.JSCodeshift|core} j Reference to the jscodeshift library.
 * @param {Collection} ast Root collection of AST.
 * @param {string} pkg Package name.
 */
function removeUnusedPackageImports(j, ast, pkg) {
  findImport(j, ast, pkg)
    .filter(path => {
      return (
        path.value.specifiers
          .map(spec => {
            return ast
              .find(j.Identifier, { name: spec.local.name })
              .filter(identifier => identifier.parentPath.value !== spec)
              .size();
          })
          .reduce((a, b) => a + b, 0) === 0
      );
    })
    .remove();
}

module.exports = {
  findImport,
  addNamedImports,
  removeUnusedPackageImports
};
