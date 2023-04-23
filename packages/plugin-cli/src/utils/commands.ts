import fs from 'fs';
import path from 'path';

import { logger, time, printTime } from '@ima/dev-utils/logger';
import anymatch from 'anymatch';
import chalk from 'chalk';
import chokidar from 'chokidar';
import globby from 'globby';
import { Arguments } from 'yargs';

import {
  createProcessingPipeline,
  parseConfigFile,
  runPlugins,
} from './process';
import { cleanOutput, processOutput } from './utils';
import { Args, Context, ImaPluginConfig } from '../types';

function parseArgs(args: Arguments) {
  const [command] = args._ as [Args['command']];

  return { ...args, command } as unknown as Args;
}

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

function errorHandler(error: Error) {
  logger.error('An error occurred while wathing files');
  console.error(error);
}

/**
 * Build command function handler.
 */
export async function build(args: Arguments) {
  const parsedArgs = parseArgs(args);
  const elapsed = time();
  const cwd = process.cwd();
  const [pkgJson, configurations] = await Promise.all([
    parsePkgJson(cwd),
    parseConfigFile(cwd, parsedArgs),
  ]);

  logger.setSilent(parsedArgs.silent);
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
      let files = await globby(
        path.posix.join(inputDir.replace(/\\/g, '/'), './**/*'),
        {
          cwd: cwd.replace(/\\/g, '/'),
        }
      );

      // Filter files using exclude settings
      if (config?.exclude) {
        const matcher =
          typeof config.exclude === 'function'
            ? config.exclude
            : anymatch(config.exclude);

        files = files.filter(filePath => !matcher(filePath));
      }

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
  const cwd = process.cwd();
  const parsedArgs = parseArgs(args);
  const { command, path: linkPath } = parsedArgs;
  const [pkgJson, configurations] = await Promise.all([
    parsePkgJson(cwd),
    parseConfigFile(cwd, parsedArgs),
  ]);

  logger.setSilent(parsedArgs.silent);
  logger.info(`Watching ${chalk.bold.magenta(pkgJson.name)}`);

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

          default:
            return;
        }

        // Prevents duplicate logging in `link` mode
        if (command !== 'link') {
          logger.write(
            `${printTime()} ${getStatusIcon(eventName)} ${contextPath}`,
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
        pkgJson.name
      );
      const linkedDistPath = path.join(linkedBasePath, distBaseDir);

      chokidar
        .watch(
          [
            path.join(cwd, distBaseDir, '/**/*'),
            Array.isArray(parsedArgs?.additionalWatchPaths) &&
              parsedArgs?.additionalWatchPaths,
            Array.isArray(config?.additionalWatchPaths) &&
              config?.additionalWatchPaths,
          ].filter(Boolean) as string[],
          {
            ignoreInitial: false,
            ignored: [
              '**/tsconfig.tsbuildinfo/**',
              '**/node_modules/**',
              '**/.DS_Store/**',
            ],
          }
        )
        .on('error', errorHandler)
        .on('all', async (eventName, filePath) => {
          // Handler to link additional non-dist files
          const isAdditionalFile = !filePath.startsWith(outputDir);
          const contextPath = path.relative(
            isAdditionalFile ? cwd : outputDir,
            filePath
          );
          const linkedOutputPath = path.join(
            isAdditionalFile ? linkedBasePath : linkedDistPath,
            contextPath
          );
          const linkedOutputDir = path.dirname(linkedOutputPath);
          const outputContextPath = `./${path.join(
            isAdditionalFile ? '' : distBaseDir,
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

            default:
              return;
          }

          // Print info to output
          logger.write(
            `${printTime()} ${getStatusIcon(eventName)} ${chalk.cyan(
              pkgJson.name
            )} ${outputContextPath} ${chalk.green('→')} ${chalk.magenta(
              linkedPkgJson.name
            )}`,
            {
              elapsed,
            }
          );
        });
    }
  });
}
