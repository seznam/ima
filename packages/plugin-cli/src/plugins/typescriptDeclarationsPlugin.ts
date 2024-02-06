import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

import { logger } from '@ima/dev-utils/logger';

import { Plugin } from '../types';

export interface TypescriptDeclarationsPluginOptions {
  additionalArgs?: string[];
  tscPath?: string;
  tsConfigPath?: string;
  allowFailure?: boolean;
}

/**
 * Resolves tsconfig paths in given directory and returns them.
 * We always use the first one. They are sorted by their priority.
 */
function resolveTsConfigs(cwd: string) {
  const tsConfigPaths = ['tsconfig.build.json', 'tsconfig.json'];

  return tsConfigPaths.filter(tsConfigPath =>
    fs.existsSync(path.join(cwd, tsConfigPath))
  );
}

export function typescriptDeclarationsPlugin(
  options: TypescriptDeclarationsPluginOptions
): Plugin {
  let tsConfigPath: string | undefined;
  const allowFailure = options?.allowFailure ?? false;

  return async context => {
    [tsConfigPath] = options?.tsConfigPath ?? resolveTsConfigs(context.cwd);

    if (!tsConfigPath) {
      return;
    }

    if (context.command === 'build') {
      logger.info('Generating typescript declaration files...', {
        trackTime: true,
      });
    }

    await new Promise<void>((resolve, reject) => {
      spawn(
        options?.tscPath ? options.tscPath : 'tsc',
        [
          '--outDir',
          context.config.output[0].dir,
          '--project',
          tsConfigPath,
          '--emitDeclarationOnly',
          '--declarationMap',
          '--preserveWatchOutput',
          ...(['dev', 'link'].includes(context.command)
            ? ['--watch', '--incremental']
            : []),
          ...(options?.additionalArgs ?? []),
        ].filter(Boolean) as string[],
        {
          stdio: 'inherit',
          cwd: context.cwd,
          shell: true,
        }
      )
        .on('close', code => {
          if (code !== 0 && !allowFailure) {
            throw new Error('Error generating declaration files.');
          }

          resolve();
        })
        .on('error', err => {
          logger.error('Error generating declaration files.');
          reject(err);
        });
    });
  };
}
