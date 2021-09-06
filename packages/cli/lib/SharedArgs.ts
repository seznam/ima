import { VerboseOptions } from '../types';

const SharedArgs = {
  verbose: {
    alias: 'v',
    desc: 'Choose between different number of logging options',
    type: 'string',
    choices: Object.values(VerboseOptions),
    default: VerboseOptions.DEFAULT
  },
  amp: {
    desc: 'Builds separate CSS files for use in AMP mode',
    type: 'boolean'
  },
  scrambleCss: {
    desc: 'Scrambles class names and generates hashtable',
    type: 'boolean'
  },
  publicPath: {
    desc: 'Webpack public path to specify base for all assets in the app',
    type: 'string'
  }
};

export default SharedArgs;
