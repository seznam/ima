import chalk from 'chalk';
import { CommandBuilder } from 'yargs';

import { HandlerFn } from '../types';
import {
  handlerFactory,
  resolveCliPluginArgs,
  sharedArgsFactory
} from '../lib/cli';
import { runCompiler, handleError } from '../lib/compiler';
import { createWebpackConfig } from '../webpack/utils';
import webpack from 'webpack';

/**
 * Builds ima application with provided config.
 *
 * @param {CliArgs} args
 * @returns {Promise<void>}
 */
const build: HandlerFn = async args => {
  // Set NODE_ENV to production if not defined
  process.env.NODE_ENV = process.env.NODE_ENV ?? 'production';

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
    default: true
  },
  profile: {
    desc: 'Turn on profiling support in production',
    type: 'boolean',
    default: false
  },
  ...resolveCliPluginArgs(CMD)
};
