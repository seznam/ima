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
export type ImaCliCommand = 'build' | 'dev';

/**
 * Arguments passed across ima cli and into webpack config
 * function generator.
 */
export interface CliArgs {
  rootDir: string;
  command: ImaCliCommand;
  clean: boolean;
  clearCache?: boolean;
  verbose?: boolean;
  publicPath?: string;
  ignoreWarnings?: boolean;
  open?: boolean;
  legacy?: boolean;
  forceSPA?: boolean;
  forceSPAWithHMR?: boolean;
  profile?: boolean;
}

/**
 * CLI arguments merged with current configuration arguments.
 */
export interface ConfigurationContext extends CliArgs {
  name: 'server' | 'client' | 'client.es';
  isServer: boolean;
  isEsVersion?: boolean;
}

export type HandlerFn = (args: CliArgs) => Promise<void>;
export type ConfigurationTypes = ('client' | 'server')[];
export type ImaCliPluginCallbackArgs = {
  isFirstRun?: boolean;
  args: CliArgs;
  imaConfig: ImaConfig;
  compiler: MultiCompiler;
};

/**
 * Interface for ima/cli plugins that can be defined in plugins field in ima.conf.js. These can be used
 * to extend functionality of default CLI with custom cli arguments and webpack config overrides.
 */
export interface ImaCliPlugin<C = ConfigurationContext> {
  /**
   * Plugin name, used mainly for better debugging messages.
   */
  readonly name: string;

  /**
   * Optional additional CLI arguments to extend the set of existing ones.
   */
  readonly cliArgs?: Partial<Record<ImaCliCommand, CommandBuilder>>;

  /**
   * Webpack callback function used by plugins to customize/extend ima webpack config before it's run.
   */
  webpack(
    config: Configuration,
    ctx: C,
    imaConfig: ImaConfig
  ): Promise<Configuration>;

  /**
   * Optional done callback which is run after first successful compilation.
   * It is run after information about the built are printed to the console by the CLI.
   */
  onDone?(params: ImaCliPluginCallbackArgs): void;
}

/**
 * Ima config options. Some of these options can be overridden using Args, which takes precedence.
 * These are parsed from optional ima.config.js that can be defined in the root of the IMA.js project.
 */
export type ImaConfig = {
  /**
   * Webpack callback function can be used to completely customize default webpack config before it's run.
   */
  webpack?: (
    config: Configuration,
    ctx: ConfigurationContext,
    imaConfig: ImaConfig
  ) => Promise<Configuration>;

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
   * Set custom jsxEnvironment for @babel/preset-react, the default is 'automatic'.
   */
  jsxEnvironment?: 'classic' | 'automatic';

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

  /**
   * Supported languages with glob pathes of the files with translations
   */
  languages: Record<string, string[]>;
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
