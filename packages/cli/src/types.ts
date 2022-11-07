import { Configuration, ResolveOptions, Watching } from 'webpack';
import { CommandBuilder } from 'yargs';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      IMA_CLI_WATCH?: string;
      IMA_CLI_FORCE_SPA?: string;
      IMA_CLI_DEV_SERVER_PUBLIC_URL?: string;
    }
  }
}

/**
 * Ima CLI commands.
 */
export type ImaCliCommand = 'build' | 'dev';

/**
 * Arguments generated from ima CLI commands.
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
  profile?: boolean;
  port?: number;
  hostname?: string;
  publicUrl?: string;
  environment: 'development' | 'production' | string;
}

/**
 * CLI arguments merged with concrete configuration context.
 */
export interface ImaConfigurationContext extends ImaCliArgs {
  name: 'server' | 'client' | 'client.es';
  isServer: boolean;
  processCss: boolean; // Flag indicating that this context should process CSS assets
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
  webpack?(
    config: Configuration,
    ctx: ImaConfigurationContext,
    imaConfig: ImaConfig
  ): Promise<Configuration>;

  /**
   * Optional plugin hook to do some custom processing after the compilation has finished.
   * Attention! This hook runs only for build command.
   */
  postProcess?(args: ImaCliArgs, imaConfig: ImaConfig): Promise<void>;
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
   * Function which receives default app swc-loader config and current context,
   * this can be used for additional customization or returning completely different config.
   */
  swc: (
    config: Record<string, unknown>,
    ctx: ImaConfigurationContext
  ) => Promise<Record<string, unknown>>;

  /**
   * Function which receives default vendor swc-loader config and current context,
   * this can be used for additional customization of vendor processed files.
   */
  swcVendor: (
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
    publicUrl?: string; // public url used to access static files [default=localhost:3101]
  };

  /**
   * Custom options passed to webpack watch api interface. For more information see:
   * https://webpack.js.org/configuration/watch/#watchoptions
   */
  watchOptions: Watching['watchOptions'];

  /**
   * Set to true (or any preset from https://webpack.js.org/configuration/devtool/#devtool)
   * to enable source maps for production build. (dev/watch tasks always generate
   * source maps to work properly with error overlay).
   */
  sourceMaps?:
    | boolean
    | 'eval'
    | 'eval-cheap-source-map'
    | 'eval-cheap-module-source-map'
    | 'eval-source-map'
    | 'cheap-source-map'
    | 'cheap-module-source-map'
    | 'source-map'
    | 'inline-cheap-source-map'
    | 'inline-cheap-module-source-map'
    | 'inline-source-map'
    | 'eval-nosources-cheap-source-map'
    | 'eval-nosources-cheap-module-source-map'
    | 'eval-nosources-source-map'
    | 'inline-nosources-cheap-source-map'
    | 'inline-nosources-cheap-module-source-map'
    | 'inline-nosources-source-map'
    | 'nosources-cheap-source-map'
    | 'nosources-cheap-module-source-map'
    | 'nosources-source-map'
    | 'hidden-nosources-cheap-source-map'
    | 'hidden-nosources-cheap-module-source-map'
    | 'hidden-nosources-source-map'
    | 'hidden-cheap-source-map'
    | 'hidden-cheap-module-source-map'
    | 'hidden-source-map';

  /**
   * Set custom jsxRuntime, the default is 'automatic'.
   */
  jsxRuntime?: 'classic' | 'automatic';

  /**
   * Enable brotli and gzip compression for production assets [default=true].
   */
  compress: boolean;

  /**
   * Threshold to inline image resources as base64 automatically [default=8192]
   */
  imageInlineSizeLimit: number;

  /**
   * Optional custom webpack aliases
   */
  webpackAliases?: ResolveOptions['alias'];

  /**
   * Supported languages with glob paths of the files with translations
   */
  languages: Record<string, string[]>;

  /**
   * Disables build of 'client' legacy bundle.
   */
  disableLegacyBuild?: boolean;

  /**
   * Advanced functionality allowing you to register custom vendor paths that go through
   * swc loader (configured using swcVendor function). Use this if you're using dependencies
   * that don't meet the lowest supported ES version target (ES9 by default). It is enabled
   * by default for all packages in @ima namespace.
   */
  transformVendorPaths?: RegExp[];

  /**
   * Experimental configurations which can be enabled individually on specific applications.
   * Some of these may find a way to default configuration in future versions of IMA.js.
   */
  experiments?: {
    css?: boolean; // Enables webpack native CSS support
  };
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
   * App script and style sources
   */
  $Source: unknown;

  /**
   * Array of defined languages
   */
  $Language: string[];
}
