import { CommandBuilder } from 'yargs';

const SharedArgs: CommandBuilder = {
  verbose: {
    desc: 'Use default webpack CLI output instead of custom one',
    type: 'boolean',
    default: false
  },
  publicPath: {
    desc: 'Webpack public path to specify base for all assets in the app',
    type: 'string'
  },
  ignoreWarnings: {
    desc: 'Webpack will no longer print warnings during compilation',
    type: 'boolean'
  }
};

export default SharedArgs;
