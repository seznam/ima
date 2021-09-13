import { CommandBuilder } from 'yargs';

import { BuildArgs, HandlerFn } from '../types';
import { createWebpackConfig, handlerFactory } from '../lib/cliUtils';
import { runCompiler, handleError } from '../lib/compiler';
import { info } from '../lib/print';
import SharedArgs from '../lib/SharedArgs';

const build: HandlerFn<BuildArgs> = async args => {
  try {
    info('Parsing webpack configuration file...');
    const config = await createWebpackConfig(['client', 'server'], args);

    info('Starting webpack compiler...');
    await runCompiler(config, args);
  } catch (err) {
    handleError(err);
  }
};

export const command = 'build';
export const describe = 'Build an application for production';
export const handler = handlerFactory(build);
export const builder: CommandBuilder = {
  ...SharedArgs,
  clean: {
    desc: 'Clean build folder before building the application',
    type: 'boolean',
    default: true
  }
};
