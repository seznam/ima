const { getOptions } = require('./transformUtils/testUtils');

const IMPORT_MAP = require('./import-v17-map.json');
const EXCEPTIONS = ['ima/main'];

module.exports = function (fileInfo, api, options) {
  const jscodeshift = api.jscodeshift;
  const ast = jscodeshift(fileInfo.source);
  const regexIma = /^ima\//;
  const importDeclarations = ast
    .find(jscodeshift.ImportDeclaration)
    .filter(node => {
      return regexIma.test(node.value.source.value);
    });

  if (importDeclarations.size() !== 0) {
    const specifiers = [];
    importDeclarations.forEach(path => {
      const MAP = IMPORT_MAP[path.value.source.value];
      path.canBeDeleted = true;
      if (!MAP && !EXCEPTIONS.includes(path.value.source.value)) {
        console.error(
          `Import from path '${path.value.source.value}' is no longer possible! Check '${fileInfo.path}' and fix the error manually.`
        );
        path.canBeDeleted = false;
        return;
      }
      path.value.specifiers.forEach(spec => {
        switch (spec.type) {
          case 'ImportDefaultSpecifier':
            if (!MAP.defaultKey) {
              console.error(
                `Default key is no longer exported from '${path.value.source.value}'. Check '${fileInfo.path}' and fix the error manually.`
              );
              path.canBeDeleted = false;
              return;
            }
            spec.type = 'ImportSpecifier';
            spec.imported = Object.assign({}, spec.local, {
              name: MAP.defaultKey,
            });
            break;
          case 'ImportSpecifier':
            if (!MAP.keys.includes(spec.imported.name)) {
              console.error(
                `Import of key '${spec.local.name}' is no longer possible! Check '${fileInfo.path}' and fix the error manually.`
              );
              path.canBeDeleted = false;
              return;
            }
            break;
          case 'ImportNamespaceSpecifier':
            if (!EXCEPTIONS.includes(path.value.source.value)) {
              if (!MAP.allAs) {
                console.error(
                  `All keys from file '${path.value.source.value}' are no longer exported. You have to access specific keys directly, or import whole '@ima/core'. Be aware, that the desired keys may no longer exist and you may need to find their replacement. Check '${fileInfo.path}' and fix the error manually.`
                );
                path.canBeDeleted = false;
                return;
              }
              spec.type = 'ImportSpecifier';
              spec.local.name = MAP.allAs;
              spec.imported = Object.assign({}, spec.local);
            } else {
              path.value.source.value = '@ima/core';
              path.canBeDeleted = false;
              return;
            }
            break;
          default:
            console.error(
              `Unknown spec type '${spec.type}'. Check '${fileInfo.path}' and fix the error manually.`
            );
            path.canBeDeleted = false;
            return;
        }

        specifiers.push(spec);
      });
    });

    if (specifiers.length > 0) {
      const newImport = jscodeshift.importDeclaration(
        specifiers,
        jscodeshift.literal('@ima/core')
      );

      importDeclarations.filter(path => path.canBeDeleted).remove();

      ast.get().node.program.body.unshift(newImport);
    }
  }

  return ast.toSource(Object.assign({}, getOptions(), options));
};
