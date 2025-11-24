import {
  type ImaCliArgs,
  type ImaConfig,
  findRules,
  getLanguageEntryPoints,
  resolveEnvironment,
} from '@ima/cli';
import { Options } from '@storybook/core-webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { Configuration, RuleSetRule } from 'webpack';

export type ResolverParams = {
  config: Configuration;
  imaConfig: ImaConfig;
  imaWebpackConfig: Configuration;
  args: ImaCliArgs;
  options: Options & { language?: string };
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

  const lang = options?.language;
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

  // Load env for regression environment
  const oldEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'regression';
  const env = resolveEnvironment();
  process.env.NODE_ENV = oldEnv;

  const revivalSettings = `(function (root) {
    root.$Debug = ${env.$App?.$Debug};
    root.$IMA = root.$IMA || {};
    $IMA.Test = true;
    $IMA.SPA = true;
    $IMA.$App = ${JSON.stringify(env.$App || {})};
    $IMA.$PublicPath = "";
    $IMA.$RequestID = "storybook-request-id";
    $IMA.$Language = "${options.language ?? 'en'}";
    $IMA.$Env = "regression";
    $IMA.$Debug = ${env.$App?.$Debug};
    $IMA.$Version = "${env.$Version}";
    $IMA.$Protocol = "${options.https ? 'https:' : 'http:'}";
    $IMA.$Host = "${
      options.host ? options.host : `localhost:${options.port ?? 6006}`
    }";
    $IMA.$Path = "";
    $IMA.$Root = "";
    $IMA.$LanguagePartPath = "";
  })(typeof window !== 'undefined' && window !== null ? window : global);
  `;

  config.entry?.unshift(
    `data:text/javascript;base64,${Buffer.from(revivalSettings).toString(
      'base64'
    )}`
  );

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
      ...findRules(imaWebpackConfig, 'test.js'),
      ...findRules(imaWebpackConfig, 'test.ts'),
    ] as RuleSetRule[]
  )
    .filter(
      rule =>
        rule.loader?.includes('swc') ||
        rule?.oneOf?.some(
          oneOf => typeof oneOf === 'object' && oneOf?.loader?.includes('swc')
        )
    )
    .map(rule => {
      // Update include path
      rule.include = [args.rootDir];
      rule.exclude = /node_modules/;

      // Disable react refresh
      if ((rule?.options as any)?.jsc?.transform?.react) {
        (rule.options as any).jsc.transform.react.refresh = false;
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
