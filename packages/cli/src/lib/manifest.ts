import fs from 'fs/promises';
import path from 'path';
import { ImaConfig, ImaBuildOutput, ViteBuildOutput, ViteConfigWithEnvironments } from '../types';

interface Manifest {
    assets: {
        [key: string]: {
            fileName: string;
            name?: string;
        };
    };
    assetsByCompiler: {
        [compilerName: string]: {
            [key: string]: {
                fileName: string;
                name?: string;
            };
        };
    };
    publicPath: string;
}

const POLYFILL_ENTRY_KEY = 'polyfill';

/**
 * @param prefix - The asset path prefix.
 * @param config - The Vite configuration object.
 * @param useViteIdPrefix - In dev mode Vite serves virtual modules at `/@id/<moduleId>`.
 *   Client-side `<script>` tags need this URL form, while server-side
 *   `ssrLoadModule()` calls accept the bare virtual module ID directly,
 *   so the `/@id/` prefix should only be applied for client assets.
 */
function getDevLanguageAssets(
  prefix: string,
  config: ViteConfigWithEnvironments,
  useViteIdPrefix = false
): Manifest['assets'] {
  return Object.fromEntries(
    Object.entries(config.build?.rolldownOptions?.input ?? {})
      .flatMap(([inputKey, inputValue]) => {
        if (!inputKey.startsWith('locale/')) {
          return [];
        }

        const name = `${prefix}/${inputKey}.js`;
        const fileName = useViteIdPrefix ? `@id/${inputValue}` : inputValue;

        return [[name, { fileName, name }]];
      })
  );
}

/**
 * Checks if the Vite config has a polyfill entry and returns it as an asset if it exists
 */
function getPolyfillAssets(outputDir: string, config: ViteConfigWithEnvironments): Manifest['assets'] {
  const polyfillAssets: Manifest['assets'] = {};
  const input = config.environments?.client?.build?.rolldownOptions?.input;

  if (input && typeof input === 'object' && POLYFILL_ENTRY_KEY in input) {
    const assetFilePath = path.join(outputDir, path.basename(input[POLYFILL_ENTRY_KEY]))
    polyfillAssets[assetFilePath] = { fileName: input[POLYFILL_ENTRY_KEY], name: assetFilePath };
  }

  return polyfillAssets;
}

/**
 * Creates a manifest.json file in the build output directory based on the Vite config
 */
export async function createManifestFileForDev(imaConfig: ImaConfig, config: ViteConfigWithEnvironments) {
    const serverAssets = {
        'server/app.server.js': {
            fileName: 'app/main.js',
            name: 'server/app.server.js',
        },
        ...getDevLanguageAssets('server', config),
    };
    const clientEsAssets = {
        'static/js.es/app.client.js': {
            fileName: 'app/main.js',
            name: 'static/js.es/app.client.js',
        },
        ...getDevLanguageAssets('static/js.es', config, true),
        ...getPolyfillAssets('static/js.es', config),
    };
    const manifest: Manifest = {
        assets: {
          ...serverAssets,
          ...clientEsAssets,
        },
        assetsByCompiler: {
          server: serverAssets,
          'client.es': clientEsAssets,
        },
        publicPath: imaConfig.publicPath,
    };

    await fs.mkdir(path.join(process.cwd(), 'build'), { recursive: true });

    await fs.writeFile(
        path.join(process.cwd(), 'build', 'manifest.json'),
        JSON.stringify(manifest, null, 2),
        'utf-8'
    );
}

/**
 * Creates a manifest.json file in the build output directory based on the Vite build output
 * and the Vite config. This is used in production builds to map the original asset names to the hashed file names.
 */
export async function createManifestFileFromOutput(results: ImaBuildOutput[], imaConfig: ImaConfig) {
    const manifest: Manifest = {
        assets: {},
        assetsByCompiler: {},
        publicPath: imaConfig.publicPath,
    };

    for (const result of results) {
        extendManifestFromOutput(manifest, result.env, result.output, imaConfig);
    }

    await fs.writeFile(
        path.join(process.cwd(), 'build', 'manifest.json'),
        JSON.stringify(manifest, null, 2),
        'utf-8'
    );
}

/**
 * Extends the manifest with the assets from the Vite build output.
 */
function extendManifestFromOutput(manifest: Manifest, env: string, output: ViteBuildOutput, imaConfig: ImaConfig): Manifest {
    // Handle array of outputs
    if (Array.isArray(output)) {
        for (const singleOutput of output) {
            extendManifestFromOutput(manifest, env, singleOutput, imaConfig);
        }
        return manifest;
    }

    // Handle RolldownWatcher
    // @TODO: Remove this with vite v8
    if (!('output' in output)) {
        return manifest;
    }

    const isServer = env === 'server';
    const compilerName = isServer ? 'server' : env === 'legacy' ? 'client' : 'client.es';

    if (!manifest.assetsByCompiler[compilerName]) {
        manifest.assetsByCompiler[compilerName] = {};
    }

    for (const chunk of output.output) {
        // Process only JS and CSS files, skip other assets like source maps or compressed versions
        if (!chunk.fileName.endsWith('.js') && !chunk.fileName.endsWith('.mjs') && !chunk.fileName.endsWith('.css')) {
            continue;
        }

        const isAsset = chunk.type === 'asset';
        const assetKey = isAsset ?
                path.join(path.dirname(chunk.fileName), chunk.names[0])
            :
                chunk.preliminaryFileName.replace(/\.!~\{[0-9]{11}\}~\.mjs$/, '.js');

        manifest.assets[assetKey] = {
            fileName: chunk.fileName,
            name: assetKey,
        };
        manifest.assetsByCompiler[compilerName][assetKey] = {
            fileName: chunk.fileName,
            name: assetKey,
        };
    }

    return manifest;
}
