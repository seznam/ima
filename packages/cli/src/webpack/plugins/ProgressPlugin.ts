import { time } from '@ima/dev-utils/logger';
import chalk from 'chalk';
import cliProgress from 'cli-progress';
import webpack from 'webpack';

import { ImaConfigurationContext } from '../../types';

/**
 * Helper class to track and display progress in the webpack.ProgressPlugin
 * across multiple configuration contexts. All configuration contexts are
 * tracked using one progress bar.
 */
class ProgressTracker {
  private _hasStarted: boolean;
  private _elapsed: ReturnType<typeof time> | null;
  private _trackedEntries: number;
  private _percentageTracker:
    | Record<ImaConfigurationContext['name'], number>
    | Record<string, never>;
  private _progressBar: cliProgress.SingleBar;

  constructor() {
    this._hasStarted = false;
    this._elapsed = null;
    this._trackedEntries = 0;
    this._percentageTracker = {};
    this._progressBar = new cliProgress.SingleBar({
      format: `${chalk.bold.cyan('info:')} ${chalk.gray(
        '[{bar}]'
      )} ${chalk.magenta('{percentage}%')} ${chalk.gray(
        '[{time}]'
      )} ${chalk.green('{msg}')} {other}`,
      barCompleteChar: '\u25A0',
      barIncompleteChar: ' ',
      barsize: 10,
      fps: 30,
      hideCursor: true,
    });
  }

  /**
   * Register new webpack.PluginProgress instance.
   */
  register(name: ImaConfigurationContext['name']) {
    this._trackedEntries++;
    this._percentageTracker[name] = 0;
  }

  /**
   * Custom handler for webpack.ProgressPlugin, this should be called
   * from within the webpack.ProgressPlugin instance and handles all styling
   * and progress reporting.
   */
  handler(
    name: ImaConfigurationContext['name'],
    percentage: number,
    msg: string,
    ...args: string[]
  ) {
    // Track total progress across all
    this._percentageTracker[name] = percentage;
    const normPercentage = this._getPercentage();

    if (!this._hasStarted) {
      this.start();
    }

    this.update(normPercentage, msg, args.join(' '));
  }

  /**
   * Returns percentage between 0-100 computed across all tracked configurations.
   */
  private _getPercentage(): number {
    const percentageSum = Object.values(this._percentageTracker).reduce(
      (acc, cur) => acc + cur,
      0
    );

    return Number(((percentageSum / this._trackedEntries) * 100).toFixed(0));
  }

  /**
   * Start progress bar reporting (renders progress bar with specified size).
   */
  start(): void {
    this._hasStarted = true;
    this._elapsed = time();
    this._progressBar.start(100, 0, {
      msg: chalk.green('initializing'),
    });
  }

  /**
   * Update progress bar with new data.
   */
  update(percentage: number, msg: string, other: string): void {
    this._progressBar.update(percentage, {
      time: this._elapsed?.(),
      msg,
      other,
    });
  }

  /**
   * Stop progress bar rendering and end compilation reporting.
   */
  stop(): void {
    // Don't do anything if the progress is not running
    if (!this._hasStarted) {
      return;
    }

    this._progressBar.update(100, {
      time: this._elapsed?.(),
      msg: 'done',
      other: `(${Object.keys(this._percentageTracker).join(', ')})`,
    });

    this._progressBar.stop();

    // Update tracking flags
    this._hasStarted = false;
    this._elapsed = null;
  }
}

const progressTracker = new ProgressTracker();

/**
 * Initializes wrapped webpack.ProgressPlugin
 * to track compilation progress.
 */
function createProgress(name: ImaConfigurationContext['name']) {
  // Register new progress to tracker
  progressTracker.register(name);

  // Return new progress plugin instance
  return new webpack.ProgressPlugin({
    entries: true,
    percentBy: 'dependencies',
    handler: (percentage: number, msg: string, ...args: string[]) =>
      progressTracker.handler(name, percentage, msg, ...args),
  });
}

/**
 * Provides access to the singleton progress instance
 * so i can be modified externally.
 */
function getProgress(): ProgressTracker {
  return progressTracker;
}

export { createProgress, getProgress };
