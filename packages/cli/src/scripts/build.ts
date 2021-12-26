import { CommandBuilder } from 'yargs';

import { BuildArgs, HandlerFn } from '../types';
import { handlerFactory, resolveCliPluginArgs } from '../lib/cli';
import { runCompiler, handleError } from '../lib/compiler';
import { createWebpackConfig } from '../webpack/utils';
import SharedArgs from '../lib/SharedArgs';
import webpack from 'webpack';

/**
 * Builds ima application with provided config.
 *
 * @param {BuildArgs} args
 * @returns {Promise<void>}
 */
const build: HandlerFn<BuildArgs> = async args => {
  try {
    const config = await createWebpackConfig(['client', 'server'], args);
    await runCompiler(webpack(config), args);
  } catch (err) {
    handleError(err);
  }
};

const CMD = 'build';
export const command = `${CMD} [rootDir]`;
export const describe = 'Build an application for production';
export const handler = handlerFactory(build);
export const builder: CommandBuilder = {
  ...SharedArgs,
  clean: {
    desc: 'Clean build folder before building the application',
    type: 'boolean',
    default: true
  },
  ...resolveCliPluginArgs(CMD)
};
