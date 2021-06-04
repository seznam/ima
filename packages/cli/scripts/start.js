const start = {
  command: 'start',
  desc: 'Run application in production',
  builder: {
    'legacy-compat-mode': {
      desc: 'Runs application in ES5 compatible format'
    }
  },
  handler: yargs => {
    console.log(yargs);
  }
};

module.exports = start;
