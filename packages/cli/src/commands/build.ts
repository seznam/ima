import { logger } from '@ima/dev-utils/logger';
import webpack from 'webpack';
import { CommandBuilder } from 'yargs';

import {
  handlerFactory,
  resolveCliPluginArgs,
  sharedArgsFactory,
} from '../lib/cli';
import { runCompiler, handleError } from '../lib/compiler';
import { HandlerFn } from '../types';
import { compileLanguages } from '../webpack/languages';
import {
  cleanup,
  createWebpackConfig,
  resolveImaConfig,
  runImaPluginsHook,
} from '../webpack/utils/utils';

/**
 * Builds ima application.
 *
 * @param {CliArgs} args
 * @returns {Promise<void>}
 */
const build: HandlerFn = async args => {
  try {
    // Do cleanup
    await cleanup(args);

    // Load ima config
    const imaConfig = await resolveImaConfig(args);

    // Run preProcess hook on IMA CLI Plugins
    await runImaPluginsHook(args, imaConfig, 'preProcess');

    // Compile language files
    logger.info(`Compiling language files...`, { trackTime: true });
    await compileLanguages(imaConfig, args.rootDir);
    logger.endTracking();

    // Generate webpack config
    const config = await createWebpackConfig(args, imaConfig);

    logger.info('Running webpack compiler...');

    // Run webpack compiler
    const compiler = webpack(config);

    if (!compiler) {
      throw new Error('Failed to create webpack compiler');
    }

    await runCompiler(compiler, args, imaConfig);
  } catch (error) {
    handleError(error);
    process.exit(1);
  }
};

const CMD = 'build';
export const command = CMD;
export const describe = 'Build an application for production';
export const handler = handlerFactory(build);
export const builder: CommandBuilder = {
  ...sharedArgsFactory(CMD),
  profile: {
    desc: 'Turn on profiling support in production',
    type: 'boolean',
    default: false,
  },
  ...resolveCliPluginArgs(CMD),
};
