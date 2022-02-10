import { AlgorithmFunction, ZlibOptions } from 'compression-webpack-plugin';
import {
  Configuration,
  ResolveOptions,
  WebpackOptionsNormalized,
} from 'webpack';
import { CommandBuilder } from 'yargs';

/**
 * Inject expected ENV values into nodeJS process.env object.
 */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      IMA_CLI_FORCE_SPA?: string;
      IMA_CLI_DEV_SERVER_PUBLIC?: string;
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
export interface ImaCliArgs {
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
  port?: number;
  hostname?: string;
  public?: string;
  environment: 'development' | 'production' | string;
}

/**
 * CLI arguments merged with current configuration arguments.
 */
export interface ImaConfigurationContext extends ImaCliArgs {
  name: 'server' | 'client' | 'client.es';
  isServer: boolean;
  isEsVersion?: boolean;
}

export type HandlerFn = (args: ImaCliArgs) => Promise<void>;

/**
 * Interface for ima/cli plugins that can be defined in plugins field in ima.conf.js. These can be used
 * to extend functionality of default CLI with custom cli arguments and webpack config overrides.
 */
export interface ImaCliPlugin {
  /**
   * Plugin name, used mainly for better debugging messages.
   */
  readonly name: string;

  /**
   * Optional additional CLI arguments to extend the set of existing ones.
   */
  readonly cliArgs?: Partial<Record<ImaCliCommand, CommandBuilder>>;

  /**
   * Optional plugin hook to do some pre processing right after the cli args are processed
   * and the imaConfig is loaded, before the webpack config creation and compiler run.
   */
  preProcess?(args: ImaCliArgs, imaConfig: ImaConfig): Promise<void>;

  /**
   * Webpack callback function used by plugins to customize/extend ima webpack config before it's run.
   */
  webpack(
    config: Configuration,
    ctx: ImaConfigurationContext,
    imaConfig: ImaConfig
  ): Promise<Configuration>;

  /**
   * Optional plugin hook to do some custom processing after the compilation has finished.
   * Receives isFirstRun=true for the first call if called inside the watch process.
   */
  postProcess?(
    args: ImaCliArgs,
    imaConfig: ImaConfig,
    isFirstRun?: boolean
  ): Promise<void>;
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
    ctx: ImaConfigurationContext,
    imaConfig: ImaConfig
  ) => Promise<Configuration>;

  /**
   * Function which receives babel-loader config and current context, which can be used for
   * additional customization or returning completely different babel config.
   */
  babel: (
    config: Record<string, unknown>,
    ctx: ImaConfigurationContext
  ) => Promise<Record<string, unknown>>;

  /**
   * Function which receives postcss-loader config and current context, this can be used
   * to customize existing default postcss config or completely replace it with a custom one.
   */
  postcss: (
    config: Record<string, unknown>,
    ctx: ImaConfigurationContext
  ) => Promise<Record<string, unknown>>;

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
   * HMR dev server settings.
   */
  devServer?: {
    port?: number; // [default=3101]
    hostname?: string; // [default=localhost]
    public?: string; // public url used to access static files [default=localhost:3101]
  };

  /**
   * Custom options passed to webpack watch api interface. For more information see:
   * https://webpack.js.org/configuration/watch/#watchoptions
   */
  watchOptions: WebpackOptionsNormalized['watchOptions'];

  /**
   * Set to true to generate source maps in production builds
   * (dev/watch build always generate source maps to work properly with error overlay).
   */
  useSourceMaps?: boolean;

  /**
   * Set true to enable CSS modules. When using CSS modules, we need to built CSS also
   * in the server webpack config to generate the definitions due to the SSR. When
   * we don't want to use CSS modules this can be omitted and improve the built performance.
   * This is why the CSS modules are opt-in rather than opt-out option.
   */
  enableCssModules?: boolean;

  /**
   * Set custom jsxRuntime for @babel/preset-react, the default is 'automatic'.
   */
  jsxRuntime?: 'classic' | 'automatic';

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
