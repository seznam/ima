import { ModuleConfig, ParserConfig } from '@swc/core';

import { typescriptDeclarationsPlugin } from './plugins/typescriptDeclarationsPlugin';
import { preprocessTransformer } from './transformers/preprocessTransformer';
import { swcTransformer } from './transformers/swcTransformer';
import { ImaPluginConfig } from './types';

const isBuild = process.argv.includes('build');
const jsxRe = /\.(js|jsx)$/;
const tsxRE = /\.(ts|tsx)$/;

function createSwcTransformer({
  type,
  syntax,
}: {
  type: ModuleConfig['type'];
  syntax?: ParserConfig['syntax'];
}) {
  return swcTransformer({
    isModule: true,
    module: {
      type: type ?? 'es6',
    },
    jsc: {
      target: 'es2022',
      parser: {
        syntax: syntax ?? 'ecmascript',
        decorators: false,
        dynamicImport: true,
        [syntax === 'typescript' ? 'tsx' : 'jsx']: true,
      },
      transform: {
        react: {
          useBuiltins: true,
          development: !isBuild,
        },
      },
    },
  });
}

/**
 * Creates configuration with TS support for packages
 * that contain some preprocess pragma comments syntax
 * and require build of two separate bundles, one for client
 * and one for server. Note that server bundle doesn't contain
 * styles and JSON language files to prevent duplicates.
 *
 * @param {ModuleConfig['type']} [type='es6']
 */
export function createClientServerConfig(
  type: ModuleConfig['type'] = 'es6'
): ImaPluginConfig[] {
  return [
    {
      name: type,
      input: './src',
      output: './dist/client',
      transforms: [
        preprocessTransformer({ context: { client: true, server: false } }),
        [createSwcTransformer({ type }), { test: jsxRe }],
        [
          createSwcTransformer({ type, syntax: 'typescript' }),
          { test: /\.(ts|tsx)$/ },
        ],
      ],
      plugins: [
        typescriptDeclarationsPlugin({
          additionalArgs: ['--skipLibCheck'],
        }),
      ],
    },
    {
      name: type,
      input: './src',
      output: './dist/server',
      exclude: [
        '**/*.less/**',
        '**/*.css/**',
        '**/*.json/**',
        '**/__tests__/**',
        '**/node_modules/**',
        '**/dist/**',
        '**/typings/**',
        'tsconfig.tsbuildinfo',
      ],
      transforms: [
        preprocessTransformer({
          context: {
            client: false,
            server: true,
          },
        }),
        [createSwcTransformer({ type }), { test: jsxRe }],
        [createSwcTransformer({ type, syntax: 'typescript' }), { test: tsxRE }],
      ],
    },
  ];
}

/**
 * Create simple config with TS suppoort. Can be used for simple Node.js
 * CLI packages or other packages that don't require cjs/esm builds.
 *
 * @param {ModuleConfig['type']} [type='es6']
 */
export function createBaseConfig(
  type: ModuleConfig['type'] = 'es6'
): ImaPluginConfig {
  return {
    name: type,
    input: './src',
    output: './dist',
    transforms: [
      [createSwcTransformer({ type }), { test: jsxRe }],
      [createSwcTransformer({ type, syntax: 'typescript' }), { test: tsxRE }],
    ],
    plugins: [
      typescriptDeclarationsPlugin({
        additionalArgs: ['--skipLibCheck'],
      }),
    ],
  };
}

/**
 * Creates basic configuration with TS, CJS and ESM support. You can optionally
 * enable built of client/server specific bundles using comment pragmas.
 *
 * @param {bool} [enableServerClientBundle=false] Set to true to generate server/client
 * specific configurations using pragma comments and preprocessing.
 */
export function generateConfig(
  enableServerClientBundle = false
): ImaPluginConfig[] {
  return enableServerClientBundle
    ? [
        ...createClientServerConfig(),
        { ...createBaseConfig('commonjs'), output: './dist/cjs' },
      ]
    : [
        { ...createBaseConfig(), output: './dist/esm' },
        { ...createBaseConfig('commonjs'), output: './dist/cjs' },
      ];
}
