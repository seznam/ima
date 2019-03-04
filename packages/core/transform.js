module.exports = function(fileInfo, api) {
  const jscodeshift = api.jscodeshift;
  const root = jscodeshift(fileInfo.source);
  const regexIma = /ima\//;

  const importDeclarations = root
    .find(jscodeshift.ImportDeclaration)
    .filter(node => {
      return regexIma.test(node.value.source.value);
    });

  if (importDeclarations.size() != 0) {
    const specifiers = [];
    importDeclarations.forEach(node => {
      specifiers.push(...node.value.specifiers);
    });

    specifiers.forEach(specifier => {
      if (specifier.type != 'ImportSpecifier') {
        specifier.type = 'ImportSpecifier';
        specifier.imported = Object.assign({}, specifier.local);
      }
    });

    const newImport = jscodeshift.importDeclaration(
      specifiers,
      jscodeshift.literal('ima')
    );

    importDeclarations.remove();

    root.get().node.program.body.unshift(newImport);
  }

  return root.toSource({ quote: 'single' });
};
