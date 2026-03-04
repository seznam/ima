import fs from 'fs';
import path from 'path';

import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression2';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import babel from '@rollup/plugin-babel';

import {
  imaLanguagesPlugin,
  getVirtualLanguageEntryPoints,
} from './plugins/imaLanguagesPlugin';

import { BuildEnvironmentOptions } from 'vite';
import { ImaConfigurationContext, ImaConfig, ViteConfigWithEnvironments } from '../types';
import { imaSkipCssPlugin } from './plugins/imaSkipCssPlugin';
import { imaHmrPlugin } from './plugins/imaHmrPlugin';
import { imaUseServerPlugin } from './plugins/imaUseServerPlugin';
import { getCurrentCoreJsVersion } from './utils/utils';

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
          return `${outputJsFolder}/app.${appSuffix}.[hash:16].js`;
        }

        return `${outputJsFolder}/[name].[hash:16].js`;
      },

      // Vendor location
      chunkFileNames: `${outputJsFolder}/[name].[hash:16].js`,
    }
  }

  return {
      root: rootDir,
      base: imaConfig.publicPath,
      mode: mode,
      publicDir: false,
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
        alias: {
          app: appDir,
        },
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
      },

      build: {
        outDir: 'build',
        emptyOutDir: false, // We are generating localization files before build
        sourcemap: useSourceMaps,
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
            // @TODO: I don't understand this part, let's get back to this later
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
            cssTarget: 'es2023', // CSS target es2024 is not yet supported, once it is, we can remove this line
            rolldownOptions: {
              external: [],
              output: {
                ...getRolldownOutputConfig('static/js.es', 'client'),
              }
            },
          },
        },
        legacy: {
          consumer: 'client',
          build: {
            target: 'es2018',
            cssTarget: false, // We build CSS only in modern build
            rolldownOptions: {
              plugins: [
                // @TODO: This would be nice to replace with oxc polyfill injection
                // Using Babel to handle polyfill injection
                babel({
                  babelHelpers: 'bundled',
                  exclude: [
                    // The `usage-global` method is designed for source code only
                    // We need to exclude minified dependencies, as they cause build issues
                    /node_modules\/core-js/,
                    /node_modules\/react/,
                    /node_modules\/react-dom/,
                  ],
                  // Note: We only use babel for polyfills
                  plugins: [
                    ['polyfill-corejs3', {
                      targets: targets.join(', '), // ES2018 baseline
                      version: coreJsVersion,
                      method: 'usage-global',
                    }]
                  ],
                  extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx'],
                  babelrc: false,
                  configFile: false,
                })
              ],
              output: {
                ...getRolldownOutputConfig('static/js', 'client'),
              }
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
        // @TODO: This used to be conditionally linked to `.module.css` files only, review if this is needed or safe
        modules: {
          generateScopedName: isDevEnv
            ? '[path][name]__[local]--[hash:base64:5]'
            : '[hash:base64]',
          localsConvention: 'camelCaseOnly',
        },
        preprocessorOptions: {
          less: {
            javascriptEnabled: true,
            // @TODO: Do we neeed this plugins part? AI suggested this, but I don't understand the use case yet
            // plugins: [
            //   // @ts-expect-error - less-plugin-glob types are incomplete
            //   require('less-plugin-glob'),
            // ],
            // Import globals.less automatically
            ...(fs.existsSync(lessGlobalsPath) && {
              additionalData: `@import "${lessGlobalsPath}";\n`,
            }),
          },
        },
        devSourcemap: useSourceMaps,
      },

      // Define global constants
      // @TODO: This looks dangerous, review if we need this
      //        I tested this and it seems to be working `IMA_PUBLIC_PATH="https://www.seznam.cz/" NODE_ENV=production npm start`
      //        The public path url did not work, but the browser requested a fallback so its all working as expected.
      // define: {
      //   'process.env.NODE_ENV': JSON.stringify(mode === 'production' ? 'production' : 'development'),
      //   ...(process.env.IMA_PUBLIC_PATH && {
      //     'process.env.IMA_PUBLIC_PATH': JSON.stringify(process.env.IMA_PUBLIC_PATH),
      //   }),
      // },

      // Logging
      logLevel: ctx.verbose ? 'info' : 'warn',
  }
};
