import { Environment } from '@ima/core';
import { UserConfig as ViteConfig } from 'vite';
import { CommandBuilder } from 'yargs';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      IMA_CLI_ARGS?: string;
      IMA_CLI_WATCH?: string;
      IMA_CLI_FORCE_SPA?: string;
      IMA_CLI_FORCE_SPA_PREFETCH?: string;
      IMA_CLI_LAZY_SERVER?: string;
      IMA_CLI_OPEN?: string;
      IMA_CLI_OPEN_URL?: string;

      // Used to pass env publicPath settings to webpack
      IMA_PUBLIC_PATH?: string;
    }
  }
}

/**
 * Ima CLI commands.
 */
export type ImaCliCommand = 'build' | 'dev' | 'start' | 'prerender';

/**
 * Arguments generated from ima CLI commands.
 */
export interface ImaCliArgs {
  rootDir: string;
  command: ImaCliCommand;
  clean: boolean;
  clearCache?: boolean;
  verbose?: boolean;
  inspect?: boolean;
  ignoreWarnings?: boolean;
  open?: boolean;
  openUrl?: string;
  forceSPA?: boolean;
  forceSPAPrefetch?: boolean;
  profile?: boolean;
  port?: number;
  hostname?: string;
  paths?: string | string[];
  publicUrl?: string;
  environment: 'development' | 'production' | string;
  reactRefresh?: boolean;
  lazyServer?: boolean;
  server?: string;
  preRenderMode?: 'spa' | 'ssr';
}

export type ViteConfigWithEnvironments = ViteConfig & {
  environments: NonNullable<ViteConfig['environments']>;
};

/**
 * CLI arguments merged with concrete configuration context.
 */
export interface ImaConfigurationContext extends ImaCliArgs {
  outputFolders: {
    media: string;
    hot: string;
    css: string;
    public: string;
  };
  typescript: {
    enabled: boolean;
    tsconfigPath: string | undefined;
  };
  imaEnvironment: Environment;
  appDir: string;
  lessGlobalsPath: string;
  mode: ViteConfig['mode'];
  useSourceMaps: boolean;
  isDevEnv: boolean;
  targets: string[];
}

export type HandlerFn = (args: ImaCliArgs) => Promise<void>;

/**
 * Interface for ima/cli plugins that can be defined in plugins field in ima.conf.js. These can be used
 * to extend functionality of default CLI with custom cli arguments and vite config overrides.
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
   * and the imaConfig is loaded, before the vite config creation and compiler run.
   */
  preProcess?(args: ImaCliArgs, imaConfig: ImaConfig): Promise<void>;

  /**
   * Called right before creating vite configurations after preProcess call.
   * This hook lets you customize configuration contexts for each vite config
   * that will be generated. This is usefull when you need to overrite configuration
   * contexts for values that are not editable anywhere else (like output folders).
   */
  prepareConfigurations?(
    configurations: ImaConfigurationContext,
    imaConfig: ImaConfig,
    args: ImaCliArgs
  ): Promise<ImaConfigurationContext>;

  /**
   * Vite callback function used by plugins to customize/extend ima vite config before it's run.
   */
  vite?(
    config: ViteConfigWithEnvironments,
    ctx: ImaConfigurationContext,
    imaConfig: ImaConfig
  ): Promise<ViteConfigWithEnvironments>;

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
   * Vite callback function can be used to completely customize default vite config before it's run.
   */
  vite?: (
    config: ViteConfigWithEnvironments,
    ctx: ImaConfigurationContext,
    imaConfig: ImaConfig
  ) => Promise<ViteConfigWithEnvironments>;

  /**
   * Function which receives default app swc-loader config and current context,
   * this can be used for additional customization or returning completely different config.
   */
  // @TODO: Not sure if this will be still needed with Vite?
  swc: (
    config: Record<string, unknown>,
    ctx: ImaConfigurationContext
  ) => Promise<Record<string, unknown>>;

  /**
   * Function which receives default vendor swc-loader config and current context,
   * this can be used for additional customization of vendor processed files.
   */
  // @TODO: Not sure if this will be still needed with Vite?
  swcVendor: (
    config: Record<string, unknown>,
    ctx: ImaConfigurationContext
  ) => Promise<Record<string, unknown>>;

  /**
   * Function which receives postcss-loader config and current context, this can be used
   * to customize existing default postcss config or completely replace it with a custom one.
   */
  // @TODO: Not sure if this will be still needed with Vite?
  postcss: (
    config: Record<string, unknown>,
    ctx: ImaConfigurationContext
  ) => Promise<Record<string, unknown>>;

  /**
   * Called right before creating vite configurations after preProcess call.
   * This hook lets you customize configuration contexts for each vite config
   * that will be generated. This is usefull when you need to overrite configuration
   * contexts for values that are not editable anywhere else (like output folders).
   */
  prepareConfigurations?(
    configurations: ImaConfigurationContext,
    imaConfig: ImaConfig,
    args: ImaCliArgs
  ): Promise<ImaConfigurationContext>;

  /**
   * Browserslist configuration string for postcss-preset-env.
   */
  cssBrowsersTarget: string;

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

    /**
     * Optional custom ima app origin (defaults to http\://localhost:[environment.$Server.port])
     * this is used for CORS configuration.
     */
    origin?: string;
  };

  /**
   * Custom options passed to webpack watch api interface. For more information see:
   * https://webpack.js.org/configuration/watch/#watchoptions
   */
  // @TODO: Is there Vite alternative?
  // watchOptions: Watching['watchOptions'];

  /**
   * Passed to vite `build.sourcemap` option (https://vite.dev/config/build-options#build-sourcemap).
   */
  sourcemap?: boolean | 'inline' | 'hidden';

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
  // webpackAliases?: ResolveOptions['alias'];

  /**
   * Supported languages with glob paths of the files with translations
   */
  languages: Record<string, string[]>;

  /**
   * Disables build of 'client' legacy bundle.
   */
  disableLegacyBuild?: boolean;

  /**
   * Advanced functionality allowing you to include/exclude custom vendor paths that go through
   * swc loader (configured using swcVendor function). Use this if you're using dependencies
   * that don't meet the lowest supported ES version target (ES9 by default). all packages in
   * @ima namespace are included by default.
   */
  transformVendorPaths?: {
    include?: RegExp[];
    exclude?: RegExp[];
  };

  /**
   * Experimental configurations which can be enabled individually on specific applications.
   * Some of these may find a way to default configuration in future versions of IMA.js.
   */
  experiments?: {
    css?: boolean; // Enables webpack native CSS support
  };
};
