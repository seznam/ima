import fs from 'fs';
import path from 'path';

import { logger, time } from '@ima/dev-utils/dist/logger';
import chalk from 'chalk';
import chokidar from 'chokidar';
import globby from 'globby';
import { Arguments } from 'yargs';

import { Context } from '../types';
import {
  createProcessingPipeline,
  parseConfigFile,
  runPlugins,
} from './process';

/**
 * Loads and parses package.json at given working directory.
 */
export async function parsePkgJSON(basePath: string): Promise<{
  name: string;
}> {
  return JSON.parse(
    await (
      await fs.promises.readFile(path.join(basePath, 'package.json'))
    ).toString()
  );
}

/**
 * Return colored status icon based on provided chokidar event.
 */
export function getStatusIcon(
  eventName: 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir'
): string {
  switch (eventName) {
    case 'add':
    case 'change':
      return chalk.green('✓');
      break;

    case 'unlink':
    case 'unlinkDir':
      return chalk.red('×');

    case 'addDir':
      return chalk.blue('+');
      break;
  }
}

/**
 * Build command function handler.
 */
export async function build() {
  const elapsed = time();
  const cwd = process.cwd();
  const [pkgJson, configurations] = await Promise.all([
    parsePkgJSON(cwd),
    parseConfigFile(cwd),
  ]);

  logger.info(`Building ${chalk.bold.magenta(pkgJson.name)}`);

  // Spawn compilation for each config
  await Promise.all(
    configurations.map(async config => {
      const inputDir = path.resolve(cwd, config.input);
      const outputDir = path.resolve(cwd, config.output);

      // Cleanup
      if (fs.existsSync(outputDir)) {
        await fs.promises.rm(outputDir, { recursive: true });
      }

      // Get file paths at input directory
      const files = await globby(path.join(inputDir, './**/*'), {
        ignore: config.exclude,
        cwd,
      });

      const context: Context = {
        command: 'build',
        inputDir,
        config,
        cwd,
        outputDir,
      };

      // Init processing pipeline
      const process = await createProcessingPipeline(context);

      // Process each file with loaded pipeline
      files.forEach(process);

      // Run plugins
      await runPlugins(context);
    })
  );

  logger.success('Finished', { elapsed });
}

/**
 * Dev/link command function handler
 */
export async function watch(args: Arguments) {
  const [command] = args._ as ['link' | 'dev'];
  const { path: linkPath } = args as unknown as { path: string };

  const cwd = process.cwd();
  const [pkgJson, configurations] = await Promise.all([
    parsePkgJSON(cwd),
    parseConfigFile(cwd),
  ]);

  logger.info(`Watching ${chalk.bold.magenta(pkgJson.name)}`);

  // Spawn watch for each config
  configurations.forEach(async config => {
    const inputDir = path.resolve(cwd, config.input);
    const outputDir = path.resolve(cwd, config.output);

    // Cleanup
    if (fs.existsSync(outputDir)) {
      await fs.promises.rm(outputDir, { recursive: true });
    }

    const context: Context = {
      command,
      inputDir,
      config,
      cwd,
      outputDir,
    };

    // Link watcher
    if (command === 'link' && linkPath) {
      const linkedPath = path.resolve(linkPath);
      const linkedPkgJson = await parsePkgJSON(linkedPath);
      const linkedBasePath = path.resolve(
        linkedPath,
        'node_modules',
        pkgJson.name,
        config.output
      );

      // Clean linked folder
      if (fs.existsSync(linkedBasePath)) {
        await fs.promises.rm(linkedBasePath, { recursive: true });
      }

      chokidar
        .watch([path.join(outputDir, './**/*')], {
          ignoreInitial: false,
          ignored: ['**/tsconfig.tsbuildinfo/**', '**/node_modules/**'],
        })
        .on('all', async (eventName, filePath) => {
          const contextPath = path.relative(outputDir, filePath);
          const linkedOutputPath = path.join(linkedBasePath, contextPath);
          const linkedOutputDir = path.dirname(linkedOutputPath);
          const outputContextPath = `./${path.join(
            config.output,
            contextPath
          )}`;

          const elapsed = time();

          switch (eventName) {
            case 'add':
            case 'change':
              if (!fs.existsSync(linkedOutputDir)) {
                await fs.promises.mkdir(linkedOutputDir, { recursive: true });
              }

              await fs.promises.copyFile(filePath, linkedOutputPath);
              break;

            case 'unlink':
            case 'unlinkDir':
              await fs.promises.rm(linkedOutputPath, { recursive: true });
              break;

            case 'addDir':
              await fs.promises.mkdir(linkedOutputPath, { recursive: true });
              break;
          }

          // Print info to output
          logger.info(
            `${getStatusIcon(eventName)} ${chalk.gray(
              pkgJson.name + ':'
            )}${chalk.magenta(outputContextPath)} ${chalk.green(
              '→'
            )} ${chalk.blue(linkedPkgJson.name)}`,
            {
              elapsed,
            }
          );
        });
    }

    // Init processing pipeline
    const process = await createProcessingPipeline(context);

    // Dev watcher
    chokidar
      .watch([path.join(inputDir, './**/*')], {
        ignoreInitial: false,
        ignored: config.exclude,
      })
      .on('all', async (eventName, filePath) => {
        const contextPath = path.relative(inputDir, filePath);
        const outputContextPath = `./${path.join(config.output, contextPath)}`;

        const elapsed = time();

        switch (eventName) {
          case 'add':
          case 'change':
            await process(filePath);
            break;

          case 'unlink':
          case 'unlinkDir':
            await fs.promises.rm(filePath, { recursive: true });
            break;

          case 'addDir':
            await fs.promises.mkdir(filePath, { recursive: true });
            break;
        }

        // Prevents duplicate logging in `link` mode
        if (command !== 'link') {
          logger.info(
            `${getStatusIcon(eventName)} ${chalk.magenta(outputContextPath)}`,
            {
              elapsed,
            }
          );
        }
      })
      .on('ready', async () => {
        await runPlugins(context);
      });
  });
}
