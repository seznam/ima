import path from 'path';
import childProcess from 'child_process';
import open from 'better-opn';
import { Compiler } from 'webpack';
import { Args, VerboseOptions } from '../../types';

export type RunImaServerPluginOptions = {
  rootDir?: Args['rootDir'];
  verbose?: VerboseOptions;
  port?: number;
  open?: boolean;
};

/**
 * Starts ima server and opens browser on localhost when server starts.
 */
class RunImaServerPlugin {
  private options: RunImaServerPluginOptions;
  private serverStart: boolean;

  constructor(options: RunImaServerPluginOptions = {}) {
    this.options = options;
    this.serverStart = false;
  }

  apply(compiler: Compiler): void {
    compiler.hooks.done.tapAsync(
      'RunImaServerPlugin',
      (compilation, callback) => {
        if (!this.serverStart && this.options.rootDir) {
          childProcess.fork(
            path.join(this.options.rootDir, 'build/server'),
            [`--verbose=${this.options.verbose}`],
            {
              stdio: 'inherit'
            }
          );

          // TODO -> use on('spawn'), but it doesn't seems to work right now
          if (this.options.open) {
            try {
              open(`http://localhost:${this.options.port || 3001}`);
            } catch (error) {
              console.error(
                `Could not open http://localhost:${
                  this.options.port || 3001
                } inside a browser.`
              );
            }
          }

          this.serverStart = true;
        }

        callback();
      }
    );
  }
}

export default RunImaServerPlugin;
