import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

import { logger } from '@ima/dev-utils/logger';
import { CommandBuilder } from 'yargs';

import { handlerFactory } from '../lib/cli';
import { HandlerFn } from '../types';

/**
 * Starts ima application in production mode.
 *
 * @param {CliArgs} args
 * @returns {Promise<void>}
 */
const start: HandlerFn = async args => {
  try {
    const serverPath = args.server
      ? path.resolve(args.rootDir, args.server)
      : path.resolve(args.rootDir, 'server/server.js');

    // Validate server file exists
    if (!fs.existsSync(serverPath)) {
      logger.error(`Server file not found at: ${serverPath}`);
      process.exit(1);
    }

    logger.info('Starting production server...');

    // Spawn node process with the server
    const serverProcess = spawn('node', [serverPath], {
      stdio: 'inherit',
      env: { ...process.env },
    });

    // Handle server process events
    serverProcess.on('error', error => {
      logger.error(`Failed to start server process: ${error.message}`);
      process.exit(1);
    });

    // Forward SIGTERM and SIGINT to the child process
    const signals = ['SIGTERM', 'SIGINT'] as const;
    signals.forEach(signal => {
      process.on(signal, () => {
        if (serverProcess.pid) {
          process.kill(serverProcess.pid, signal);
        }
        process.exit();
      });
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Failed to start server: ${error.message}`);
    } else {
      logger.error('Failed to start server: Unknown error');
    }
    process.exit(1);
  }
};

const CMD = 'start';
export const command = CMD;
export const describe = 'Start the application in production mode';
export const handler = handlerFactory(start);
export const builder: CommandBuilder = {
  server: {
    type: 'string',
    description: 'Custom path to the server file (relative to project root)',
    default: 'server/server.js',
  },
};
