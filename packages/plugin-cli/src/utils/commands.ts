import fs from 'fs';
import path from 'path';

import { logger, time } from '@ima/dev-utils/logger';
import chalk from 'chalk';
import { watch as chokidarWatch } from 'chokidar';
import { Arguments } from 'yargs';

import { parseConfigFile, runPlugins } from './process.js';
import { cleanOutput, createBatcher } from './utils.js';
import {
  rolldownBuild,
  rolldownBuildWatch,
} from '../builder/rolldownBuilder.js';
import { Args, Context } from '../types.js';

function parseArgs(args: Arguments) {
  const [command] = args._ as [Args['command']];

  return { ...args, command } as unknown as Args;
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

function errorHandler(error: unknown) {
  logger.error('An error occurred while watching files');
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

  await Promise.all(
    configurations.map(async config => {
      logger.info(
        `${config.inputDir} ${chalk.blue('→')} ${chalk.green(config.outDir)} ${chalk.red('[esm]')}`
      );

      await cleanOutput(config, cwd);

      const context: Context = {
        command: 'build',
        inputDir: path.resolve(cwd, config.inputDir),
        config,
        cwd,
      };

      await rolldownBuild(config, cwd);
      await runPlugins(context);
    })
  ).catch(error => {
    logger.error(error);
    process.exit(1);
  });

  logger.success('Finished', { elapsed });
}

/**
 * Dev/link command function handler.
 */
export async function watch(args: Arguments) {
  const cwd = process.cwd();
  const parsedArgs = parseArgs(args);
  const { command, path: linkPath } = parsedArgs;
  const [pkgJson, configurations] = await Promise.all([
    parsePkgJson(cwd),
    parseConfigFile(cwd, parsedArgs),
  ]);

  let title = `Watching ${chalk.bold.magenta(pkgJson.name)}`;

  if (command === 'link' && linkPath) {
    const linkedPkgJson = await parsePkgJson(path.resolve(linkPath));

    title = `Linking ${chalk.bold.magenta(pkgJson.name)} ${chalk.white(
      '→'
    )} ${chalk.cyan(linkedPkgJson.name)}`;
  }

  const batch = createBatcher(title);
  logger.setSilent(parsedArgs.silent);

  for (const config of configurations) {
    const inputDir = path.resolve(cwd, config.inputDir);
    const outDir = path.resolve(cwd, config.outDir);

    await cleanOutput(config, cwd);

    const context: Context = {
      command,
      inputDir,
      config,
      cwd,
    };

    // Start Rolldown watch build
    await rolldownBuildWatch(config, cwd);

    // Run plugins once after initial build settles
    await runPlugins(context);

    /**
     * Link watcher — watches the dist output and copies changed files
     * into the linked project's node_modules.
     */
    if (command === 'link' && linkPath) {
      const linkedPath = path.resolve(linkPath);
      const linkedBasePath = path.resolve(
        linkedPath,
        'node_modules',
        pkgJson.name
      );
      const linkedDistPath = path.join(linkedBasePath, config.outDir);

      // Always include package.json in watch paths
      const extraWatchPaths = [
        './package.json',
        ...(config.additionalWatchPaths ?? []),
        ...(Array.isArray(parsedArgs.additionalWatchPaths)
          ? parsedArgs.additionalWatchPaths
          : []),
      ].map(p => path.resolve(cwd, p));

      chokidarWatch([outDir, ...extraWatchPaths], {
        ignoreInitial: false,
        persistent: true,
        ignored: [
          '**/tsconfig.build.tsbuildinfo/**',
          '**/node_modules/**',
          '**/.DS_Store/**',
        ],
      })
        .on('error', errorHandler)
        .on('all', (eventName, filePath) => {
          if (
            eventName === 'all' ||
            eventName === 'ready' ||
            eventName === 'raw' ||
            eventName === 'error'
          ) {
            return;
          }

          const isAdditionalFile = !filePath.startsWith(outDir);
          const contextPath = path.relative(
            isAdditionalFile ? cwd : outDir,
            filePath
          );
          const linkedOutputPath = path.join(
            isAdditionalFile ? linkedBasePath : linkedDistPath,
            contextPath
          );
          const linkedOutputDir = path.dirname(linkedOutputPath);

          batch(async () => {
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
          }, eventName);
        });
    }
  }
}
