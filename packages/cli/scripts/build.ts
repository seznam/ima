import { runCompiler, handleCompilationError } from '../lib/compiler';
import { info } from '../lib/print';
import SharedArgs from '../lib/SharedArgs';
import { CommandModule } from 'yargs';
import { BuildCliArgs } from '../types';

async function build(args: BuildCliArgs) {
  try {
    info('Parsing webpack configuration file...');
    const config = await createWebpackConfig(['client', 'server'], args);

    info('Starting webpack compiler...');
    await runCompiler(config, args);
  } catch (err) {
    handleCompilationError(err);
  }
}

const buildCommand: CommandModule = {
  command: 'build',
  describe: 'Build an application for production',
  builder: {
    ...SharedArgs,
    clean: {
      desc: 'Clean build folder before building the application',
      type: 'boolean',
      default: true
    }
  },
  handler: handlerFactory(build)
};

export default buildCommand;
