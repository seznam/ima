import { ChokidarOptions } from 'chokidar';
import { RolldownPlugin } from 'rolldown';

export type Command = 'dev' | 'link' | 'build';

export interface ImaPluginConfig {
  /**
   * Path to the input source directory, relative to cwd.
   * @default './src'
   */
  inputDir: string;

  /**
   * Path to the output directory, relative to cwd.
   * @default './dist'
   */
  outDir: string;

  /**
   * esbuild-compatible build target.
   * @default 'es2024'
   */
  target?: string;

  /**
   * JSX runtime to use.
   * @default 'automatic'
   */
  jsxRuntime?: 'classic' | 'automatic';

  /**
   * Glob patterns / paths to exclude from the build.
   */
  exclude?: ChokidarOptions['ignored'];

  /**
   * ima-plugin lifecycle plugins (e.g. typescriptDeclarationsPlugin).
   */
  plugins?: Plugin[];

  /**
   * Raw Rolldown plugins to inject into the build config.
   * Use this as an escape hatch for custom transforms.
   */
  rolldownPlugins?: RolldownPlugin[];

  /**
   * Used to define additional paths to files or directories that are copied
   * while using the link command to the destination directory.
   * (Globs are not supported — use paths to directories.)
   */
  additionalWatchPaths?: string[];
}

export type Plugin = (context: Context) => void | Promise<void>;

export interface Context {
  command: Command;
  cwd: string;
  config: ImaPluginConfig;
  inputDir: string;
}

export interface Args {
  command: 'build' | 'link' | 'dev';
  silent: boolean;
  jsxRuntime: 'classic' | 'automatic';
  path?: string;

  /**
   * Used to define additional paths to files or directories, that are copied
   * while using link command to the destination directory.
   * This is useful if we want to watch additional files, which
   * are not in the inputDir. (Globs are not supported, just use
   * paths to directories, all their contents will be watched)
   */
  additionalWatchPaths?: string[];
}
