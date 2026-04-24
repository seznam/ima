import _traverse, { NodePath } from '@babel/traverse';
import * as b from '@babel/types';

// https://github.com/babel/babel/issues/13855
// This can be removed with @babel/traverse v8 when the package will be ESM-only
const traverse = (_traverse as unknown as { default: typeof _traverse })
  .default;

import { UseServerProcessor } from '../../../types';
/**
 * Checks if the import path is for the super class.
 */
function isImportsForSuperClass(
  importPath: NodePath<b.ImportDeclaration>,
  superName: string
) {
  return importPath.node.specifiers.some(
    spec =>
      (b.isImportSpecifier(spec) && spec.local.name === superName) ||
      (b.isImportDefaultSpecifier(spec) && spec.local.name === superName)
  );
}

/**
 * Process the body of a class. We're looking for $dependencies static field
 * and adding it to the class if it's not present. To make sure the
 * runtime still works as expected.
 */
function processClassBody(members: b.ClassBody['body']) {
  const newMembers = [];
  let hasDependenciesGetter = false;

  for (const m of members) {
    // Handle class properties (static $dependencies = [];)
    if (
      b.isClassProperty(m) &&
      m.static &&
      b.isIdentifier(m.key) &&
      m.key.name === '$dependencies'
    ) {
      hasDependenciesGetter = true;
      continue;
    }

    // Handle class method getters (static get $dependencies() {})
    if (
      b.isClassMethod(m) &&
      m.static &&
      m.kind === 'get' &&
      b.isIdentifier(m.key) &&
      m.key.name === '$dependencies'
    ) {
      hasDependenciesGetter = true;
      continue;
    }
  }

  if (hasDependenciesGetter) {
    const newMember = b.classProperty(
      b.identifier('$dependencies'),
      b.arrayExpression([])
    );

    newMember.static = true;

    newMembers.push(newMember);
  }

  return newMembers;
}

/**
 * Create a class stub declaration.
 */
function createClassStubDeclaration(decl: b.ClassDeclaration) {
  const body = processClassBody(decl.body.body);
  return b.classDeclaration(decl.id, decl.superClass, b.classBody(body));
}

/**
 * Create a class stub expression.
 */
function createClassStubExpression(expr: b.ClassExpression) {
  const body = processClassBody(expr.body.body);
  return b.classExpression(expr.id, expr.superClass, b.classBody(body));
}

/**
 * Creates a throw statement for a function.
 */
function createThrowBody(name: string) {
  return b.blockStatement([
    b.throwStatement(
      b.newExpression(b.identifier('Error'), [
        b.stringLiteral(
          `Cannot call server-only function${name ? ` "${name}"` : ''} on client`
        ),
      ])
    ),
  ]);
}

/**
 * Create a function stub declaration.
 */
function createFunctionStubDeclaration(decl: b.FunctionDeclaration) {
  const name = decl.id?.name ?? '';
  const body = createThrowBody(name);
  return b.functionDeclaration(
    decl.id,
    decl.params,
    body,
    decl.generator,
    decl.async
  );
}

/**
 * Create a function stub expression.
 */
function createFunctionStubExpression(
  expr: b.FunctionExpression | b.ArrowFunctionExpression
) {
  const name = 'id' in expr && expr.id?.name ? expr.id.name : '';
  const body = createThrowBody(name);

  if (b.isArrowFunctionExpression(expr)) {
    return b.arrowFunctionExpression(expr.params, body, expr.async);
  } else {
    return b.functionExpression(
      expr.id,
      expr.params,
      body,
      expr.generator,
      expr.async
    );
  }
}

/**
 * General use server processor, that will stub out all server-only code.
 * Handles functions and classes, while having special handling for
 * $dependencies static fields.
 *
 * Supports two patterns:
 *  1. `export class Foo {}` / `export function foo(){}` (tsc output)
 *  2. `var/let/const Foo = class {}; export { Foo }` (Rolldown preserveModules output)
 */
export const stubProcessor: UseServerProcessor = ast => {
  const stubExports: (b.ExportDefaultDeclaration | b.ExportNamedDeclaration)[] =
    [];

  const imports = new Set();

  // Build a map of top-level variable declarations by identifier name
  // so we can look up `var/let/const Foo = class {}` when we see `export { Foo }`.
  const topLevelVarDeclarators = new Map<
    string,
    { declarator: b.VariableDeclarator; declaration: b.VariableDeclaration }
  >();
  for (const node of ast.program.body) {
    if (b.isVariableDeclaration(node)) {
      for (const declarator of node.declarations) {
        if (b.isIdentifier(declarator.id)) {
          topLevelVarDeclarators.set(declarator.id.name, {
            declarator,
            declaration: node,
          });
        }
      }
    }
  }

  /**
   * Collect the import for the super class of a class declaration.
   */
  function collectSuperImport(
    superClass: b.Expression | null | undefined,
    path: NodePath
  ) {
    if (!superClass || !b.isIdentifier(superClass)) {
      return;
    }
    const superName = superClass.name;
    const program = path.findParent(p => b.isProgram(p.node));
    if (!program) {
      return;
    }
    program.traverse({
      ImportDeclaration(importPath: { node: b.ImportDeclaration }) {
        if (
          isImportsForSuperClass(
            importPath as unknown as NodePath<b.ImportDeclaration>,
            superName
          )
        ) {
          imports.add(importPath.node);
        }
      },
    });
  }

  /**
   * We're looking for export declarations and stubbing out the code
   * along the way, while maintaining the original imports/exports.
   */
  traverse(ast, {
    ExportNamedDeclaration(path) {
      const { node } = path;
      const declaration = node.declaration;

      // Pattern 1: `export class Foo {}` or `export function foo() {}`
      if (declaration) {
        if (b.isClassDeclaration(declaration)) {
          collectSuperImport(declaration.superClass, path);
          const stub = createClassStubDeclaration(declaration);
          stubExports.push(b.exportNamedDeclaration(stub, []));
          return;
        }

        if (b.isFunctionDeclaration(declaration)) {
          const stub = createFunctionStubDeclaration(declaration);
          stubExports.push(b.exportNamedDeclaration(stub, []));
          return;
        }

        if (b.isVariableDeclaration(declaration)) {
          const newDeclarations = [];

          for (const declarator of declaration.declarations) {
            let init = declarator.init;
            let stubbed = false;

            if (b.isClassExpression(init)) {
              init = createClassStubExpression(init);
              stubbed = true;
            } else if (
              b.isFunctionExpression(init) ||
              b.isArrowFunctionExpression(init)
            ) {
              init = createFunctionStubExpression(init);
              stubbed = true;
            }

            if (stubbed) {
              newDeclarations.push(b.variableDeclarator(declarator.id, init));
            }
          }

          if (newDeclarations.length > 0) {
            const newVar = b.variableDeclaration(
              declaration.kind,
              newDeclarations
            );
            stubExports.push(b.exportNamedDeclaration(newVar, []));
          }
          return;
        }

        return;
      }

      // Pattern 2: `export { Foo }` — look up the variable declaration
      if (node.specifiers.length > 0 && !node.source) {
        const newSpecifiers: (
          | b.ExportSpecifier
          | b.ExportDefaultSpecifier
          | b.ExportNamespaceSpecifier
        )[] = [];

        for (const specifier of node.specifiers) {
          if (!b.isExportSpecifier(specifier)) {
            newSpecifiers.push(specifier);
            continue;
          }

          const localName = b.isIdentifier(specifier.local)
            ? specifier.local.name
            : null;

          if (!localName) {
            newSpecifiers.push(specifier);
            continue;
          }

          const entry = topLevelVarDeclarators.get(localName);
          if (!entry) {
            newSpecifiers.push(specifier);
            continue;
          }

          const { declarator } = entry;
          const init = declarator.init;

          if (b.isClassExpression(init)) {
            collectSuperImport(init.superClass, path);
            const stubbed = createClassStubExpression(init);
            stubExports.push(
              b.exportNamedDeclaration(
                b.variableDeclaration(entry.declaration.kind, [
                  b.variableDeclarator(declarator.id, stubbed),
                ]),
                []
              )
            );
            // keep the re-export specifier
            newSpecifiers.push(specifier);
          } else if (
            b.isFunctionExpression(init) ||
            b.isArrowFunctionExpression(init)
          ) {
            const stubbed = createFunctionStubExpression(init);
            stubExports.push(
              b.exportNamedDeclaration(
                b.variableDeclaration(entry.declaration.kind, [
                  b.variableDeclarator(declarator.id, stubbed),
                ]),
                []
              )
            );
            newSpecifiers.push(specifier);
          } else {
            // Not a stubbable value — keep as-is
            newSpecifiers.push(specifier);
          }
        }

        // Replace original export specifiers node with only the kept ones
        // (stubbed ones are re-emitted above as var decl + export)
        if (newSpecifiers.length !== node.specifiers.length) {
          if (newSpecifiers.length === 0) {
            path.remove();
          } else {
            node.specifiers = newSpecifiers;
          }
        }
      }
    },
    ExportDefaultDeclaration(path) {
      const { node } = path;
      let stub;

      if (
        b.isClassDeclaration(node.declaration) &&
        node.declaration.superClass &&
        b.isIdentifier(node.declaration.superClass)
      ) {
        collectSuperImport(node.declaration.superClass, path);
      }

      if (b.isClassDeclaration(node.declaration)) {
        stub = createClassStubDeclaration(node.declaration);
      } else if (b.isFunctionDeclaration(node.declaration)) {
        stub = createFunctionStubDeclaration(node.declaration);
      } else if (b.isClassExpression(node.declaration)) {
        stub = createClassStubExpression(node.declaration);
      } else if (
        b.isFunctionExpression(node.declaration) ||
        b.isArrowFunctionExpression(node.declaration)
      ) {
        stub = createFunctionStubExpression(node.declaration);
      }

      if (stub) {
        stubExports.push(b.exportDefaultDeclaration(stub));
      }
    },
  });

  // Prepend collected imports to body
  ast.program.body = [...Array.from(imports), ...stubExports] as b.Statement[];
  ast.program.directives = [];

  return ast;
};
