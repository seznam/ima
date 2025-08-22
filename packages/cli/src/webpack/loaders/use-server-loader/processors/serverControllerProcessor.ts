import traverse from '@babel/traverse';
import * as t from '@babel/types';

import { UseServerProcessor } from '../types';

/**
 * Checks if a class is a controller class. We really look at the
 * existence of `controller` substring in the parent class name,
 * since users can create their own abstract controllers and we can't
 * know if they are extending the `AbstractController` class.
 */
function isControllerClass(
  node: t.ClassDeclaration | t.ClassExpression
): boolean {
  return !!(
    node.superClass &&
    t.isIdentifier(node.superClass) &&
    node.superClass.name.toLowerCase().includes('controller')
  );
}

function createThrowingLoadMethod() {
  return t.classMethod(
    'method',
    t.identifier('load'),
    [],
    t.blockStatement([
      t.throwStatement(
        t.newExpression(t.identifier('GenericError'), [
          t.stringLiteral('Route not found.'),
          t.objectExpression([
            t.objectProperty(t.identifier('status'), t.numericLiteral(404)),
          ]),
        ])
      ),
    ])
  );
}

function hasGenericErrorImport(ast: t.File): boolean {
  let hasImport = false;

  traverse(ast, {
    ImportDeclaration(path) {
      if (
        path.node.source.value === '@ima/core' &&
        path.node.specifiers.some(
          spec =>
            t.isImportSpecifier(spec) &&
            t.isIdentifier(spec.imported) &&
            spec.imported.name === 'GenericError'
        )
      ) {
        hasImport = true;
        path.stop();
      }
    },
  });

  return hasImport;
}

function addOrReplaceLoadMethod(
  classNode: t.ClassDeclaration | t.ClassExpression
) {
  let loadMethodExists = false;

  classNode.body.body = classNode.body.body.map(member => {
    if (
      t.isClassMethod(member) &&
      t.isIdentifier(member.key) &&
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
    },
  });

  if (needsGenericErrorImport && !hasGenericErrorImport(ast)) {
    ast.program.body.unshift(
      t.importDeclaration(
        [
          t.importSpecifier(
            t.identifier('GenericError'),
            t.identifier('GenericError')
          ),
        ],
        t.stringLiteral('@ima/core')
      )
    );
  }

  return ast;
};
