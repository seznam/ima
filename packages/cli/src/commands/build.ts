import { logger } from '@ima/dev-utils/logger';
import { createBuilder, ViteBuilder } from 'vite';
import { CommandBuilder } from 'yargs';

import {
  handlerFactory,
  resolveCliPluginArgs,
  sharedArgsFactory,
} from '../lib/cli';
import { HandlerFn, ImaConfig } from '../types';
import {
  cleanup,
  createViteConfig,
  resolveImaConfig,
  runImaPluginsHook,
} from '../vite/utils/utils';
import { createManifestFileFromOutput } from '../lib/manifest';
import { formatViteStats } from '../lib/formatStats';
import { ImaBuildOutput } from '../types';

/**
 * Builds ima application.
 *
 * @param {CliArgs} args
 * @returns {Promise<void>}
 */
const build: HandlerFn = async args => {
  function buildAppFactory(outputs: ImaBuildOutput[], imaConfig: ImaConfig) {
    return async function buildApp(builder: ViteBuilder) {
      // There is also default `client` environment, that we are skipping here
      const buildEnvironments = ['server', 'modern'];

      if (!imaConfig.disableLegacyBuild) {
        buildEnvironments.push('legacy');
      }

      const envs = Object.values(builder.environments).filter(env => buildEnvironments.includes(env.name));

      await Promise.all(envs.map(async env => {
        const start = Date.now();
        const output = await builder.build(env);

        outputs.push({ env: env.name, output, time: Date.now() - start });
      }));
    }
  }

  try {
    // Do cleanup
    await cleanup(args);

    // Load ima config
    const imaConfig = await resolveImaConfig(args);

    // Run preProcess hook on IMA CLI Plugins
    await runImaPluginsHook(args, imaConfig, 'preProcess');

    // Generate vite config
    const config = await createViteConfig(args, imaConfig);
    const outputs: ImaBuildOutput[] = []; // Needed for manifest generation after build finishes

    logger.info('Running vite compiler...', { trackTime: true });
    const builder = await createBuilder({
      ...config,
      builder: {
        buildApp: buildAppFactory(outputs, imaConfig),
      },
    });

    await builder.buildApp();

    logger.endTracking();

    await createManifestFileFromOutput(outputs, imaConfig);
    formatViteStats(outputs, args.rootDir);
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
