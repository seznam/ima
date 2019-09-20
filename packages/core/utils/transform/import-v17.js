import { getOptions } from './transformUtils/testUtils';

module.exports = function(fileInfo, api, options) {
  const jscodeshift = api.jscodeshift;
  const ast = jscodeshift(fileInfo.source);
  const regexIma = /ima\//;

  const importDeclarations = ast
    .find(jscodeshift.ImportDeclaration)
    .filter(node => {
      return regexIma.test(node.value.source.value);
    });

  if (importDeclarations.size() !== 0) {
    const specifiers = [];
    importDeclarations.forEach(node => {
      specifiers.push(...node.value.specifiers);
    });

    specifiers.forEach(specifier => {
      const isImaNamespaceImport =
        //import * as ima from 'ima{/whatever}'
        specifier.type === 'ImportNamespaceSpecifier' &&
        specifier.local.name === 'ima';

      if (specifier.type !== 'ImportSpecifier' && !isImaNamespaceImport) {
        specifier.type = 'ImportSpecifier';
        specifier.imported = Object.assign({}, specifier.local);
      }
    });

    const newImport = jscodeshift.importDeclaration(
      specifiers,
      jscodeshift.literal('@ima/core')
    );

    importDeclarations.remove();

    ast.get().node.program.body.unshift(newImport);
  }

  return ast.toSource(Object.assign({}, getOptions(), options));
};
