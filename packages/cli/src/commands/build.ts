import { logger } from '@ima/dev-utils/logger';
import { createBuilder, ViteBuilder } from 'vite';
import { CommandBuilder } from 'yargs';

import {
  handlerFactory,
  resolveCliPluginArgs,
  sharedArgsFactory,
} from '../lib/cli';
import { HandlerFn } from '../types';
import {
  cleanup,
  createViteConfig,
  resolveImaConfig,
  runImaPluginsHook,
} from '../vite/utils/utils';
import { createManifestFileFromOutput } from '../lib/manifest';

/**
 * Builds ima application.
 *
 * @param {CliArgs} args
 * @returns {Promise<void>}
 */
const build: HandlerFn = async args => {
  try {
    // Do cleanup
    await cleanup(args);

    // Load ima config
    const imaConfig = await resolveImaConfig(args);

    // Run preProcess hook on IMA CLI Plugins
    await runImaPluginsHook(args, imaConfig, 'preProcess');

    // Generate vite config
    const config = await createViteConfig(args, imaConfig);
    const outputs: { config: string; output: Awaited<ReturnType<ViteBuilder['build']>> }[] = [];

    logger.info('Running vite compiler...', { trackTime: true });
    const builder = await createBuilder({ ...config, builder: {
        // By specifying buildApp, we can build all environments in parallel
        // Without this, Vite would build environments one by one, which should be slower
        buildApp: async (builder) => {
          // There is also default `client` environment, that we are skipping here
          const buildEnvironments = ['server', 'modern', 'legacy'];
          const envs = Object.values(builder.environments).filter(env => buildEnvironments.includes(env.name));

          await Promise.all(envs.map(async env => {
            const output = await builder.build(env)

            outputs.push({ config: env.name, output });
          }));
        }
      }});

    await builder.buildApp();

    logger.endTracking();

    // Create manifest file from output
    await createManifestFileFromOutput(outputs, imaConfig);
    logger.info('Vite build finished successfully.');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const CMD = 'build';
export const command = CMD;
export const describe = 'Build an application for production';
export const handler = handlerFactory(build);
export const builder: CommandBuilder = {
  ...sharedArgsFactory(CMD),
  profile: {
    desc: 'Turn on profiling support in production',
    type: 'boolean',
    default: false,
  },
  ...resolveCliPluginArgs(CMD),
};
