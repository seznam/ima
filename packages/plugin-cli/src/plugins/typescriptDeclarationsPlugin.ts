import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

import { logger } from '@ima/dev-utils/dist/logger';

import { Plugin } from '../types';

export interface TypescriptDeclarationsPluginOptions {
  additionalArgs?: string[];
  tscPath?: string;
}

export function typescriptDeclarationsPlugin(
  options: TypescriptDeclarationsPluginOptions
): Plugin {
  let hasTsConfig: boolean | undefined;

  return async context => {
    if (typeof hasTsConfig === 'undefined') {
      hasTsConfig = fs.existsSync(path.join(context.cwd, 'tsconfig.json'));
    }

    if (!hasTsConfig) {
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
          '--emitDeclarationOnly',
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
        .on('close', () => {
          resolve();
        })
        .on('error', err => {
          logger.error('Error generating declaration files.');
          reject(err);
        });
    });
  };
}
