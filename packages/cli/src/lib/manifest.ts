// @TODO: Maybe we should transform this into a Vite plugin
import { build } from 'vite';
import fs from 'fs/promises';
import path from 'path';
import { ImaConfig, ViteConfigWithEnvironments } from '../types';

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

function getDevLanguageAssets(
  prefix: string,
  config: ViteConfigWithEnvironments,
  /**
   * In dev mode Vite serves virtual modules at `/@id/<moduleId>`.
   * Client-side `<script>` tags need this URL form, while server-side
   * `ssrLoadModule()` calls accept the bare virtual module ID directly,
   * so the `/@id/` prefix should only be applied for client assets.
   */
  useViteIdPrefix = false
): Manifest['assets'] {
  return Object.entries(config.build?.rolldownOptions?.input ?? {})
    .map(([inputKey, inputValue]) => {
      if (!inputKey.startsWith('locale/')) {
        return null;
      }

      const name = `${prefix}/${inputKey}.js`;
      const fileName = useViteIdPrefix ? `@id/${inputValue}` : inputValue;

      return [name, { fileName, name }] as const;
    })
    .filter(
      (entry): entry is readonly [string, { readonly fileName: string; readonly name: string }] =>
        entry !== null
    )
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, { fileName: string, name: string }>);
}

export async function createManifestForDev(imaConfig: ImaConfig, config: ViteConfigWithEnvironments) {
    const serverAssets = {
        'server/app.server.js': {
            fileName: 'app/main.js',
            name: 'server/app.server.js',
        },
        ...getDevLanguageAssets('server', config),
    };
    const clientAssets = {
        'static/js/app.client.js': {
            fileName: 'app/main.js',
            name: 'static/js/app.client.js',
        },
        ...getDevLanguageAssets('static/js', config, true),
    };
    const clientEsAssets = {
        'static/js.es/app.client.js': {
            fileName: 'app/main.js',
            name: 'static/js.es/app.client.js',
        },
        ...getDevLanguageAssets('static/js.es', config, true),
    };
    const manifest: Manifest = {
        assets: {
          ...serverAssets,
          ...clientAssets,
          ...clientEsAssets,
        },
        assetsByCompiler: {
          server: serverAssets,
          client: clientAssets,
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

export async function createManifestFileFromOutput(results: { config: string, output: Awaited<ReturnType<typeof build>> }[], imaConfig: ImaConfig) {
    const manifest: Manifest = {
        assets: {},
        assetsByCompiler: {},
        publicPath: imaConfig.publicPath,
    };

    for (const result of results) {
        extendManifestFromOutput(manifest, result.config, result.output, imaConfig);
    }

    await fs.writeFile(
        path.join(process.cwd(), 'build', 'manifest.json'),
        JSON.stringify(manifest, null, 2),
        'utf-8'
    );
}

function extendManifestFromOutput(manifest: Manifest, config: string, output: Awaited<ReturnType<typeof build>>, imaConfig: ImaConfig): Manifest {
    // Handle array of outputs
    if (Array.isArray(output)) {
        for (const singleOutput of output) {
            extendManifestFromOutput(manifest, config, singleOutput, imaConfig);
        }
        return manifest;
    }

    // Handle RolldownWatcher
    // @TODO: Remove this with vite v8
    if (!('output' in output)) {
        return manifest;
    }

    const isServer = config === 'server';// config.build?.ssr === true;
    const compilerName = isServer ? 'server' : config === 'legacy' ? 'client' : 'client.es';

    if (!manifest.assetsByCompiler[compilerName]) {
        manifest.assetsByCompiler[compilerName] = {};
    }

    for (const chunk of output.output) {
        // Skip compressed assets and source maps
        if (chunk.fileName.endsWith('.gz') || chunk.fileName.endsWith('.br') || chunk.fileName.endsWith('.map')) {
            continue;
        }
        // assetKey is chunk.fileName without the hash before extension. Hash is always 16 characters long. If there is 16 characters inbetween last 2 dots, remove them.
        const assetKey = chunk.fileName.replace(/\.([a-zA-Z0-9_-]{16})(\.[^.]+)$/, '$2');

        if (chunk.fileName === assetKey) {
            // No hash found, use full fileName
            continue;
        }

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
