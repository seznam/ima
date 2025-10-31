import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

import { logger } from '@ima/dev-utils/logger';
import { CommandBuilder } from 'yargs';

import {
  handlerFactory,
  resolveCliPluginArgs,
  runCommand,
  sharedArgsFactory,
} from '../lib/cli';
import { HandlerFn } from '../types';
import { resolveEnvironment } from '../webpack/utils/utils';

/**
 * Wait for the server to start.
 */
async function waitForServer(port: number, maxAttempts = 30): Promise<void> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await fetch(`http://localhost:${port}`);

      return;
    } catch {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  throw new Error('Server failed to start');
}

/**
 * Prerender a single URL:
 * - Fetch the HTML content
 * - Return the URL and HTML content
 */
async function preRenderPath(
  path: string,
  baseUrl: string
): Promise<{ url: string; html: string }> {
  const url = new URL(path, baseUrl);
  const response = await fetch(url.toString());
  const html = await response.text();

  return { url: url.toString(), html };
}

/**
 * Convert URL to filename:
 * - Remove leading and trailing slashes
 * - Replace remaining slashes with underscores
 * - Add mode and .html extension
 */
function getOutputFilename(url: string, mode: string): string {
  const pathname = new URL(url).pathname;
  const urlPath =
    pathname === '/'
      ? ''
      : pathname.replace(/^\/|\/$/g, '').replace(/\//g, '_');

  return `${mode}${urlPath ? `-${urlPath}` : ''}.html`;
}

const prerender: HandlerFn = async args => {
  try {
    // Parse paths to prerender
    const paths = args.paths
      ? Array.isArray(args.paths)
        ? args.paths
        : [args.paths]
      : ['/'];

    // Build the application first
    logger.info('Building application...');
    await runCommand('ima', ['build'], {
      ...args,
    });

    // Load environment to get the application port
    const environment = resolveEnvironment(args.rootDir);

    // Start the server with appropriate mode
    const { preRenderMode } = args;

    if (!preRenderMode) {
      throw new Error('Prerender mode is required');
    }

    logger.info(`Starting server in ${preRenderMode.toUpperCase()} mode...`);

    const port = environment.$Server.port ?? 3001;
    const hostname = environment.$Server.host ?? 'localhost';
    const serverProcess = spawn('ima', ['start'], {
      stdio: 'inherit',
      env: {
        ...process.env,
        ...(preRenderMode === 'spa' ? { IMA_CLI_FORCE_SPA: 'true' } : {}),
      },
    });

    // Wait for server to start
    await waitForServer(port);
    const baseUrl = `http://${hostname}:${port}`;

    // Create output directory if it doesn't exist
    const outputDir = path.resolve(args.rootDir, 'build');
    await fs.mkdir(outputDir, { recursive: true });

    // Prerender all URLs
    logger.info(`Prerendering ${paths.length} Path(s)...`);
    const results = await Promise.all(
      paths.map(path => preRenderPath(path, baseUrl))
    );

    // Write results to disk
    for (const result of results) {
      const outputPath = path.join(
        outputDir,
        getOutputFilename(result.url, preRenderMode)
      );

      await fs.writeFile(outputPath, result.html);
      logger.info(`Prerendered ${result.url} -> ${outputPath}`);
    }

    // Clean up
    serverProcess.kill();
    process.exit(0);
  } catch (error) {
    logger.error(
      error instanceof Error ? error : new Error('Unknown prerender error')
    );
    process.exit(1);
  }
};

const CMD = 'prerender';
export const command = CMD;
export const describe = 'Prerender application as static HTML';
export const handler = handlerFactory(prerender);
export const builder: CommandBuilder = {
  ...sharedArgsFactory(CMD),
  preRenderMode: {
    desc: 'Prerender mode (spa or ssr)',
    type: 'string',
    choices: ['spa', 'ssr'],
    default: 'spa',
  },
  paths: {
    desc: 'Path(s) to prerender (defaults to /)',
    type: 'array',
    string: true,
  },
  ...resolveCliPluginArgs(CMD),
};
