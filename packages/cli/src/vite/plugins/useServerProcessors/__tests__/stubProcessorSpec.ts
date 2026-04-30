import _generate from '@babel/generator';
import { parse } from '@babel/parser';

import { stubProcessor } from '../stubProcessor';

// https://github.com/babel/babel/issues/13855
// This can be removed with @babel/generator v8 when the package will be ESM-only
const generate =
  (_generate as unknown as { default: typeof _generate }).default ?? _generate;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Parse a TypeScript source string into a Babel File AST.
 */
function parseSource(source: string) {
  return parse(source, {
    sourceType: 'module',
    plugins: ['typescript'],
  });
}

/**
 * Run stubProcessor on `source` and return the generated code string,
 * stripped of leading/trailing whitespace.
 */
function runStub(source: string) {
  const ast = parseSource(source);
  const result = stubProcessor(ast);
  return generate(result).code.trim();
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('stubProcessor', () => {
  // ── Function stubs ────────────────────────────────────────────────────────

  describe('exported function declarations', () => {
    it('stubs a regular exported function — keeps signature, replaces body with throw', () => {
      const code = runStub(`
        "use server";
        export function fetchUser(id) {
          return db.query(id);
        }
      `);

      expect(code).toContain('export function fetchUser');
      // The stub body is a throw — we match the invariant parts of the message
      // (the generator may escape the inner quotes as \")
      expect(code).toContain('Cannot call server-only function');
      expect(code).toContain('fetchUser');
      // Original body must be gone
      expect(code).not.toContain('db.query');
    });

    it('stubs an async exported function', () => {
      const code = runStub(`
        "use server";
        export async function loadData() {
          return await fetch('/api');
        }
      `);

      expect(code).toContain('async function loadData');
      expect(code).toContain('Cannot call server-only function');
      expect(code).not.toContain('fetch(');
    });

    it('stubs a generator exported function', () => {
      const code = runStub(`
        "use server";
        export function* generateSequence() {
          yield 1;
          yield 2;
        }
      `);

      expect(code).toContain('function* generateSequence');
      expect(code).toContain('Cannot call server-only function');
      expect(code).not.toContain('yield');
    });

    it('stubs an exported arrow function via export const', () => {
      const code = runStub(`
        "use server";
        export const getSecret = async (key) => {
          return process.env[key];
        };
      `);

      expect(code).toContain('export const getSecret');
      expect(code).toContain('Cannot call server-only function');
      expect(code).not.toContain('process.env');
    });

    it('stubs an exported function expression via export const', () => {
      const code = runStub(`
        "use server";
        export const handler = function namedHandler(req) {
          return req.body;
        };
      `);

      expect(code).toContain('export const handler');
      expect(code).toContain('Cannot call server-only function');
      expect(code).not.toContain('req.body');
    });
  });

  // ── Class stubs ───────────────────────────────────────────────────────────

  describe('exported class declarations', () => {
    it('stubs a class with no $dependencies — produces empty body', () => {
      const code = runStub(`
        "use server";
        export class ServerService {
          fetchData() {
            return db.query();
          }
        }
      `);

      expect(code).toContain('export class ServerService');
      expect(code).not.toContain('fetchData');
      expect(code).not.toContain('db.query');
      // No $dependencies since the original did not have it
      expect(code).not.toContain('$dependencies');
    });

    it('stubs a class with static $dependencies property — preserves it as empty array', () => {
      const code = runStub(`
        "use server";
        export class MyService {
          static $dependencies = [HttpClient, Logger];
          async callApi() { return fetch('/api'); }
        }
      `);

      expect(code).toContain('export class MyService');
      expect(code).toContain('static $dependencies = []');
      expect(code).not.toContain('callApi');
      // The original dependencies list is stripped
      expect(code).not.toContain('HttpClient');
    });

    it('stubs a class with static get $dependencies() getter — preserves it as empty array', () => {
      const code = runStub(`
        "use server";
        export class MyService {
          static get $dependencies() { return [HttpClient]; }
        }
      `);

      expect(code).toContain('export class MyService');
      expect(code).toContain('static $dependencies = []');
    });

    it('stubs a class with superClass — keeps the extends clause', () => {
      const code = runStub(`
        "use server";
        import { AbstractService } from '@ima/core';
        export class UserService extends AbstractService {
          static $dependencies = [];
        }
      `);

      expect(code).toContain(
        'export class UserService extends AbstractService'
      );
      // Super-class import must be preserved
      expect(code).toContain("from '@ima/core'");
      expect(code).toContain('static $dependencies = []');
    });

    it('drops imports that are not related to the super class', () => {
      const code = runStub(`
        "use server";
        import { AbstractService } from '@ima/core';
        import { Logger } from './logger';
        export class UserService extends AbstractService {}
      `);

      // Super-class import kept
      expect(code).toContain("from '@ima/core'");
      // Unrelated import dropped
      expect(code).not.toContain('./logger');
    });
  });

  // ── export default ────────────────────────────────────────────────────────

  describe('export default', () => {
    it('stubs a default exported class declaration', () => {
      const code = runStub(`
        "use server";
        export default class SecretManager {
          getSecret() { return process.env.SECRET; }
        }
      `);

      expect(code).toContain('export default class SecretManager');
      expect(code).not.toContain('getSecret');
    });

    it('stubs a default exported function declaration', () => {
      const code = runStub(`
        "use server";
        export default function handleRequest(req, res) {
          res.send(db.query());
        }
      `);

      expect(code).toContain('export default function handleRequest');
      expect(code).toContain('Cannot call server-only function');
      expect(code).not.toContain('db.query');
    });

    it('stubs a default exported anonymous function', () => {
      const code = runStub(`
        "use server";
        export default function() {
          return 'server only';
        }
      `);

      expect(code).toContain('export default function');
      // anonymous — error message has no name, just the generic part
      expect(code).toContain('Cannot call server-only function');
    });

    it('stubs a default exported class with superClass', () => {
      const code = runStub(`
        "use server";
        import { AbstractController } from '@ima/core';
        export default class PageController extends AbstractController {
          load() { return { data: db.fetch() }; }
        }
      `);

      expect(code).toContain(
        'export default class PageController extends AbstractController'
      );
      expect(code).toContain("from '@ima/core'");
      expect(code).not.toContain('db.fetch');
    });
  });

  // ── Pattern 2: Rolldown preserveModules output ────────────────────────────
  //
  // Rolldown with preserveModules emits:
  //   var Foo = class { ... };
  //   export { Foo };
  //
  // The stub processor detects the `export { Foo }` specifier, looks up `Foo`
  // in the pre-built `topLevelVarDeclarators` map, stubs the initializer, and
  // emits `export <kind> Foo = <stub>`.  The declaration keyword (`var`, `let`,
  // `const`) is copied from the original variable declaration.
  // ──────────────────────────────────────────────────────────────────────────

  describe('Pattern 2 — Rolldown preserveModules output (var decl + export specifier)', () => {
    it('stubs a class emitted as a var declaration + export specifier', () => {
      const code = runStub(`
        "use server";
        var MyService = class extends AbstractService {
          static $dependencies = [HttpClient];
          getData() { return db.query(); }
        };
        export { MyService };
      `);

      // The declaration keyword is preserved from the original `var` declaration
      expect(code).toContain('export var MyService');
      expect(code).toContain('extends AbstractService');
      expect(code).toContain('static $dependencies = []');
      // Original body must be gone
      expect(code).not.toContain('getData');
      expect(code).not.toContain('db.query');
    });

    it('stubs a function emitted as a var declaration + export specifier', () => {
      const code = runStub(`
        "use server";
        var fetchUser = function(id) {
          return db.getUser(id);
        };
        export { fetchUser };
      `);

      expect(code).toContain('export var fetchUser');
      expect(code).toContain('Cannot call server-only function');
      expect(code).not.toContain('db.getUser');
    });

    it('stubs an arrow function emitted as a var declaration + export specifier', () => {
      const code = runStub(`
        "use server";
        var sendEmail = async (to, subject) => {
          return mailer.send(to, subject);
        };
        export { sendEmail };
      `);

      expect(code).toContain('export var sendEmail');
      expect(code).toContain('Cannot call server-only function');
      expect(code).not.toContain('mailer.send');
    });

    it('preserves the super-class import for a Pattern 2 class', () => {
      const code = runStub(`
        "use server";
        import { AbstractService } from '@ima/core';
        var UserService = class extends AbstractService {
          static $dependencies = [];
        };
        export { UserService };
      `);

      expect(code).toContain('UserService');
      expect(code).toContain("from '@ima/core'");
    });
  });

  // ── What is NOT preserved ────────────────────────────────────────────────

  describe('dropped / not stubbed cases', () => {
    it('drops plain value exports (not functions or classes)', () => {
      const code = runStub(`
        "use server";
        export const SERVER_URL = 'http://localhost:3000';
        export function getUrl() { return SERVER_URL; }
      `);

      // Function is stubbed
      expect(code).toContain('export function getUrl');
      // Plain constant is dropped
      expect(code).not.toContain('SERVER_URL');
      expect(code).not.toContain('localhost');
    });

    it('drops re-exports from other modules (`export { Foo } from "./foo"`)', () => {
      const code = runStub(`
        "use server";
        export { Foo } from './foo';
        export function bar() { return 1; }
      `);

      // Re-export from another module is dropped
      expect(code).not.toContain('./foo');
      // Local export is still stubbed
      expect(code).toContain('export function bar');
    });

    it('removes the "use server" directive from the output', () => {
      const code = runStub(`
        "use server";
        export function noop() {}
      `);

      expect(code).not.toContain('"use server"');
      expect(code).not.toContain("'use server'");
    });

    it('drops side-effect imports that are unrelated to super classes', () => {
      const code = runStub(`
        "use server";
        import './polyfills';
        import { logger } from './logger';
        export function doWork() { logger.log('work'); }
      `);

      expect(code).not.toContain('./polyfills');
      expect(code).not.toContain('./logger');
    });

    it('drops the entire file body when there are no stubbable exports', () => {
      const code = runStub(`
        "use server";
        export const VALUE = 42;
        export { Foo } from './foo';
      `);

      // Nothing to stub — output should be empty (or just whitespace)
      expect(code.replace(/\s/g, '')).toBe('');
    });
  });

  // ── Error message format ──────────────────────────────────────────────────

  describe('error message format in function stubs', () => {
    it('includes the function name in the error message', () => {
      const code = runStub(`
        "use server";
        export function namedFn() {}
      `);

      // Babel generator quotes the string with double quotes; match the
      // invariant parts separately to avoid escaping issues.
      expect(code).toContain('Cannot call server-only function');
      expect(code).toContain('namedFn');
      expect(code).toContain('on client');
    });

    it('produces a generic error message for anonymous arrow functions', () => {
      const code = runStub(`
        "use server";
        export const fn = () => {};
      `);

      // Arrow functions have no name in the expression itself.
      // The error message should still be present but without a quoted name.
      expect(code).toContain('Cannot call server-only function');
      expect(code).toContain('on client');
    });
  });

  // ── Multiple exports in the same file ────────────────────────────────────

  describe('multiple exports in the same file', () => {
    it('stubs all exported functions independently', () => {
      const code = runStub(`
        "use server";
        export function alpha() { return 'a'; }
        export function beta() { return 'b'; }
        export function gamma() { return 'c'; }
      `);

      expect(code).toContain('export function alpha');
      expect(code).toContain('export function beta');
      expect(code).toContain('export function gamma');
      expect(code).not.toContain("'a'");
      expect(code).not.toContain("'b'");
      expect(code).not.toContain("'c'");
    });

    it('stubs a mix of classes and functions', () => {
      const code = runStub(`
        "use server";
        export class ServiceA {
          static $dependencies = [];
        }
        export function helperFn() { return doWork(); }
      `);

      expect(code).toContain('export class ServiceA');
      expect(code).toContain('static $dependencies = []');
      expect(code).toContain('export function helperFn');
      expect(code).toContain('Cannot call server-only function');
      expect(code).not.toContain('doWork');
    });
  });
});
