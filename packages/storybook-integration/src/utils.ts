import { ImaConfig, findRules, getLanguageEntryPoints } from '@ima/cli';
import { ImaCliArgs } from '@ima/cli/src';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { Configuration, RuleSetRule } from 'webpack';

export type ResolverParams = {
  config: Configuration;
  imaConfig: ImaConfig;
  imaWebpackConfig: Configuration;
  args: ImaCliArgs;
};

/**
 * Helper function for removing rules from webpack module rules config.
 */
export function removeRule(config: Configuration, testString: string): void {
  const rules = config.module?.rules as RuleSetRule[];

  rules.splice(
    rules.findIndex(
      rule => rule?.test instanceof RegExp && rule?.test?.test(testString)
    ),
    1
  );
}

/**
 * Add language files entry points.
 */
export function resolveLanguageEntryPoints({
  config,
  imaConfig,
  args,
}: ResolverParams): Configuration {
  if (!Array.isArray(config.entry)) {
    throw new Error(
      '@ima/storybook-integration: Unsupported storybook entry type.'
    );
  }

  config.entry.push(
    ...Object.values(
      getLanguageEntryPoints(imaConfig.languages, args.rootDir, false)
    )
  );

  return config;
}

/**
 * Merge aliases from ima config to storybook webpack config.
 */
export function resolveAliases({
  config,
  imaWebpackConfig,
}: ResolverParams): Configuration {
  // Merge aliases
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve?.alias,
      ...imaWebpackConfig.resolve?.alias,
    },
  };

  return config;
}

/**
 * Replace storybook style loaders with ima specific ones.
 */
export function resolveStyles({
  config,
  imaWebpackConfig,
}: ResolverParams): Configuration {
  const styleRules = findRules(
    imaWebpackConfig,
    'test.module.less'
  ) as RuleSetRule[];

  // Remove default style loaders
  removeRule(config, 'test.css');

  // Replace style loaders
  config.module?.rules?.push(...styleRules);
  const miniCssExtractPlugin = imaWebpackConfig.plugins?.find(
    plugin => plugin instanceof MiniCssExtractPlugin
  );

  if (miniCssExtractPlugin) {
    config.plugins?.push(miniCssExtractPlugin);
  }

  return config;
}
