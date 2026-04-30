import fs from 'fs';
import path from 'path';

import { defaultConfig } from './configurations.js';
import { Context, ImaPluginConfig, Args } from '../types.js';

const CONFIG_BASENAME = 'ima-plugin.config';

/**
 * Searches for ima-plugin.config.* starting from cwd, traversing up to fs root.
 */
export async function parseConfigFile(
  cwd: string,
  args: Args
): Promise<ImaPluginConfig[]> {
  const configDir = path.resolve(cwd);
  const configFile = await fs.promises
    .readdir(configDir)
    .then(files =>
      files.find(fileName => fileName.startsWith(CONFIG_BASENAME))
    );

  // Recursively try to find file up to file system root
  if (!configFile) {
    const newConfigDir = path.resolve(cwd, '..');

    if (newConfigDir !== configDir) {
      return parseConfigFile(path.resolve(cwd, '..'), args);
    }
  }

  // Start with default config
  let loadedConfig: ImaPluginConfig[] = [defaultConfig];

  // Override with custom configuration file if found
  if (configFile) {
    let configPath = path.join(configDir, configFile);

    if (!configPath.startsWith('/')) {
      configPath = 'file:///' + configPath.replace(/\\/g, '/');
    }

    loadedConfig = (await import(configPath)).default;
    loadedConfig = Array.isArray(loadedConfig) ? loadedConfig : [loadedConfig];
  }

  // Override jsx runtime option from CLI args
  if (args.jsxRuntime) {
    loadedConfig = loadedConfig.map(config => ({
      ...config,
      jsxRuntime: args.jsxRuntime,
    }));
  }

  return loadedConfig;
}

/**
 * Runs plugins defined in config.
 */
export async function runPlugins(context: Context): Promise<void> {
  if (!context.config?.plugins?.length) {
    return;
  }

  for (const plugin of context.config.plugins) {
    await plugin(context);
  }
}
