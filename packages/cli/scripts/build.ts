import { CommandBuilder } from 'yargs';
import prettyMs from 'pretty-ms';
import pc from 'picocolors';

import { BuildArgs, HandlerFn } from '../types';
import { info, handlerFactory, resolveCliPluginArgs } from '../lib/cli';
import { runCompiler, handleError } from '../lib/compiler';
import { createWebpackConfig } from '../webpack/utils';
import SharedArgs from '../lib/SharedArgs';

/**
 * Builds ima application with provided config.
 *
 * @param {BuildArgs} args
 * @returns {Promise<void>}
 */
const build: HandlerFn<BuildArgs> = async args => {
  try {
    const startTime = Date.now();

    info('Parsing webpack configuration file...');
    const config = await createWebpackConfig(['client', 'server'], args);

    info('Starting webpack compiler...');
    await runCompiler(config, args);

    info(`Total compile time: ${pc.green(prettyMs(Date.now() - startTime))}`);
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