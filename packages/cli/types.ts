import { Configuration, ResolveOptions } from 'webpack';

export enum VerboseOptions {
  DEFAULT = 'default',
  RAW = 'raw'
}

/**
 * Base args available in every ima script
 */
export type BaseArgs = {
  rootDir: string;
  isProduction: boolean;
  command: string;
};

/**
 * start (ima start) script args
 */
export type StartArgs = BaseArgs;

/**
 * Shared dev and build script args
 */
export type DevBuildArgs = BaseArgs & {
  verbose?: VerboseOptions;
  scrambleCss?: boolean;
  publicPath?: string;
  amp?: boolean;
};

/**
 * dev (ima dev) script args
 */
export type DevArgs = DevBuildArgs & {
  open?: boolean;
};

/**
 * build (ima build) script args
 */
export type BuildArgs = DevBuildArgs & {
  clean?: boolean;
};

export type Args = BuildArgs &
  DevArgs & {
    isWatch?: boolean;
    isServer?: boolean;
  };

export type HandlerFunction<T extends BaseArgs> = (args: T) => void;
export type ConfigurationTypes = ('client' | 'server')[];

/**
 * Ima config options. Some of these options can be overridden using Args, which takes precedence.
 */
export type ImaConfig = {
  /**
   * Webpack callback function can be used to completely customize default webpack config before it's run:
   * @param {Configuration} config generated config by ima CLI, which can be further customized.
   * @param {Args}          args CLI args, with additional options -> `rootDir`, `isProduction`, `isServer`, `isWatch"
   *                             that help identify the current state webpack trying to run this config.
   * @param {ImaConfig}    imaConfig additional local ima.config.js file contents ({} if there's no file created).
   */
  webpack?: (config: Configuration, args: Args, imaConfig: ImaConfig) => {};

  /**
   * Webpack assets public path
   */
  publicPath?: string;

  /**
   * Enable gzip compression for assets [default=process.env.NODE_ENV==='production']
   */
  compress?: boolean;

  /**
   * Enables CSS scrambling (for AMP too) [default=process.env.NODE_ENV==='production']
   */
  scrambleCss?: boolean;

  /**
   * Threshold to inline image resources as base64 automatically [default=8192]
   */
  imageInlineSizeLimit?: number;

  /**
   * Optional custom webpack aliases
   */
  webpackAliases?: Pick<ResolveOptions, 'alias'>;

  /**
   * Settings related to AMP-specific css files generation
   */
  amp?: {
    /**
     * Enables AMP css assets generation
     */
    enabled?: number;

    /**
     * AMP styles entry points (array of globs)
     */
    entry?: string[];

    /**
     * Array of custom postcss plugins applied only to AMP entry points
     */
    postCssPlugins?: [];
  };
};
