import fs from 'fs';
import path from 'path';

import { logger, time } from '@ima/dev-utils/dist/logger';
import chalk from 'chalk';
import chokidar from 'chokidar';
import globby from 'globby';
import { Arguments } from 'yargs';

import { Context, ImaPluginConfig } from '../types';
import {
  createProcessingPipeline,
  parseConfigFile,
  runPlugins,
} from './process';
import { cleanOutput, processOutput } from './utils';

/**
 * Returns the upmost common part of output dir path of all output options.
 */
function getBaseCommonOutputDir(output: ImaPluginConfig['output']): string {
  const [firstOutputDirParts, ...otherOutputDirsParts] = output.map(output =>
    output.dir.split('/')
  );

  return firstOutputDirParts
    .reduce<string[]>((acc, cur, index) => {
      if (otherOutputDirsParts.every(part => part[index] === cur) && cur) {
        acc.push(cur);
      }

      return acc;
    }, [])
    .join('/');
}

/**
 * Loads and parses package.json at given working directory.
 */
export async function parsePkgJson(basePath: string): Promise<{
  name: string;
  main: string;
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
 * Prints current time in HH:MM:SS format.
 */
function timeNow() {
  const d = new Date(),
    h = (d.getHours() < 10 ? '0' : '') + d.getHours(),
    m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes(),
    s = (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();

  return chalk.gray(`[${h}:${m}:${s}]`);
}

function errorHandler(error: Error) {
  logger.error('An error occurred while wathing files');
  console.error(error);
}

/**
 * Build command function handler.
 */
export async function build(args: Arguments) {
  const { clientServerBundle } = args as unknown as {
    clientServerBundle: boolean;
  };
  const elapsed = time();
  const cwd = process.cwd();
  const [pkgJson, configurations] = await Promise.all([
    parsePkgJson(cwd),
    parseConfigFile(cwd, clientServerBundle),
  ]);

  logger.info(`Building ${chalk.bold.magenta(pkgJson.name)}`);

  // Spawn compilation for each config
  await Promise.all(
    configurations.map(async config => {
      const inputDir = path.resolve(cwd, config.inputDir);

      config.output.forEach(({ dir, format }) => {
        logger.info(
          `${config.inputDir} ${chalk.blue('→')} ${chalk.green(
            dir
          )} ${chalk.red(`[${format}]`)}`
        );
      });

      // Clean output directories
      await cleanOutput(config, cwd);

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
  const {
    path: linkPath,
    silent,
    clientServerBundle,
  } = args as unknown as {
    path: string;
    silent: boolean;
    clientServerBundle: boolean;
  };

  const cwd = process.cwd();
  const [pkgJson, configurations] = await Promise.all([
    parsePkgJson(cwd),
    parseConfigFile(cwd, clientServerBundle),
  ]);

  if (!silent) {
    logger.info(`Watching ${chalk.bold.magenta(pkgJson.name)}`);
  }

  // Spawn watch for each config
  configurations.forEach(async config => {
    const inputDir = path.resolve(cwd, config.inputDir);

    // Cleanup
    await cleanOutput(config, cwd);

    // Processing pipeline context
    const context: Context = {
      command,
      inputDir,
      config,
      cwd,
    };

    // Init processing pipeline
    const process = await createProcessingPipeline(context);

    // Dev watcher
    chokidar
      .watch([path.join(inputDir, './**/*')], {
        ignoreInitial: false,
        ignored: config.exclude,
      })
      .on('error', errorHandler)
      .on('all', async (eventName, filePath) => {
        const contextPath = path.relative(inputDir, filePath);
        const elapsed = time();

        switch (eventName) {
          case 'add':
          case 'change':
            await process(filePath);
            break;

          case 'unlink':
          case 'unlinkDir':
            await processOutput(
              config,
              async outputPath => {
                const outputContextPath = path.join(outputPath, contextPath);

                if (fs.existsSync(outputContextPath)) {
                  await fs.promises.rm(outputContextPath, { recursive: true });
                }
              },
              cwd
            );
            break;

          case 'addDir':
            await processOutput(
              config,
              async outputPath => {
                await fs.promises.mkdir(path.join(outputPath, contextPath), {
                  recursive: true,
                });
              },
              cwd
            );
            break;
        }

        // Prevents duplicate logging in `link` mode
        if (command !== 'link' && !silent) {
          logger.write(
            `${timeNow()} ${getStatusIcon(eventName)} ${contextPath}`,
            {
              elapsed,
            }
          );
        }
      })
      .on('ready', async () => {
        await runPlugins(context);
      });

    /**
     * Link watcher, there's only one instance per pkg, it watches the root dist
     * directory and copies changes to the linked path.
     */
    if (command === 'link' && linkPath) {
      const distBaseDir = getBaseCommonOutputDir(config.output);
      const outputDir = path.join(cwd, distBaseDir);
      const linkedPath = path.resolve(linkPath);
      const linkedPkgJson = await parsePkgJson(linkedPath);
      const linkedBasePath = path.resolve(
        linkedPath,
        'node_modules',
        pkgJson.name,
        distBaseDir
      );

      // Clean linked folder
      if (fs.existsSync(linkedBasePath)) {
        await fs.promises.rm(linkedBasePath, { recursive: true });
      }

      chokidar
        .watch([path.join(cwd, distBaseDir, '/**/*')], {
          ignoreInitial: false,
          ignored: [
            '**/tsconfig.tsbuildinfo/**',
            '**/node_modules/**',
            '**/.DS_Store/**',
          ],
        })
        .on('error', errorHandler)
        .on('all', async (eventName, filePath) => {
          const contextPath = path.relative(outputDir, filePath);
          const linkedOutputPath = path.join(linkedBasePath, contextPath);
          const linkedOutputDir = path.dirname(linkedOutputPath);
          const outputContextPath = `./${path.join(distBaseDir, contextPath)}`;

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

          if (!silent) {
            // Print info to output
            logger.write(
              `${timeNow()} ${getStatusIcon(eventName)} ${chalk.cyan(
                pkgJson.name
              )} ${outputContextPath} ${chalk.green('→')} ${chalk.magenta(
                linkedPkgJson.name
              )}`,
              {
                elapsed,
              }
            );
          }
        });
    }
  });
}
