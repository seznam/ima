import webpack from 'webpack';
import { CommandBuilder } from 'yargs';

import {
  handlerFactory,
  resolveCliPluginArgs,
  sharedArgsFactory,
} from '../lib/cli';
import { runCompiler, handleError } from '../lib/compiler';
import { HandlerFn } from '../types';
import { createWebpackConfig } from '../webpack/utils';

/**
 * Builds ima application with provided config.
 *
 * @param {CliArgs} args
 * @returns {Promise<void>}
 */
const build: HandlerFn = async args => {
  // Normalize NODE_ENV (default to production  )
  process.env.NODE_ENV = process.env.NODE_ENV ?? 'production';
  process.env.NODE_ENV =
    process.env.NODE_ENV === 'dev' ? 'development' : process.env.NODE_ENV;

  try {
    const { config, imaConfig } = await createWebpackConfig(
      ['client', 'server'],
      args
    );

    await runCompiler(webpack(config), args, imaConfig);
  } catch (err) {
    handleError(err);
    process.exit(1);
  }
};

const CMD = 'build';
export const command = CMD;
export const describe = 'Build an application for production';
export const handler = handlerFactory(build);
export const builder: CommandBuilder = {
  ...sharedArgsFactory(CMD),
  clean: {
    desc: 'Clean build folder before building the application',
    type: 'boolean',
    default: true,
  },
  profile: {
    desc: 'Turn on profiling support in production',
    type: 'boolean',
    default: false,
  },
  ...resolveCliPluginArgs(CMD),
};
