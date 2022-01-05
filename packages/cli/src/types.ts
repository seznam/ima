import { AlgorithmFunction, ZlibOptions } from 'compression-webpack-plugin';
import { Configuration, MultiCompiler, ResolveOptions } from 'webpack';
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
  verbose?: boolean;
  publicPath?: string;
  ignoreWarnings?: boolean;
}

/**
 * Dev (ima dev) script args
 */
export interface DevArgs extends DevBuildArgs {
  clean?: boolean;
  open?: boolean;
  legacy?: boolean;
  forceSPA?: boolean;
}

/**
 * Build (ima build) script args
 */
export type BuildArgs = DevBuildArgs;

/**
 * Arguments passed across ima cli and into webpack config
 * function generator.
 */
export interface CliArgs extends BuildArgs, DevArgs {
  isWatch?: boolean;
}

/**
 * CLI arguments merged with current configuration arguments.
 */
export interface ConfigurationContext extends CliArgs {
  name: 'server' | 'client' | 'client.es';
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

/**
 * Interface for ima/cli plugins that can be defined in plugins field in ima.conf.js. These can be used
 * to extend functionality of default CLI with custom cli arguments and webpack config overrides.
 */
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

  /**
   * Optional done callback which is run after first successful compilation.
   * It is run after information about the built are printed to the console by the CLI.
   */
  onDone?: (params: {
    firstRun?: boolean;
    args: CliArgs;
    imaConfig: ImaConfig;
    compiler: MultiCompiler;
  }) => void;
}

/**
 * Factory function, used for external CLI plugins development.
 */
export type ImaCliPluginFactory<O = Record<string, unknown>> = (
  options?: O
) => ImaCliPlugin;

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
   * Set to true to generate source maps in production builds
   * (dev/watch build always generate source maps to work properly with error overlay).
   */
  useSourceMaps?: boolean;

  /**
   * Array of compression algorithms used for assets in production build. [default=['brotliCompress', 'gzip']]
   */
  compression: (AlgorithmFunction<ZlibOptions> | 'gzip' | 'brotliCompress')[];

  /**
   * Threshold to inline image resources as base64 automatically [default=8192]
   */
  imageInlineSizeLimit: number;

  /**
   * Optional custom webpack aliases
   */
  webpackAliases?: ResolveOptions['alias'];
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
  $Env: string;

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
