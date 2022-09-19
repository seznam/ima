export type Transformer = ({
  source,
  context,
}: {
  source: Source;
  context: PipeContext;
}) => Source | Promise<Source>;
export type TransformerOptions = { test: RegExp };

export type Command = 'dev' | 'link' | 'build';

export interface BuildConfig {
  input: string;
  output: string;
  transforms?: Array<Transformer | [Transformer, TransformerOptions]>;
  exclude?: string[];
  skipTransform?: RegExp[];
  plugins?: Plugin[];
}

export type Plugin = (context: Context) => void | Promise<void>;

export interface Context {
  command: Command;
  cwd: string;
  config: BuildConfig;
  inputDir: string;
  outputDir: string;
}

export interface PipeContext {
  command: Command;
  cwd: string;
  fileName: string;
  filePath: string;
  contextDir: string;
  config: BuildConfig;
  inputDir: string;
  outputDir: string;
}

export interface Source {
  fileName: string;
  code: string;
  map?: string;
}
