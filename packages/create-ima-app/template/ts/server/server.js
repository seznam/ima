const cluster = require('cluster');
const os = require('os');

const { imaServer, app } = require('./app');
const { environment, logger } = imaServer;

if (environment.$Env !== 'dev') {
  logger.level = 'warn';
}

if (
  environment.$Env === 'dev' ||
  environment.$Server.clusters === 1 ||
  !cluster.isMaster
) {
  app.listen(environment.$Server.port, () => {
    return logger.info(
      'The app is running at http://localhost:' + environment.$Server.port
    );
  });
} else {
  let cpuCount = environment.$Server.clusters || os.cpus().length;

  // Create a worker for each CPU
  for (let i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }

  // Listen for dying workers
  cluster.on('exit', worker => {
    logger.warn(`Worker ${worker.id} died :(`);
    cluster.fork();
  });
}
