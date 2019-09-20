import { addNamedImports } from './transformUtils/imports';
import { getOptions } from './transformUtils/testUtils';

module.exports = function(fileInfo, api, options) {
  const { jscodeshift: j } = api;
  const ast = j(fileInfo.source);

  const contextTypes = ast.find(j.MethodDefinition, {
    key: {
      name: 'contextTypes'
    }
  });

  if (contextTypes.size()) {
    // Replace contextTypes method with contextType
    const identifier = contextTypes.get('key', 0);
    identifier.node.name = 'contextType';

    // Replace body of the method with return statement which returns PageContext
    contextTypes
      .find(j.ReturnStatement)
      .find(j.ObjectExpression)
      .replaceWith(j.identifier('PageContext'));

    // Add Page context named import to a file
    addNamedImports(j, ast, ['PageContext'], '@ima/core');
  }

  return ast.toSource(Object.assign({}, getOptions(), options));
};
