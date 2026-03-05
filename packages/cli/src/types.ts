import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';
import { Environment } from '@ima/core';
import { UserConfig as ViteConfig, ViteBuilder, AliasOptions, WatchOptions, CSSOptions } from 'vite';
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

      // Used to pass env publicPath settings to vite
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
   * Called right before creating the vite configuration after preProcess call.
   * This hook lets you customize the configuration context before the vite config
   * is generated. This is useful when you need to override configuration
   * context values that are not editable anywhere else (like output folders).
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
   * Function which receives the default PostCSS config and current context. Can be used
   * to customize the existing default PostCSS plugins or completely replace them with a custom config.
   */
  postcss: (
    config: CSSOptions['postcss'],
    ctx: ImaConfigurationContext
  ) => Promise<CSSOptions['postcss']>;

  /**
   * Called right before creating the vite configuration after preProcess call.
   * This hook lets you customize the configuration context before the vite config
   * is generated. This is useful when you need to override configuration
   * context values that are not editable anywhere else (like output folders).
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
   * vite config and cli with additional features.
   */
  plugins?: ImaCliPlugin[];

  /**
   * Vite assets public path [default='']
   */
  publicPath: string;

  /**
   * HMR dev server settings.
   */
  // @TODO: Should we keep dev server configurable like this?
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
   * File system watcher options passed to chokidar (used by Vite's dev server for HMR).
   * For more information see: https://vite.dev/config/server-options#server-watch
   * For build watch mode see: https://vite.dev/config/build-options#build-watch (uses Rollup WatcherOptions)
   */
  // @TODO: Should we remove this? Users can change watch options via the `vite` configuration already
  watchOptions?: WatchOptions;

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
   * Chunk size warning limit in kbs for Rollup.
   * This is not a hard limit, just a warning that is printed when the chunk size exceeds the defined value.
   * [default=1000]
   */
  chunkSizeWarningLimit: number;

  /**
   * Optional custom Vite aliases
   */
  viteAliases?: AliasOptions;

  /**
   * Supported languages with glob paths of the files with translations
   */
  languages: Record<string, string[]>;

  /**
   * Disables build of 'client' legacy bundle.
   */
  disableLegacyBuild?: boolean;

  /**
   * Experimental configurations which can be enabled individually on specific applications.
   * Some of these may find a way to default configuration in future versions of IMA.js.
   */
  experiments?: {};
};

export type UseServerProcessor = (ast: ParseResult<File>) => ParseResult<File>;

export type ViteBuildOutput = Awaited<ReturnType<ViteBuilder['build']>>;

export type ImaBuildOutput = {
  env: string;
  output: ViteBuildOutput;
  time: number;
};
