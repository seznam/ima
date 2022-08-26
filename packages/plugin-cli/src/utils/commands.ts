import fs from 'fs';
import path from 'path';

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
import { info, parsePkgJSON, success, trackTime } from './utils';

/**
 * Build command function handler.
 */
export async function build() {
  const time = trackTime();
  const cwd = process.cwd();
  const [pkgJson, configurations] = await Promise.all([
    parsePkgJSON(cwd),
    parseConfigFile(cwd),
  ]);

  info(`Building ${chalk.bold.magenta(pkgJson.name)}`);

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

  success(`Finished in ${chalk.bold.gray(time())}`);
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

  info(`Watching ${chalk.bold.magenta(pkgJson.name)}`);

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

          if (['add', 'change'].includes(eventName)) {
            info(
              `Copied ${chalk.gray(pkgJson.name + ':')}${chalk.magenta(
                contextPath
              )} ${chalk.green('→')} ${chalk.gray(
                linkedPkgJson.name
              )}:${chalk.magenta(path.join('./', config.output, contextPath))}`
            );

            if (!fs.existsSync(linkedOutputDir)) {
              await fs.promises.mkdir(linkedOutputDir, { recursive: true });
            }

            await fs.promises.copyFile(filePath, linkedOutputPath);
          }

          if (['unlink', 'unlinkDir'].includes(eventName)) {
            info(
              `Removing linked ${chalk.gray(
                linkedPkgJson.name + ':'
              )}${chalk.magenta(contextPath)}`
            );
            await fs.promises.rm(linkedOutputPath, { recursive: true });
          }

          if (eventName === 'addDir') {
            info(
              `Creating ${chalk.gray(linkedPkgJson.name + ':')}${chalk.magenta(
                contextPath
              )}`
            );
            await fs.promises.mkdir(linkedOutputPath, { recursive: true });
          }
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
        const relativePath = path.relative(inputDir, filePath);

        // Process new and changed files with pipeline
        if (['add', 'change'].includes(eventName)) {
          const time = trackTime();
          await process(filePath);
          info(
            `Processed ${chalk.magenta(relativePath)} in ${chalk.gray(
              time()
            )} ${chalk.green('✓')}`
          );
        }

        // Sync deleted dirs and files
        if (['unlink', 'unlinkDir'].includes(eventName)) {
          info(`Removing ${relativePath}`);
          await fs.promises.rm(filePath, { recursive: true });
        }

        // Sync newly added directories
        if (eventName === 'addDir') {
          info(`Creating ${relativePath}`);
          await fs.promises.mkdir(filePath, { recursive: true });
        }
      })
      .on('ready', async () => {
        // Run plugins
        await runPlugins(context);
      });
  });
}
