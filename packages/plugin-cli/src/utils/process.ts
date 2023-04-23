import fs from 'fs';
import path from 'path';

import { logger } from '@ima/dev-utils/logger';
import chalk from 'chalk';

import {
  clientServerConfig,
  defaultConfig,
  nodeConfig,
} from './configurations';
import { preprocessTransformer } from '../transformers/preprocessTransformer';
import { createSwcTransformer } from '../transformers/swcTransformer';
import {
  PipeContext,
  Context,
  Source,
  TransformerDefinition,
  ImaPluginConfig,
  Args,
} from '../types';

const CONFIG_BASENAME = 'ima-plugin.config';

/**
 * Parses ima.build.js file, initializing the build pipeline.
 */
export async function parseConfigFile(
  cwd: string,
  args: Args
): Promise<ImaPluginConfig[]> {
  const configDir = path.resolve(cwd);
  const configFile = await fs.promises
    .readdir(configDir)
    .then(files =>
      files.find(fileName => fileName.startsWith(CONFIG_BASENAME))
    );

  // Recursively try to find file up to file system root
  if (!configFile) {
    const newConfigDir = path.resolve(cwd, '..');

    if (newConfigDir !== configDir) {
      return parseConfigFile(path.resolve(cwd, '..'), args);
    }
  }

  // Define default config
  let loadedConfig: ImaPluginConfig[] = [];

  if (args.clientServerConfig) {
    loadedConfig.push(clientServerConfig);
  } else if (args.nodeConfig) {
    loadedConfig.push(nodeConfig);
  } else {
    loadedConfig.push(defaultConfig);
  }

  // Override with custom configuration
  if (configFile) {
    let configPath = path.join(configDir, configFile);

    if (!configPath.startsWith('/')) {
      configPath = 'file:///' + configPath.replace(/\\/g, '/');
    }

    loadedConfig = (await import(configPath)).default;
    loadedConfig = Array.isArray(loadedConfig) ? loadedConfig : [loadedConfig];
  }

  // Override jsx runtime option from CLI args
  if (args.jsxRuntime) {
    loadedConfig = loadedConfig.map(config => {
      config.jsxRuntime = args.jsxRuntime;

      return config;
    });
  }

  return loadedConfig as ImaPluginConfig[];
}

/**
 * Helper function to emit source. If it's not undefined, the source is
 * written to the output path. If it is undefined, the original file
 * is simply copied.
 */
export async function emitSource(
  source: Source | undefined,
  context: PipeContext,
  outputDir: string
) {
  // Create output directory
  if (!fs.existsSync(outputDir)) {
    await fs.promises.mkdir(outputDir, { recursive: true });
  }

  // Emit source
  if (source) {
    const outputPath = path.join(outputDir, source?.fileName);

    return Promise.all([
      fs.promises.writeFile(outputPath, source.code),
      source.map && fs.promises.writeFile(`${outputPath}.map`, source.map),
    ]);
  } else {
    // Just copy files without source
    await fs.promises.copyFile(
      context.filePath,
      path.join(outputDir, context.fileName)
    );
  }
}

/**
 * Load source file contents and runs transformers on it, provided
 * in the ima.build.js config.
 */
export async function processTransformers(
  source: Source,
  transformers: TransformerDefinition[] | undefined,
  context: PipeContext
): Promise<Source> {
  if (!transformers) {
    return source;
  }

  const { filePath } = context;

  for (const transformerDefinition of transformers) {
    const [transform, options] = Array.isArray(transformerDefinition)
      ? transformerDefinition
      : [transformerDefinition];

    try {
      if (!options) {
        source = await transform({ source, context });
        continue;
      }

      if (options.test && !options.test.test(filePath)) {
        continue;
      }

      source = await transform({ source, context });
    } catch (err) {
      logger.error(`at ${chalk.magenta(context.filePath)}`);
      console.error(err);

      // Don't continue in build command
      if (context.command === 'build') {
        process.exit(1);
      }
    }
  }

  return source;
}

/**
 * Creates processing pipeline used in build, link and dev scripts.
 * It is constructed to run on each file separately.
 */
export async function createProcessingPipeline(ctx: Context) {
  const { config } = ctx;
  const transformersMap = new Map<string, TransformerDefinition[]>();
  const isDevelopment =
    ctx.command !== 'build' && process.env.NODE_ENV !== 'production';

  // Create map of transformers for each output option
  config.output.forEach(output => {
    // Create default transformers set based on config options
    const defaultTransformers = [
      typeof output.bundle !== 'undefined' &&
        preprocessTransformer({
          context: {
            client: output.bundle === 'client',
            server: output.bundle === 'server',
          },
        }),
      [
        createSwcTransformer({
          target: config.target,
          sourceMaps: config.sourceMaps,
          development: isDevelopment,
          type: output.format,
          jsxRuntime: config.jsxRuntime,
        }),
        { test: /\.(js|jsx)$/ },
      ],
      [
        createSwcTransformer({
          target: config.target,
          sourceMaps: config.sourceMaps,
          development: isDevelopment,
          type: output.format,
          jsxRuntime: config.jsxRuntime,
          syntax: 'typescript',
        }),
        { test: /\.(ts|tsx)$/ },
      ],
    ].filter(Boolean) as TransformerDefinition[];

    // Check for custom transformers in config
    if (Array.isArray(config.transformers)) {
      const hasDefaultsPlaceholder = config.transformers.find(
        t => typeof t === 'string' && t === '...'
      );

      transformersMap.set(
        output.dir,
        config.transformers
          .map(t =>
            hasDefaultsPlaceholder && typeof t === 'string' && t === '...'
              ? defaultTransformers
              : t
          )
          .flat()
          .filter(Boolean) as TransformerDefinition[]
      );
    } else {
      transformersMap.set(output.dir, defaultTransformers);
    }
  });

  return async (filePath: string) => {
    const fileName = path.basename(filePath);
    const contextDir = path.dirname(path.relative(ctx.inputDir, filePath));

    // Read file contents
    let source: Source = {
      fileName,
      code: await fs.promises.readFile(filePath, 'utf8'),
    };

    // Run transformers for each output and emit
    await Promise.all(
      config.output.map(async ({ dir, include, exclude }) => {
        if (
          (include &&
            ((typeof include === 'function' && !include(filePath)) ||
              (typeof include === 'object' && !include?.test(filePath)))) ||
          (exclude &&
            ((typeof exclude === 'function' && exclude(filePath)) ||
              (typeof exclude === 'object' && exclude?.test(filePath))))
        ) {
          return;
        }

        const outputDir = path.resolve(ctx.cwd, dir);
        const context: PipeContext = {
          ...ctx,
          contextDir,
          fileName,
          filePath,
          outputDir,
        };

        // Process transforms
        source = await processTransformers(
          source,
          transformersMap.get(dir),
          context
        );

        // Write new source
        await emitSource(source, context, path.resolve(dir, contextDir));
      })
    );
  };
}

/**
 * Runs plugins defined in config file.
 */
export async function runPlugins(context: Context) {
  if (!context.config?.plugins?.length) {
    return;
  }

  for (const plugin of context.config.plugins) {
    await plugin(context);
  }
}
