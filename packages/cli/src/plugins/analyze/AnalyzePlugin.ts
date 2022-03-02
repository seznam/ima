// TODO remove plugin specific dependencies form cli package.json

import fs from 'fs';
import path from 'path';

import open from 'better-opn';
import { BundleStatsWebpackPlugin } from 'bundle-stats-webpack-plugin';
import chalk from 'chalk';
import { Configuration, WebpackPluginInstance } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { CommandBuilder } from 'yargs';

import { createLogger } from '../../lib/logger';
import {
  ImaConfigurationContext,
  ImaCliCommand,
  ImaCliPlugin,
  ImaCliArgs,
} from '../../types';

// Extend existing cli args interface with new values
declare module '../../types' {
  interface ImaCliArgs {
    analyze?: ImaConfigurationContext['name'];
    analyzeBaseline?: boolean;
  }
}

export interface AnalyzePluginOptions {
  open?: boolean;
  compare?: boolean;
  bundleStatsOptions?: BundleStatsWebpackPlugin.Options;
  bundleAnalyzerOptions?: BundleAnalyzerPlugin.Options;
}

/**
 * Appends webpack bundle analyzer plugin to the build command config.
 */
class AnalyzePlugin implements ImaCliPlugin {
  private _options: AnalyzePluginOptions;
  private _logger: ReturnType<typeof createLogger>;

  readonly name = 'AnalyzePlugin';
  readonly cliArgs: Partial<Record<ImaCliCommand, CommandBuilder>> = {
    build: {
      analyze: {
        desc: 'Runs multiple webpack bundle analyzer plugins on given entry',
        type: 'string',
        choices: ['server', 'client', 'client.es'],
      },
      analyzeBaseline: {
        desc: 'Generates baseline for webpack bundle stats comparison',
        type: 'boolean',
      },
    },
  };

  constructor(options: AnalyzePluginOptions) {
    this._options = options;
    this._logger = createLogger(this);
  }

  async webpack(
    config: Configuration,
    ctx: ImaConfigurationContext
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
          ...(this._options?.bundleStatsOptions ?? {}),
        }) as WebpackPluginInstance,
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          generateStatsFile: true,
          logLevel: 'silent',
          openAnalyzer: false,
          ...(this._options?.bundleAnalyzerOptions ?? {}),
        })
      );
    }

    return config;
  }

  async postProcess(args: ImaCliArgs): Promise<void> {
    if (!args.analyze) {
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

    this._logger.plugin('generated following report:');

    if (reportExists || statsExists) {
      this._logger.write(chalk.bold.underline('\nWebpack Bundle Analyzer:'));
      reportExists &&
        this._logger.write(
          `${chalk.gray('├')} report - ${chalk.magenta(reportPath)}`
        );
      statsExists &&
        this._logger.write(
          `${chalk.gray('└')} webpack stats - ${chalk.magenta(statsPath)}`
        );
    }

    if (bundleStatsExists) {
      this._logger.write(chalk.bold.underline('\nWebpack Bundle Stats:'));
      this._logger.write(
        `${chalk.gray('└')} report - ${chalk.magenta(bundleStatsPath)}`
      );
    }

    // Write info about stats.json usage
    if (statsExists) {
      this._logger.write(
        chalk.bold(
          `\nThe generated ${chalk.green(
            'stats.js'
          )} file can be used in the following online analyzers:`
        )
      );
      this._logger.write(
        `${chalk.gray(
          '├'
        )} https://alexkuz.github.io/webpack-chart/ ${chalk.gray(
          '- interactive pie chart'
        )}`
      );
      this._logger.write(
        `${chalk.gray(
          '├'
        )} https://chrisbateman.github.io/webpack-visualizer/ ${chalk.gray(
          '- visualize and analyze bundle'
        )}`
      );
      this._logger.write(
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

export { AnalyzePlugin };
