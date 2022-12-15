import fs from 'fs';
import path from 'path';

import { ImaPluginConfig } from '../types';

/**
 * Clean output directories
 */
export async function cleanOutput(
  config: ImaPluginConfig,
  cwd = process.cwd()
): Promise<void[]> {
  return processOutput(
    config,
    async outputPath => {
      if (fs.existsSync(outputPath)) {
        await fs.promises.rm(outputPath, { recursive: true });
      }
    },
    cwd
  );
}

/**
 * Run processor over each defined output directory
 */
export async function processOutput(
  config: ImaPluginConfig,
  outputProcessor: (outputPath: string) => Promise<void>,
  cwd = process.cwd()
): Promise<void[]> {
  return Promise.all(
    config.output
      .map(output => path.resolve(cwd, output.dir))
      .map(async outputDir => await outputProcessor(outputDir))
  );
}
