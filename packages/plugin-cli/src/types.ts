import { JscTarget, ModuleConfig, ReactConfig } from '@swc/core';
import { WatchOptions } from 'chokidar';

export type Transformer = ({
  source,
  context,
}: {
  source: Source;
  context: PipeContext;
}) => Source | Promise<Source>;
export type TransformerOptions = { test: RegExp };
export type TransformerDefinition =
  | Transformer
  | [Transformer, TransformerOptions];

export type Command = 'dev' | 'link' | 'build';

export interface ImaPluginOutputConfig {
  /**
   * Path to output directory, relative to the cwd.
   */
  dir: string;

  /**
   * Define output module format.
   */
  format: ModuleConfig['type'];

  /**
   * When defined, the plugin uses preprocess transform to exclude parts of code
   * which are wrapped inside pragma server/client comments. This enables you
   * to generate specific source code for client and server
   */
  bundle?: 'client' | 'server';

  /**
   * Optional regexp to test files, which should be coopied/transformed
   * to the output dir. This is for example used in configurations
   * to only copy less and json files in one output directory and process
   * only JS files in others. By default the CLI processes/copies all
   * files inside the inputDir (except the ones excluded using global
   * exclude option).
   */
  include?: RegExp | ((filePath: string) => boolean);

  /**
   * Optional regexp to test files, which should not be coopied/transformed
   * to the output dir. This is for example used in configurations
   * to ignore less or json files in one output directory and process
   * only JS files in others. By default the CLI processes/copies all
   * files inside the inputDir (except the ones excluded using global
   * exclude option).
   */
  exclude?: RegExp | ((filePath: string) => boolean);
}

export interface ImaPluginConfig {
  inputDir: string;
  output: ImaPluginOutputConfig[];
  target: JscTarget;
  exclude?: WatchOptions['ignored'];
  plugins?: Plugin[];
  jsxRuntime?: ReactConfig['runtime'];
  transformers?: TransformerDefinition[] | '...';
  sourceMaps?: boolean;
  additionalWatchPaths?: string[];
}

export type Plugin = (context: Context) => void | Promise<void>;

export interface Context {
  command: Command;
  cwd: string;
  config: ImaPluginConfig;
  inputDir: string;
}

export interface PipeContext {
  command: Command;
  cwd: string;
  fileName: string;
  filePath: string;
  contextDir: string;
  config: ImaPluginConfig;
  inputDir: string;
  outputDir: string;
}

export interface Source {
  fileName: string;
  code: string;
  map?: string;
}

export interface Args {
  command: 'build' | 'link' | 'dev';
  silent: boolean;
  jsxRuntime: ReactConfig['runtime'];
  clientServerConfig: boolean;
  nodeConfig: boolean;
  path?: string;

  /**
   * Used to define additional anypath paths, that are copied
   * while using link command to the destination directory.
   * This is useful if we want to watch additional files, which
   * are not in the inputDir.
   */
  additionalWatchPaths?: string[];
}
