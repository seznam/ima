import generate from '@babel/generator';
import { parse } from '@babel/parser';
import { Plugin } from 'vite';

import { serverControllerProcessor } from './useServerProcessors/serverControllerProcessor';
import { stubProcessor } from './useServerProcessors/stubProcessor';
import type { UseServerProcessor, ImaConfigurationContext } from '../../types';

/**
 * The default processors that are run on the AST.
 * IMPORTANT: the order of the processors is important.
 */
const defaultProcessors: UseServerProcessor[] = [
  stubProcessor,
  serverControllerProcessor,
];

/**
 * Vite plugin triggered by the `'use server'` directive.
 * It parses the file into an AST, runs a series of processors against it,
 * which can modify the AST. Finally, it generates code from the transformed AST.
 */
export function imaUseServerPlugin(context: ImaConfigurationContext): Plugin {
  return {
    name: 'ima:use-server',

    applyToEnvironment(environment) {
      return environment.config.consumer === 'client';
    },

    transform(source, id) {
      // Only process files that start with the 'use server' directive
      const trimmed = source.trimStart();
      if (
        !trimmed.startsWith(`"use server"`) &&
        !trimmed.startsWith(`'use server'`)
      ) {
        return null;
      }

      // Parse source into AST
      let ast = parse(source, {
        sourceType: 'module',
        plugins: ['typescript'],
        sourceFilename: id,
      });

      // Run AST through all configured processors one by one
      for (const processor of defaultProcessors) {
        ast = processor(ast);
      }

      // Generate code from the final AST
      const output = generate(ast, {
        sourceMaps: !!context.useSourceMaps,
        sourceFileName: id,
      });

      return {
        code: output.code,
        map: output.map ?? null,
      };
    },
  };
}
