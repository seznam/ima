import { CommandBuilder } from 'yargs';

import { VerboseOptions } from '../types';

const SharedArgs: CommandBuilder = {
  verbose: {
    desc: 'Choose between different number of logging options',
    type: 'string',
    choices: Object.values(VerboseOptions),
    default: VerboseOptions.DEFAULT
  },
  publicPath: {
    desc: 'Webpack public path to specify base for all assets in the app',
    type: 'string'
  }
};

export default SharedArgs;
