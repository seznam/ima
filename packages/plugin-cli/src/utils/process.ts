import fs from 'fs';
import path from 'path';

import { logger } from '@ima/dev-utils/dist/logger';
import chalk from 'chalk';

import { preprocessTransformer } from '../transformers/preprocessTransformer';
import { createSwcTransformer } from '../transformers/swcTransformer';
import {
  PipeContext,
  Context,
  Source,
  TransformerDefinition,
  ImaPluginConfig,
} from '../types';
import { clientServerConfig, defaultConfig } from './configurations';

const CONFIG_BASENAME = 'ima-plugin.config';

/**
 * Parses ima.build.js file, initializing the build pipeline.
 */
export async function parseConfigFile(
  cwd: string,
  useClientServerConfig: boolean
): Promise<ImaPluginConfig[]> {
  const configDir = path.resolve(cwd);
  const configFile = await fs.promises
    .readdir(configDir)
    .then(files =>
      files.find(fileName => fileName.startsWith(CONFIG_BASENAME))
    );

  // Define default config
  let loadedConfig = useClientServerConfig
    ? [clientServerConfig]
    : [defaultConfig];

  // Override with custom configuration
  if (configFile) {
    loadedConfig = (await import(path.join(configDir, configFile))).default;
    loadedConfig = Array.isArray(loadedConfig) ? loadedConfig : [loadedConfig];
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
  const transformers = new Map<string, TransformerDefinition[]>();

  // Create map of transformers for each output option
  config.output.forEach(output => {
    transformers.set(
      output.dir,
      [
        typeof output.bundle !== 'undefined' &&
          preprocessTransformer({
            context: {
              client: output.bundle === 'client',
              server: output.bundle === 'server',
            },
          }),
        [
          createSwcTransformer({ type: output.format }),
          { test: /\.(js|jsx)$/ },
        ],
        [
          createSwcTransformer({ type: output.format, syntax: 'typescript' }),
          { test: /\.(ts|tsx)$/ },
        ],
      ].filter(Boolean) as TransformerDefinition[]
    );
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
      config.output.map(async ({ dir }) => {
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
          transformers.get(dir),
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
