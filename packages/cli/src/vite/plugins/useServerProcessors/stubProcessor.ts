import _traverse, { NodePath } from '@babel/traverse';
import * as b from '@babel/types';

// https://github.com/babel/babel/issues/13855
// This can be removed with @babel/traverse v8 when the package will be ESM-only
const traverse =
  (_traverse as unknown as { default: typeof _traverse }).default ?? _traverse;

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
 *
 * IMA.js uses `static $dependencies` to declare constructor dependencies for
 * the DI container. On the client side we need a stub that:
 *   - is a valid class (so `instanceof` checks don't throw)
 *   - exposes `$dependencies = []` so the DI container won't complain
 *   - does NOT execute any server-only initialisation logic
 *
 * Any other class members (methods, properties) are stripped.
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
 *
 * The stub keeps the class `id` and `extends SuperClass` so that the prototype
 * chain is intact on the client side. The body is replaced with only
 * `static $dependencies = []` when the original class had that field
 * (see `processClassBody`), so the IMA.js DI container remains happy.
 *
 * @example
 *   // Input
 *   export class MyService extends AbstractService {
 *     static $dependencies = [HttpClient];
 *     async fetchData() { return fetch('/api/data'); }
 *   }
 *   // Output
 *   export class MyService extends AbstractService {
 *     static $dependencies = [];
 *   }
 */
function createClassStubDeclaration(decl: b.ClassDeclaration) {
  const body = processClassBody(decl.body.body);
  return b.classDeclaration(decl.id, decl.superClass, b.classBody(body));
}

/**
 * Create a class stub expression.
 *
 * Same as `createClassStubDeclaration` but for class *expressions*
 * (used in `const Foo = class { ... }` or `export default class { ... }`).
 */
function createClassStubExpression(expr: b.ClassExpression) {
  const body = processClassBody(expr.body.body);
  return b.classExpression(expr.id, expr.superClass, b.classBody(body));
}

/**
 * Creates a throw statement body for a function stub.
 *
 * Any attempt to call a server-only function on the client will produce a
 * clear error instead of silently failing or running with missing dependencies.
 *
 * @example
 *   // name = "fetchUser"
 *   { throw new Error('Cannot call server-only function "fetchUser" on client') }
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
 *
 * Keeps the original signature (name, parameters, async/generator flags)
 * but replaces the body with a throw statement.
 *
 * @example
 *   // Input
 *   export async function fetchUser(id: string): Promise<User> { ... }
 *   // Output
 *   export async function fetchUser(id) {
 *     throw new Error('Cannot call server-only function "fetchUser" on client');
 *   }
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
 *
 * Works for both regular `function` expressions and arrow functions.
 * Arrow functions remain arrows; regular functions remain regular functions.
 *
 * @example
 *   // Input (arrow)
 *   export const fetchUser = async (id: string) => { ... }
 *   // Output
 *   export const fetchUser = async (id) => {
 *     throw new Error('Cannot call server-only function "fetchUser" on client');
 *   }
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
 * Supports two output patterns emitted by different compilers:
 *
 *   Pattern 1 — tsc output (inline declaration):
 *     `export class Foo extends Base { ... }`
 *     `export function foo() { ... }`
 *   The declaration is directly inside the `ExportNamedDeclaration` node.
 *
 *   Pattern 2 — Rolldown `preserveModules` output (hoisted var + specifier):
 *     `var Foo = class extends Base { ... };`
 *     `export { Foo };`
 *   The declaration is a separate top-level `VariableDeclaration`; the export
 *   is a bare specifier list with no inline declaration. The processor
 *   pre-builds an index of all top-level variable declarators so it can look
 *   up the initializer of `Foo` when it encounters `export { Foo }`.
 *
 * What is NOT preserved (silently dropped):
 *   - Plain value exports: `export { someValue }` where `someValue` is not a
 *     function/class
 *   - Re-exports from other modules: `export { Foo } from './foo'`
 *     (the `!node.source` guard skips them entirely)
 *   - Side-effect imports: `import './side-effects'` — dropped unless they
 *     import the super class of an exported class
 *   - Type-only exports: `export type { Foo }`
 *   - The `"use server"` directive itself
 */
export const stubProcessor: UseServerProcessor = ast => {
  const stubExports: (b.ExportDefaultDeclaration | b.ExportNamedDeclaration)[] =
    [];

  /**
   * Collects `ImportDeclaration` nodes that import a super class referenced by
   * one of the exported classes. These must be kept so the client bundle can
   * resolve the prototype chain (`class Foo extends Base`). All other imports
   * are discarded because the stubs don't execute any server-only logic.
   */
  const imports = new Set();

  /**
   * Index of every top-level `var/let/const` declarator keyed by identifier
   * name. Pre-built before the traverse so that Pattern 2 (`export { Foo }`)
   * can look up the initializer of `Foo` without a second pass.
   *
   * Example: for `const Foo = class extends Base {}` the map will contain:
   *   `"Foo" → { declarator: <VariableDeclarator>, declaration: <VariableDeclaration> }`
   */
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

      // Pattern 2: `export { Foo }` — look up the variable declaration.
      //
      // `node.source` is set for re-exports like `export { Foo } from './foo'`.
      // Those are always dropped because they refer to other modules' symbols
      // that we cannot stub here.
      if (node.specifiers.length > 0 && !node.source) {
        for (const specifier of node.specifiers) {
          if (!b.isExportSpecifier(specifier)) {
            continue;
          }

          const localName = b.isIdentifier(specifier.local)
            ? specifier.local.name
            : null;

          if (!localName) {
            continue;
          }

          const entry = topLevelVarDeclarators.get(localName);
          if (!entry) {
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
