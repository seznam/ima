import { findRules } from '@ima/cli';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { Configuration, RuleSetRule } from 'webpack';

export function removeRule(config: Configuration, testString: string): void {
  const rules = config.module?.rules as RuleSetRule[];

  rules.splice(
    rules.findIndex(
      rule => rule?.test instanceof RegExp && rule?.test?.test(testString)
    ),
    1
  );
}

export function resolveAliases(
  config: Configuration,
  imaConfig: Configuration
): Configuration {
  // Merge aliases
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve?.alias,
      ...imaConfig.resolve?.alias,
    },
  };

  return config;
}

export function resolveStyles(
  config: Configuration,
  imaConfig: Configuration
): Configuration {
  const styleRules = findRules(imaConfig, 'test.module.less') as RuleSetRule[];

  // Remove default style loaders
  removeRule(config, 'test.css');

  // Replace style loaders
  config.module?.rules?.push(...styleRules);
  const miniCssExtractPlugin = imaConfig.plugins?.find(
    plugin => plugin instanceof MiniCssExtractPlugin
  );

  if (miniCssExtractPlugin) {
    config.plugins?.push(miniCssExtractPlugin);
  }

  return config;
}
