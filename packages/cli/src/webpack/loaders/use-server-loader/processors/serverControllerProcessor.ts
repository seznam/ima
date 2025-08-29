import traverse, { NodePath } from '@babel/traverse';
import * as b from '@babel/types';

import { UseServerProcessor } from '../types';

/**
 * Checks if a class is a controller class. We really look at the
 * existence of `controller` substring in the parent class name,
 * since users can create their own abstract controllers and we can't
 * know if they are extending the `AbstractController` class.
 */
function isControllerClass(
  node: b.ClassDeclaration | b.ClassExpression
): boolean {
  return !!(
    node.superClass &&
    b.isIdentifier(node.superClass) &&
    node.superClass.name.toLowerCase().includes('controller')
  );
}

function createThrowingLoadMethod() {
  return b.classMethod(
    'method',
    b.identifier('load'),
    [],
    b.blockStatement([
      b.throwStatement(
        b.newExpression(b.identifier('GenericError'), [
          b.stringLiteral('Route not found.'),
          b.objectExpression([
            b.objectProperty(b.identifier('status'), b.numericLiteral(404)),
          ]),
        ])
      ),
    ])
  );
}

function hasGenericErrorImport(
  importPath: NodePath<b.ImportDeclaration>
): boolean {
  if (
    importPath.node.source.value === '@ima/core' &&
    importPath.node.specifiers.some(
      spec =>
        b.isImportSpecifier(spec) &&
        b.isIdentifier(spec.imported) &&
        spec.imported.name === 'GenericError'
    )
  ) {
    return true;
  }

  return false;
}

function addOrReplaceLoadMethod(
  classNode: b.ClassDeclaration | b.ClassExpression
) {
  let loadMethodExists = false;

  classNode.body.body = classNode.body.body.map(member => {
    if (
      b.isClassMethod(member) &&
      b.isIdentifier(member.key) &&
      member.key.name === 'load'
    ) {
      loadMethodExists = true;
      return createThrowingLoadMethod();
    }
    return member;
  });

  if (!loadMethodExists) {
    classNode.body.body.push(createThrowingLoadMethod());
  }
}

/**
 * Special processor for server-only controllers. We're looking for
 * controller classes and replacing the `load` method with a throwing
 * method, to make sure the controller is not called on the client and
 * if so, it throws a `GenericError` with a 404 status code.
 */
export const serverControllerProcessor: UseServerProcessor = ast => {
  const imports = new Set();
  let needsGenericErrorImport = false;
  let alreadyHasGenericErrorImport = false;

  traverse(ast, {
    ClassDeclaration(path) {
      if (isControllerClass(path.node)) {
        needsGenericErrorImport = true;
        addOrReplaceLoadMethod(path.node);
      }
    },
    ClassExpression(path) {
      if (isControllerClass(path.node)) {
        needsGenericErrorImport = true;
        addOrReplaceLoadMethod(path.node);
      }
    },
    ImportDeclaration(path) {
      imports.add(path.node);
      alreadyHasGenericErrorImport = hasGenericErrorImport(path);
    },
  });

  if (needsGenericErrorImport && alreadyHasGenericErrorImport) {
    ast.program.body.unshift(
      b.importDeclaration(
        [
          b.importSpecifier(
            b.identifier('GenericError'),
            b.identifier('GenericError')
          ),
        ],
        b.stringLiteral('@ima/core')
      )
    );
  }

  return ast;
};
