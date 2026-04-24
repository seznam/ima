import fs from 'fs';
import path from 'path';

import { logger, printTime } from '@ima/dev-utils/logger';
import chalk from 'chalk';

import { ImaPluginConfig } from '../types.js';

export type BatchedCallback = () => Promise<void> | void;
export type BatchEventName =
  | 'add'
  | 'addDir'
  | 'change'
  | 'unlink'
  | 'unlinkDir';

/**
 * Clean the output directory.
 */
export async function cleanOutput(
  config: ImaPluginConfig,
  cwd = process.cwd()
): Promise<void> {
  const outDir = path.resolve(cwd, config.outDir);

  if (fs.existsSync(outDir)) {
    await fs.promises.rm(outDir, { recursive: true });
  }
}

export function createBatcher(title: string, timeout = 150) {
  let batchedQueue: [BatchedCallback, BatchEventName][] = [];
  let timeoutId: NodeJS.Timeout | null = null;

  return (fn: BatchedCallback, eventName: BatchEventName) => {
    batchedQueue.push([fn, eventName]);

    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    timeoutId = setTimeout(async () => {
      const stats: Record<'added' | 'deleted', number> = {
        added: 0,
        deleted: 0,
      };

      const currentQueue = [...batchedQueue];
      batchedQueue = [];

      await Promise.all(
        currentQueue.map(([fn, event]) => {
          if (['add', 'change'].includes(event)) {
            stats.added++;
          } else if (['unlink'].includes(event)) {
            stats.deleted++;
          }

          return fn();
        })
      );

      logger.write(
        `${printTime()} ${title} ${chalk.green.bold(
          `✓ ${stats['added']} added`
        )} ${chalk.black('|')} ${chalk.red.bold(`⛌ ${stats['deleted']} deleted`)}`
      );
    }, timeout);
  };
}
