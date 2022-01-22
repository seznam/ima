import fs from 'fs';
import path from 'path';
import open from 'better-opn';
import chalk from 'chalk';
import { BundleStatsWebpackPlugin } from 'bundle-stats-webpack-plugin';
import { Configuration, WebpackPluginInstance } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { CommandBuilder } from 'yargs';

import {
  ConfigurationContext,
  ImaCliPluginCallbackArgs,
  ImaCliCommand,
  ImaCliPlugin
} from '../../types';
import logger from '../../lib/logger';

export interface AnalyzePluginConfigurationContext
  extends ConfigurationContext {
  analyze?: ConfigurationContext['name'];
  analyzeBaseline?: boolean;
}

export interface AnalyzePluginOptions {
  open: boolean;
  compare: boolean;
  bundleStatsOptions?: BundleStatsWebpackPlugin.Options;
  bundleAnalyzerOptions?: BundleAnalyzerPlugin.Options;
}

/**
 * Appends webpack bundle analyzer plugin to the build command config.
 */
export default class AnalyzePlugin
  implements ImaCliPlugin<AnalyzePluginConfigurationContext> {
  private _options: AnalyzePluginOptions;

  readonly name = 'AnalyzePlugin';
  readonly cliArgs: Partial<Record<ImaCliCommand, CommandBuilder>> = {
    build: {
      analyze: {
        desc: 'Runs multiple webpack bundle analyzer plugins on given entry',
        type: 'string',
        choices: ['server', 'client', 'client.es']
      },
      analyzeBaseline: {
        desc: 'Generates baseline for webpack bundle stats comparison',
        type: 'boolean'
      }
    }
  };

  constructor(options: AnalyzePluginOptions) {
    this._options = options;
  }

  async webpack(
    config: Configuration,
    ctx: AnalyzePluginConfigurationContext
  ): Promise<Configuration> {
    const { analyze, isServer, isEsVersion } = ctx;

    if (!analyze) {
      return config;
    }

    const isCompare = this._options?.compare === true;
    const isBaseline =
      ctx?.analyzeBaseline === true ||
      (isCompare &&
        !fs.existsSync(path.join(ctx.rootDir, 'build/bundle-stats.html')));

    if (
      (analyze === 'server' && isServer) ||
      (analyze === 'client.es' && isEsVersion) ||
      (analyze === 'client' && !isEsVersion && !isServer)
    ) {
      config.plugins?.push(
        new BundleStatsWebpackPlugin({
          // @ts-expect-error Not in type definitions
          silent: true,
          compare: isCompare,
          baseline: isBaseline,
          ...(this._options?.bundleStatsOptions ?? {})
        }) as WebpackPluginInstance,
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          generateStatsFile: true,
          logLevel: 'silent',
          openAnalyzer: false,
          ...(this._options?.bundleAnalyzerOptions ?? {})
        })
      );
    }

    return config;
  }

  onDone({ isFirstRun, args }: ImaCliPluginCallbackArgs): void {
    // @ts-expect-error to be fixed (args contain analyze but its not properly typed)
    if (isFirstRun === false || !args.analyze) {
      return;
    }

    const reportPath = path.join(args.rootDir, 'build/report.html');
    const statsPath = path.join(args.rootDir, 'build/stats.json');
    const bundleStatsPath = path.join(args.rootDir, 'build/bundle-stats.html');

    const reportExists = fs.existsSync(reportPath);
    const statsExists = fs.existsSync(statsPath);
    const bundleStatsExists = fs.existsSync(bundleStatsPath);

    // Don't print anything if no report was generated
    if (!reportExists && !statsExists && !bundleStatsExists) {
      return;
    }

    logger.write('');
    logger.plugin(
      `${chalk.bold.bgBlue.white('Analyze plugin')} generated following report:`
    );

    if (reportExists || statsExists) {
      logger.write(chalk.bold.underline('\nWebpack Bundle Analyzer:'));
      reportExists && logger.write(`${chalk.gray('├')} report - ${reportPath}`);
      statsExists &&
        logger.write(`${chalk.gray('└')} webpack stats - ${statsPath}`);
    }

    if (bundleStatsExists) {
      logger.write(chalk.bold.underline('\nWebpack Bundle Stats:'));
      logger.write(`${chalk.gray('└')} report - ${bundleStatsPath}`);
    }

    // Write info about stats.json usage
    if (statsExists) {
      logger.write(
        chalk.bold(
          `\nThe generated ${chalk.green(
            'stats.js'
          )} file can be used in the following online analyzers:`
        )
      );
      logger.write(
        `${chalk.gray(
          '├'
        )} https://alexkuz.github.io/webpack-chart/ ${chalk.gray(
          '- interactive pie chart'
        )}`
      );
      logger.write(
        `${chalk.gray(
          '├'
        )} https://chrisbateman.github.io/webpack-visualizer/ ${chalk.gray(
          '- visualize and analyze bundle'
        )}`
      );
      logger.write(
        `${chalk.gray('└')} https://webpack.jakoblind.no/optimize/ ${chalk.gray(
          '- analyze and optimize bundle\n'
        )}`
      );
    }

    if (this._options?.open !== false) {
      reportExists && open(`file://${reportPath}`);
      bundleStatsExists && open(`file://${bundleStatsPath}`);
    }
  }
}
