import { ImaConfig, findRules, getLanguageEntryPoints } from '@ima/cli';
import { ImaCliArgs } from '@ima/cli/src';
import { GlobalImaObject } from '@ima/core';
import { Options } from '@storybook/types';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { Configuration, RuleSetRule } from 'webpack';

export type ResolverParams = {
  config: Configuration;
  imaConfig: ImaConfig;
  imaWebpackConfig: Configuration;
  args: ImaCliArgs;
  options: Options & { $IMA?: GlobalImaObject };
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
  options,
}: ResolverParams): Configuration {
  if (!Array.isArray(config.entry)) {
    throw new Error(
      '@ima/storybook-integration: Unsupported storybook entry type.'
    );
  }

  const lang = options?.$IMA?.$Language;
  const languageEntries = getLanguageEntryPoints(
    imaConfig.languages,
    args.rootDir,
    false
  );

  // Add chosen language to entries
  if (lang && languageEntries[`locale/${lang}`]) {
    config.entry.push(languageEntries[`locale/${lang}`]);

    return config;
  }

  // Use first language as default
  config.entry.push(languageEntries[Object.keys(languageEntries)[0]]);

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

/**
 * Replace storybook style loaders with ima specific ones.
 */
export function resolveSWC({
  args,
  config,
  imaWebpackConfig,
}: ResolverParams): Configuration {
  const jsRules = (
    [
      ...findRules(imaWebpackConfig, 'test.js', 'swc'),
      ...findRules(imaWebpackConfig, 'test.ts', 'swc'),
    ] as RuleSetRule[]
  ).map(rule => {
    // Update include path
    rule.include = [args.rootDir];
    rule.exclude = /node_modules/;

    // Enable react refres
    if ((rule?.options as any)?.jsc?.transform?.react) {
      (rule.options as any).jsc.transform.react.refresh = true;
    }

    return rule;
  });

  // Remove existing babel rules
  removeRule(config, 'test.js');
  removeRule(config, 'test.ts');

  // Push new swc rules
  config.module?.rules?.push(...jsRules);

  return config;
}

/**
 * Add mocked revival settings to final bundle.
 */
export function resolveRevivalSettings({
  config,
  imaConfig,
  args,
  options,
}: ResolverParams): Configuration {
  if (!Array.isArray(config.entry)) {
    throw new Error(
      '@ima/storybook-integration: Unsupported storybook entry type.'
    );
  }

  const { $IMA } = options;
  const revivalSettings = `(function (root) {
    root.$Debug = true;
    root.$IMA = root.$IMA || {};
    $IMA.Test = true;
    $IMA.SPA = true;
    $IMA.$PublicPath = "${process.env.IMA_PUBLIC_PATH ?? ''}";
    $IMA.$RequestID = "storybook-request-id";
    $IMA.$Language = "${$IMA?.$Language ?? 'en'}";
    $IMA.$Env = "${$IMA?.$Env ?? args.environment}";
    $IMA.$Debug = true;
    $IMA.$Version = "${$IMA?.$Version ?? '1.0.0'}";
    $IMA.$App = {};
    $IMA.$Protocol = "${$IMA?.$Protocol ?? 'http:'}";
    $IMA.$Host = "${$IMA?.$Host ?? 'http:'}";
    $IMA.$Path = "${$IMA?.$Protocol ?? '/'}";
    $IMA.$Root = "";
    $IMA.$LanguagePartPath = "";
  })(typeof window !== 'undefined' && window !== null ? window : global);
  `;

  config.entry?.push(
    `data:text/javascript;base64,${Buffer.from(revivalSettings).toString(
      'base64'
    )}`
  );

  return config;
}
