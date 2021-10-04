import { CommandBuilder } from 'yargs';

import { VerboseOptions } from '../types';

const SharedArgs: CommandBuilder = {
  verbose: {
    alias: 'v',
    desc: 'Choose between different number of logging options',
    type: 'string',
    choices: Object.values(VerboseOptions),
    default: VerboseOptions.DEFAULT
  },
  amp: {
    alias: 'm',
    desc: 'Builds separate CSS files for use in AMP mode',
    type: 'boolean'
  },
  scrambleCss: {
    alias: 's',
    desc: 'Scrambles class names and generates hashtable',
    type: 'boolean'
  },
  publicPath: {
    alias: 'p',
    desc: 'Webpack public path to specify base for all assets in the app',
    type: 'string'
  }
};

export default SharedArgs;
