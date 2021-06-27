const { VerboseOptions } = require('./constants');

module.exports = {
  verbose: {
    alias: 'v',
    desc: 'Choose between different number of logging options',
    type: 'string',
    choices: Object.values(VerboseOptions)
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
