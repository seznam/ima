import {
  createWebpackConfig,
  resolveImaConfig,
  ImaCliArgs,
  compileLanguages,
} from '@ima/cli';
import { Options } from '@storybook/core-webpack';
import { Configuration } from 'webpack';

import {
  resolveStyles,
  resolveAliases,
  resolveLanguageEntryPoints,
} from './utils';

export const webpackFinal = async (
  config: Configuration,
  options: Options
): Promise<Configuration> => {
  const mockArgs: ImaCliArgs = {
    clean: false,
    environment:
      process.env.NODE_ENV === 'production' ? 'production' : 'development',
    rootDir: process.cwd(),
    command: 'dev',
  };

  const imaConfig = await resolveImaConfig(mockArgs);
  const imaWebpackConfig = await createWebpackConfig(mockArgs, imaConfig);
  const clientConfig = imaWebpackConfig.find(c => c.name === 'client.es');

  if (!clientConfig) {
    throw Error(
      '@ima/storybook-integration: Unable to resolve client webpack config.'
    );
  }

  // Compile languages
  await compileLanguages(imaConfig, mockArgs.rootDir, true);

  // Update storybook config with ima specifics
  return [resolveLanguageEntryPoints, resolveAliases, resolveStyles].reduce(
    (acc, resolver) => {
      acc = resolver({
        config,
        imaConfig,
        imaWebpackConfig: clientConfig,
        args: mockArgs,
      });

      return acc;
    },
    config
  );
};
