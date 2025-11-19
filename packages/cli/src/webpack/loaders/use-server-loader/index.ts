import generate from '@babel/generator';
import { parse } from '@babel/parser';
import type { LoaderDefinitionFunction } from 'webpack';

import { serverControllerProcessor } from './processors/serverControllerProcessor';
import { stubProcessor } from './processors/stubProcessor';
import { UseServerProcessor } from './types';

export interface UseServerLoaderOptions {
  environment: 'client' | 'server';
}

/**
 * The default processors that are run on the AST.
 * IMPORTANT: the order of the processors is important.
 */
const defaultProcessors: UseServerProcessor[] = [
  stubProcessor,
  serverControllerProcessor,
];

/**
 * This generic webpack loader is triggered by the 'use server' directive.
 * It parses a file into an AST and then runs a series of processors against it,
 * which can modify the AST. Finally, it generates code from the transformed AST.
 *
 * @param {string} source The source code of the module.
 * @returns {string} The transformed source code.
 */
const UseServerLoader: LoaderDefinitionFunction<UseServerLoaderOptions> =
  function (source, inputMap) {
    const options = this.getOptions();
    const done = this.async();

    // Only run on the client and if 'use server' is present
    if (
      options.environment !== 'client' ||
      (!source.trimStart().startsWith(`"use server"`) &&
        !source.trimStart().startsWith(`'use server'`))
    ) {
      return done(null, source, inputMap);
    }

    // Parse source into AST
    let ast = parse(source, {
      sourceType: 'module',
      plugins: ['typescript'],
      sourceFilename: this.resourcePath,
    });

    // Run AST through all configured processors one by one
    for (const processor of defaultProcessors) {
      ast = processor(ast);
    }

    // Generate code from the final AST
    const output = generate(ast, {
      sourceMaps: !!this.sourceMap,
      sourceFileName: this.resourcePath,
    });

    done(null, output.code, output.map || undefined);
  };

export default UseServerLoader;
