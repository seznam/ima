import { ModuleConfig } from '@swc/core';

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
  dir: string;
  format: ModuleConfig['type'];
  bundle?: 'client' | 'server';
}

export interface ImaPluginConfig {
  inputDir: string;
  output: ImaPluginOutputConfig[];
  exclude?: string[];
  plugins?: Plugin[];
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
  clientServerConfig: boolean;
  nodeConfig: boolean;
  path?: string;
}
