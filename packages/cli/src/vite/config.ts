import fs from 'fs';
import path from 'path';

import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression2';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import babel from '@rollup/plugin-babel';

import lessPluginGlob from 'less-plugin-glob';

import {
  imaLanguagesPlugin,
  getVirtualLanguageEntryPoints,
} from './plugins/imaLanguagesPlugin';

import { BuildEnvironmentOptions } from 'vite';
import { ImaConfigurationContext, ImaConfig, ViteConfigWithEnvironments } from '../types';
import { imaSkipCssPlugin } from './plugins/imaSkipCssPlugin';
import { imaHmrPlugin } from './plugins/imaHmrPlugin';
import { imaUseServerPlugin } from './plugins/imaUseServerPlugin';
import { createPolyfillEntry, getCurrentCoreJsVersion } from './utils/utils';

/**
 * Creates Vite configuration object based on input ConfigurationContext
 * and ImaConfig objects.
 *
 * @returns {Promise<ViteConfigWithEnvironments>} Vite configuration object.
 */
export default async (
  ctx: ImaConfigurationContext,
  imaConfig: ImaConfig
): Promise<ViteConfigWithEnvironments> => {
  const {
    rootDir,
    outputFolders,
    appDir,
    mode,
    lessGlobalsPath,
    useSourceMaps,
    isDevEnv,
    targets,
  } = ctx;
  const coreJsVersion = await getCurrentCoreJsVersion();

  function getRolldownOutputConfig(outputJsFolder: string, appType: 'server' | 'client'): NonNullable<BuildEnvironmentOptions['rolldownOptions']>['output'] {
    const appSuffix = appType === 'server' ? 'server' : isDevEnv ? 'client' : 'bundle';

    return {
      entryFileNames: (chunkInfo) => {
        if (chunkInfo.name === 'app') {
          return `${outputJsFolder}/app.${appSuffix}.[hash:16].mjs`;
        }

        return `${outputJsFolder}/[name].[hash:16].mjs`;
      },

      // Vendor location
      chunkFileNames: `${outputJsFolder}/[name].[hash:16].mjs`,
    }
  }

  return {
      root: rootDir,
      base: imaConfig.publicPath,
      mode: mode,
      cacheDir: 'node_modules/.cache/vite',
      publicDir: false,
      clearScreen: false,
      plugins: [
        // @TODO: @ima/core is not using React, should we make it possible to extend configuration from other plugins like @ima/react-page-renderer?
        react({}),
        (
          // applyToEnvironment does not work here, so we need to use an alternative approach
          // compression plugin customizes the applyToEnvironment method internally
          ctx.command === 'build' && imaConfig.compress ? compression({
            exclude: /^server\/(?!runner\.js$)/
          }) : null
        ),
        // We cannot use default publicDir/build.copyPublicDir, because of our specific output structure
        viteStaticCopy({
          targets: [
            {
              src: path.resolve(rootDir, 'app/public/*'),
              dest: 'static/public/'
            }
          ],
          // Copy only for one client build, since both share the same public dir
          environment: ctx.command === 'build' ? 'modern' : 'client',
        }),
        imaLanguagesPlugin(imaConfig, rootDir),
        imaSkipCssPlugin({ environments: ['legacy', 'server'] }),
        imaUseServerPlugin(ctx),
        imaHmrPlugin(),
      ],

      resolve: {
        alias: [
          { find: 'app', replacement: appDir },
          ...(ctx.profile ? [
            { find: /^react-dom$/, replacement: 'react-dom/profiling' },
            { find: 'scheduler/tracing', replacement: 'scheduler/tracing-profiling' },
          ] : []),
          ...(Array.isArray(imaConfig.viteAliases)
            ? imaConfig.viteAliases
            : Object.entries(imaConfig.viteAliases || {}).map(([find, replacement]) => ({ find, replacement }))
          ),
        ],
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
      },

      build: {
        outDir: 'build',
        emptyOutDir: false, // We do our own cleanup
        sourcemap: useSourceMaps,
        assetsInlineLimit: imaConfig.imageInlineSizeLimit,
        chunkSizeWarningLimit: imaConfig.chunkSizeWarningLimit,
        rolldownOptions: {
          input: {
            app: 'app/main.js',
            ...getVirtualLanguageEntryPoints(imaConfig.languages),
          },
          output: {
            manualChunks: (id) => {
              if (isDevEnv && id.includes('node_modules')) {
                return 'vendors';
              }

              if (id.endsWith('.css') || id.endsWith('.less')) {
                return 'app';
              }
            },
            assetFileNames: (assetInfo) => {
              const name = assetInfo.name || '';
              
              if (/\.(css)$/.test(name)) {
                return `${outputFolders.css}/[name].[hash:16][extname]`;
              }
              
              if (/\.(png|jpe?g|gif|svg|webp|avif|ico|bmp)$/i.test(name)) {
                return `${outputFolders.media}/[name].[hash:16][extname]`;
              }

              return `${outputFolders.public}/[name].[extname]`;
            },
          }
        },
      },

      environments: {
        modern: {
          consumer: 'client',
          build: {
            target: 'es2024',
            cssTarget: 'es2018', // CSS target should mimic legacy JS target
            rolldownOptions: {
              input: createPolyfillEntry(ctx, 'polyfill.es.js'),
              output: getRolldownOutputConfig(outputFolders.es, 'client'),
            },
          },
        },
        legacy: {
          consumer: 'client',
          build: {
            target: 'es2018',
            cssTarget: false, // We build CSS only in modern build
            rolldownOptions: {
              input: createPolyfillEntry(ctx, 'polyfill.js'),
              plugins: [
                // @TODO: This would be nice to eventually replace with oxc once it is supported,
                // since this babel polyfill injection is quite slow
                babel({
                  babelHelpers: 'bundled',
                  exclude: [
                    // usage-pure is designed for source code only — exclude the polyfill
                    // library itself to prevent circular polyfilling and rolldown CJS interop issues
                    /node_modules\/core-js-pure\//,
                  ],
                  // Note: We only use babel for polyfills
                  plugins: [
                    ['polyfill-corejs3', {
                      targets: targets.join(', '), // ES2018 baseline
                      version: coreJsVersion,
                      method: 'usage-pure',
                    }]
                  ],
                  extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx'],
                  babelrc: false,
                  configFile: false,
                })
              ],
              output: getRolldownOutputConfig(outputFolders.js, 'client'),
            }
          }
        },
        server: {
          consumer: 'server',
          resolve: {
            // @TODO: IMA.js packages do not have valid ESM build, this is a workaround to build them
            noExternal: [/^@ima\//], // Bundle all @ima/* packages
            external: true
          },
          build: {
            ssr: true,
            target: 'node18',
            rolldownOptions: {
              output: {
                ...getRolldownOutputConfig('server', 'server'),
              }
            }
          }
        },
      },

      // CSS configuration
      css: {
        modules: {
          generateScopedName: isDevEnv
            ? '[path][name]__[local]--[hash:base64:5]'
            : '[hash:base64]',
        },
        preprocessorOptions: {
          less: {
            plugins: [lessPluginGlob],
            // Allow Less to resolve Vite aliases (e.g. 'app' → '<rootDir>/app')
            // by searching from rootDir, mirroring Vite's alias configuration.
            paths: [rootDir],
            // Import globals.less automatically
            ...(fs.existsSync(lessGlobalsPath) && {
              additionalData: `@import "${lessGlobalsPath}";\n`,
            }),
          },
        },
        postcss: await imaConfig.postcss(
          {
            plugins: [
              require('postcss-flexbugs-fixes'),
              require('postcss-preset-env')({
                browsers: imaConfig.cssBrowsersTarget,
                autoprefixer: { flexbox: 'no-2009', grid: 'autoplace' },
                stage: 1,
              }),
            ],
          },
          ctx
        ),
        devSourcemap: useSourceMaps,
      },

      server: {
        middlewareMode: true, // We run our own HMR server and attach Vite as middleware
        hmr: {
          overlay: false, // We have our own custom error overlay
        },
        ...(imaConfig.watchOptions ? { watch: imaConfig.watchOptions } : {}),
      },

      define: {
        // Backwards webpack compatibility for global variable, since some packages are using it
        global: 'globalThis',
      },

      // Logging
      logLevel: ctx.verbose ? 'info' : 'warn',
  }
};
