import {
  JscTarget,
  ModuleConfig,
  Options,
  ParserConfig,
  ReactConfig,
  transform,
} from '@swc/core';

import { Transformer } from '../types';

const EXTENSION_TRANSFORM_RE = /\.(t|j)sx?$/;

export type SWCTransformerOptions = Options;

/**
 * Helper function to create basic swc transformer config.
 */
export function createSwcTransformer({
  type,
  target,
  syntax,
  development,
  jsxRuntime,
  sourceMaps,
}: {
  type: ModuleConfig['type'];
  target: JscTarget;
  syntax?: ParserConfig['syntax'];
  development?: boolean;
  jsxRuntime: ReactConfig['runtime'];
  sourceMaps?: boolean;
}) {
  return swcTransformer({
    isModule: true,
    sourceMaps: sourceMaps ?? true,
    module: {
      type: type ?? 'es6',
    },
    jsc: {
      target,
      parser: {
        syntax: syntax ?? 'ecmascript',
        decorators: false,
        dynamicImport: true,
        [syntax === 'typescript' ? 'tsx' : 'jsx']: true,
      },
      transform: {
        react: {
          useBuiltins: true,
          development: !!development,
          runtime: jsxRuntime,
        },
      },
    },
  });
}

export function swcTransformer(options: SWCTransformerOptions): Transformer {
  return async ({ source, context }) => {
    const newFilename = context.fileName.replace(EXTENSION_TRANSFORM_RE, '.js');
    const { code, map } = await transform(source.code, {
      ...options,
      filename: newFilename,
      sourceFileName: newFilename,
      inputSourceMap: source.map,
    });

    return {
      fileName: newFilename,
      code: map ? code + `\n//# sourceMappingURL=${newFilename}.map` : code,
      map,
    };
  };
}
