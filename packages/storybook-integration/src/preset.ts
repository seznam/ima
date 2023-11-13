import {
  createWebpackConfig,
  resolveImaConfig,
  ImaCliArgs,
  compileLanguages,
  runImaPluginsHook,
} from '@ima/cli';
import type { GlobalImaObject } from '@ima/core';
import { Options } from '@storybook/core-webpack';
import { Configuration } from 'webpack';

import {
  resolveStyles,
  resolveAliases,
  resolveLanguageEntryPoints,
  resolveSWC,
  resolveRevivalSettings,
} from './presets/resolvers.js';

export const webpackFinal = async (
  config: Configuration,
  options: Options & { $IMA: GlobalImaObject }
): Promise<Configuration> => {
  const mockArgs: ImaCliArgs = {
    clean: false,
    environment:
      process.env.NODE_ENV === 'production' ? 'production' : 'development',
    rootDir: process.cwd(),
    command: options.configType === 'DEVELOPMENT' ? 'dev' : 'build',
  };

  const imaConfig = await resolveImaConfig(mockArgs);
  await runImaPluginsHook(mockArgs, imaConfig, 'preProcess');
  const imaWebpackConfig = await createWebpackConfig(mockArgs, imaConfig);
  const clientConfig = imaWebpackConfig.find(c => c.name === 'client.es');

  if (!clientConfig) {
    throw Error(
      '@ima/storybook-integration: Unable to resolve client webpack config.'
    );
  }

  // Compile languages
  // @ts-expect-error missing in types
  await compileLanguages(imaConfig, mockArgs.rootDir, options._name === 'dev');

  // Replace minimizers
  config.optimization = {
    ...clientConfig.optimization,
    minimizer: clientConfig.optimization?.minimizer ?? [],
  };

  // Update storybook config with ima specifics
  return [
    resolveLanguageEntryPoints,
    resolveAliases,
    resolveStyles,
    resolveSWC,
    resolveRevivalSettings,
  ].reduce((acc, resolver) => {
    acc = resolver({
      config,
      imaConfig,
      imaWebpackConfig: clientConfig,
      args: mockArgs,
      options,
    });

    return acc;
  }, config);
};
