import { Configuration, ResolveOptions } from 'webpack';

/**
 * Inject expected ENV values into nodeJS process.env object.
 */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      IMA_CLI_WEBPACK_CONFIG_ARGS: string;
    }
  }
}

/**
 * Cli verbose parametr possible options.
 */
export enum VerboseOptions {
  DEFAULT = 'default',
  RAW = 'raw'
}

/**
 * Base args available in every ima script. Following 3 arguments
 * are available and mandatory in every ima cli script.
 */
export type BaseArgs = {
  rootDir: string;
  isProduction: boolean;
  command: string;
};

/**
 * Start (ima start) script args
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
 * Dev (ima dev) script args
 */
export type DevArgs = DevBuildArgs & {
  open?: boolean;
};

/**
 * Build (ima build) script args
 */
export type BuildArgs = DevBuildArgs & {
  clean?: boolean;
};

/**
 * Arguments passed across ima cli and into webpack config
 * function generator.
 */
export type Args = BuildArgs &
  DevArgs & {
    isWatch?: boolean;
    isServer?: boolean;
  };

export type HandlerFn<T extends BaseArgs> = (args: T) => Promise<void>;
export type ConfigurationTypes = ('client' | 'server')[];
export const IMA_CONF_FILENAME = 'ima.config.js';

/**
 * Ima config options. Some of these options can be overridden using Args, which takes precedence.
 * These are parsed from optional ima.config.js that can be defined in the root of the IMA.js project.
 */
export type ImaConfig = {
  /**
   * Webpack callback function can be used to completely customize default webpack config before it's run:
   * @param {Configuration} config generated config by ima CLI, which can be further customized.
   * @param {Args}          args CLI args, with additional options -> `rootDir`, `isProduction`, `isServer`, `isWatch"
   *                             that help identify the current state webpack trying to run this config.
   * @param {ImaConfig}    imaConfig additional local ima.config.js file contents ({} if there's no file created).
   */
  webpack?: (config: Configuration, args: Args, imaConfig: ImaConfig) => void;

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
  webpackAliases?: ResolveOptions['alias'];

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

export type WifValue = unknown[] | Record<string, unknown>;
export type AdditionalDataFn = (content: string) => string;
export type AdditionalDataFactoryFn = (content: string) => void;
export type AdditionalDataContentFn = (
  prefix: AdditionalDataFactoryFn,
  postfix: AdditionalDataFactoryFn
) => void;

/**
 * IMA.js loaded environment
 */
export type ImaEnvironment = {
  /**
   * Server config
   */
  $Server: {
    port: number;
  };

  /**
   * Debug flag
   */
  $Debug: boolean;

  /**
   * Possible environments
   */
  $Env: 'production' | 'dev' | 'test' | 'regression';

  /**
   * App data
   */
  $App: unknown;

  /**
   * Array of defined languages
   */
  $Language: string[];
};
