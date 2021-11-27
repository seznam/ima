import CompressionPlugin from 'compression-webpack-plugin';
import { Configuration, ResolveOptions } from 'webpack';
import { CommandBuilder } from 'yargs';

/**
 * Inject expected ENV values into nodeJS process.env object.
 */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      IMA_CLI_WEBPACK_CONFIG_ARGS: string | undefined;
      IMA_CLI_FORCE_SPA: string | undefined;
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
 * Available ima cli commands string identifiers.
 */
export type ImaCliCommand = 'start' | 'build' | 'dev';

/**
 * Base args available in every ima script. Following 3 arguments
 * are available and mandatory in every ima cli script.
 */
export interface BaseArgs {
  rootDir: string;
  isProduction: boolean;
  command: ImaCliCommand;
}

/**
 * Start (ima start) script args
 */
export type StartArgs = BaseArgs;

/**
 * Shared dev and build script args
 */
export interface DevBuildArgs extends BaseArgs {
  verbose?: VerboseOptions;
  scrambleCss?: boolean;
  publicPath?: string;
  amp?: boolean;
}

/**
 * Dev (ima dev) script args
 */
export interface DevArgs extends DevBuildArgs {
  open?: boolean;
  legacy?: boolean;
  forceSPA?: boolean;
}

/**
 * Build (ima build) script args
 */
export interface BuildArgs extends DevBuildArgs {
  clean?: boolean;
}

/**
 * Arguments passed across ima cli and into webpack config
 * function generator.
 */
export interface Args extends BuildArgs, DevArgs {
  isWatch?: boolean;
}

/**
 * CLI arguments merged with current configuration arguments.
 */
export interface ConfigurationContext extends Args {
  name: string;
  isServer: boolean;
  isEsVersion?: boolean;
}

export type HandlerFn<T extends BaseArgs> = (args: T) => Promise<void>;
export type ConfigurationTypes = ('client' | 'server')[];

/**
 * Webpack callback function used to customize webpack config before it's run.
 *
 * @param {Configuration} config generated config by ima CLI, which can be further customized.
 * @param {ConfigurationContext} ctx CLI arguments merged with current configuration arguments.
 * @param {ImaConfig} imaConfig additional local ima.config.js file contents ({} if there's no file created).
 */
export type ImaConfigWebpack = (
  config: Configuration,
  ctx: ConfigurationContext,
  imaConfig: ImaConfig
) => Promise<Configuration>;

export interface ImaCliPlugin {
  /**
   * Plugin name, used mainly for better debugging messages.
   */
  name: string;

  /**
   * Optional additional CLI arguments to extend the set of existing ones.
   */
  cliArgs?: Partial<Record<ImaCliCommand, CommandBuilder>>;

  /**
   * Webpack callback function used by plugins to customize/extend ima webpack config before it's run.
   */
  webpack: ImaConfigWebpack;
}

/**
 * Ima config options. Some of these options can be overridden using Args, which takes precedence.
 * These are parsed from optional ima.config.js that can be defined in the root of the IMA.js project.
 */
export type ImaConfig = {
  /**
   * Webpack callback function can be used to completely customize default webpack config before it's run.
   */
  webpack?: ImaConfigWebpack;

  /**
   * Optional IMA cli plugins that can be used to easily extend
   * webpack config and cli with additional features.
   */
  plugins?: ImaCliPlugin[];

  /**
   * Webpack assets public path [default='']
   */
  publicPath: string;

  /**
   * Array of compression algorithms used for assets in production build. [default=['brotliCompress', 'gzip']]
   */
  compression: Extract<
    CompressionPlugin.ZlibAlgorithm,
    'gzip' | 'brotliCompress'
  >[];

  /**
   * Enables CSS scrambling (for AMP too) [default=process.env.NODE_ENV==='production']
   */
  scrambleCss: boolean;

  /**
   * Threshold to inline image resources as base64 automatically [default=8192]
   */
  imageInlineSizeLimit: number;

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

export type AdditionalDataFn = (content: string) => string;
export type AdditionalDataFactoryFn = (content: string) => void;
export type AdditionalDataContentFn = (
  prefix: AdditionalDataFactoryFn,
  postfix: AdditionalDataFactoryFn
) => void;

/**
 * IMA.js loaded environment
 */
export interface ImaEnvironment {
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
  $Env: 'prod' | 'dev' | 'test' | 'regression';

  /**
   * App version
   */
  $Version: string;

  /**
   * App data
   */
  $App: unknown;

  /**
   * Array of defined languages
   */
  $Language: string[];
}
