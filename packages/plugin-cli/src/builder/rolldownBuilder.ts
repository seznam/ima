import fs from 'fs';
import path from 'path';

import { logger } from '@ima/dev-utils/logger';
import {
  build,
  watch,
  BuildOptions,
  Plugin as RolldownPlugin,
  TransformOptions,
} from 'rolldown';

import { ImaPluginConfig } from '../types.js';

/**
 * Files with these extensions are transpiled by Rolldown.
 * Everything else is copied as-is into the output directory.
 */
const JS_ENTRY_RE = /\.(js|jsx|ts|tsx)$/i;

/**
 * Styles are marked as external so Rolldown never tries to process them
 * even when they are imported inside JS/TS files.
 */
const STYLES_RE = /\.(less|css)$/i;

/**
 * Rolldown plugin that:
 *  - marks .less/.css imports as external so Rolldown skips them
 *  - copies every non-JS/TS file (templates, styles, json, etc.) into
 *    outDir after the bundle is written, preserving the directory structure
 */
function copyAssetsPlugin(inputDir: string, outDir: string): RolldownPlugin {
  return {
    name: 'ima-plugin-copy-assets',
    resolveId(id) {
      if (STYLES_RE.test(id)) {
        return { id, external: true };
      }

      return null;
    },
    async closeBundle() {
      await copyNonJsFiles(inputDir, outDir);
    },
  };
}

/**
 * Recursively copy every file that is NOT a JS/TS source file from srcDir
 * into destDir, preserving the relative directory structure.
 */
async function copyNonJsFiles(srcDir: string, destDir: string): Promise<void> {
  const entries = await fs.promises.readdir(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      await copyNonJsFiles(srcPath, destPath);
    } else if (!JS_ENTRY_RE.test(entry.name)) {
      await fs.promises.mkdir(path.dirname(destPath), { recursive: true });
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
}

/**
 * Recursively collect all JS/TS source files to use as Rolldown entry points.
 */
async function collectEntries(dir: string): Promise<string[]> {
  const results: string[] = [];
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      results.push(...(await collectEntries(fullPath)));
    } else if (JS_ENTRY_RE.test(entry.name)) {
      results.push(fullPath);
    }
  }

  return results;
}

/**
 * Shared Rolldown config for both one-shot and watch builds.
 */
function buildRolldownConfig(
  config: ImaPluginConfig,
  cwd: string,
  inputDir: string,
  outDir: string,
  entries: string[]
): BuildOptions {
  // Map our jsxRuntime option to Rolldown's transform.jsx value.
  // 'automatic' → 'react-jsx' (React 17+ automatic runtime, no need to import React)
  // 'classic'   → 'react'     (React.createElement, requires React in scope)
  const jsx: TransformOptions['jsx'] =
    (config.jsxRuntime ?? 'automatic') === 'automatic' ? 'react-jsx' : 'react';

  return {
    cwd,
    input: entries,
    external: (id: string) =>
      !id.startsWith('.') && !path.isAbsolute(id) && !id.startsWith('\0'),
    plugins: [
      copyAssetsPlugin(inputDir, outDir),
      ...(config.rolldownPlugins ?? []),
    ],
    transform: {
      jsx,
      target: config.target ?? 'es2024',
    },
    output: {
      dir: outDir,
      format: 'es',
      preserveModules: true,
      preserveModulesRoot: inputDir,
      entryFileNames: '[name].js',
      chunkFileNames: '[name].js',
      sourcemap: false,
    },
    logLevel: 'warn',
  };
}

/**
 * One-shot build using Rolldown with preserveModules (1:1 src→dist file structure).
 */
export async function rolldownBuild(
  config: ImaPluginConfig,
  cwd: string
): Promise<void> {
  const inputDir = path.resolve(cwd, config.inputDir);
  const outDir = path.resolve(cwd, config.outDir);
  const entries = await collectEntries(inputDir);

  if (entries.length === 0) {
    logger.warn(`No JS/TS source files found in ${inputDir}, skipping build.`);
    return;
  }

  await build(buildRolldownConfig(config, cwd, inputDir, outDir, entries));
}

/**
 * Watch-mode build — returns a handle so callers can close the watcher.
 */
export async function rolldownBuildWatch(
  config: ImaPluginConfig,
  cwd: string
): Promise<{ close(): Promise<void> }> {
  const inputDir = path.resolve(cwd, config.inputDir);
  const outDir = path.resolve(cwd, config.outDir);
  const entries = await collectEntries(inputDir);

  const watcher = watch(
    buildRolldownConfig(config, cwd, inputDir, outDir, entries)
  );

  return new Promise((resolve, reject) => {
    watcher.on('event', event => {
      if (event.code === 'BUNDLE_END') {
        // Free Rolldown's internal resources for this build cycle.
        event.result.close();
        // Resolve once the first successful build completes, giving the
        // caller a handle to close the watcher later.
        resolve({
          close: () => watcher.close(),
        });
      } else if (event.code === 'ERROR') {
        reject(event.error);
      }
    });
  });
}
