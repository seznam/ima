---
title: 'Introduction to @ima/cli'
description: 'CLI > Introduction to @ima/cli'
---

The IMA.js CLI allows you to build and watch your application (dev-mode).

There are currently 2 supported commands on the CLI - `dev` and `build`. However you can always list available commands by running

```
npx ima --help
```

:::note

[npx](https://www.npmjs.com/package/npx) comes pre-installed with npm 5.2+ and higher.

:::

Which should produce following output:

```
Usage: ima <command>

Commands:
  ima build  Build an application for production
  ima dev    Run application in development watch mode

Options:
  --version  Show version number  [boolean]
  --help     Show help  [boolean]
```

## Development

The `npx ima dev` command starts the application in the **development** mode with HMR, error-overlay, source maps and other debugging tools enabled.

By default the application starts on [http://localhost:3001](http://localhost:3001) with companion dev server running at [http://localhost:3101](http://localhost:3101). These can be further customized through the app **environment** settings and CLI arguments.

As with the default command, you can also run `npx ima dev --help` to list all available options that you can pass to the CLI:

:::note

To make the `dev` builds as fast as possible, the CLI builds only the `es` version of the application JS files. To enable build of non-es version, run the cli with `--legacy` option.

:::

```
ima dev

Run application in development watch mode

Options:
  --version         Show version number  [boolean]
  --help            Show help  [boolean]
  --clean           Clean build folder before building the application  [boolean] [default: false]
  --clearCache      Deletes node_modules/.cache directory to invalidate loaders cache  [boolean]
  --verbose         Use default webpack CLI output instead of custom one  [boolean]
  --publicPath      Webpack public path to specify base for all assets in the app  [string]
  --ignoreWarnings  Webpack will no longer print warnings during compilation  [boolean]
  --open            Opens browser window after server has been started  [boolean] [default: true]
  --legacy          Runs application in legacy (es5-compatible) mode  [boolean] [default: false]
  --forceSPA        Forces application to run in SPA mode  [boolean] [default: false]
  --port            Dev server port (overrides ima.config.js settings)  [number]
  --hostname        Dev server hostname (overrides ima.config.js settings)  [string]
  --publicUrl       Dev server publicUrl (overrides ima.config.js settings)  [string]
```

:::info

Any of the above mentioned options can be combined together in all different combinations and all options have specified default value. This means that in normal cases you can run `npx ima dev` without any additional arguments.

:::

### Development options

Most of the following options are also available for `build` command.

- **`--version`** - prints `@ima/cli` version.
- **`--help`** - prints help dialog.
- **`--clean`** - deletes `./build` folder before running the application.
- **`--clearCache`** - clears `./node_modules/.cache` folder. This is used to store webpack filesystem cache and other webpack loader and plugins cache.
- **`--verbose`** - disables custom CLI logging style in favor of default webpack CLI verbose. This can be usefull for debugging.
- **`--publicPath`** - overwries the webpack `publicPath` config option.
- **`--ignoreWarnings`** - ignore reporting of webpack warning messages.
- **`--open=[true|false]`** - enable/disable auto opening of app URL in the browser window upon start. This is enabled by default.
- **`--legacy`** - by default the CLI only builds `es` version of JS files. Use this option to enable additional build of non es version.
- **`--forceSPA`** - forces the application to run in SPA mode.


:::tip

When you run into any issues with the application build, you can always run the app with `npx ima dev --clean --clearCache` to make sure that all cache and tmp files are deleted before next build and see if this resolves your issues.

Similarly you can use the `--verbose` option to show more information during build that can aid you in **debugging process** in case anything happens.

:::

#### Dev server options

Following options are used to customize the companion dev server location. These can be useful if you have some special dev environment, where you have an issue with default options.

- **`--port=3101`** - dev server port.
- **`--hostname=localhost`** - dev server hostname.
- **`--publicUrl=http://localhost:3101`** - dev server public url.

## Build

Builds the application in production mode with all optimizations enabled (compression, minification, etc.). The `build` command drops some options compared to the `dev` command. While adding few build specific commands. `npx build --help` produces:

```
ima build

Build an application for production

Options:
  --version         Show version number  [boolean]
  --help            Show help  [boolean]
  --clean           Clean build folder before building the application  [boolean] [default: true]
  --clearCache      Deletes node_modules/.cache directory to invalidate loaders cache  [boolean]
  --verbose         Use default webpack CLI output instead of custom one  [boolean]
  --publicPath      Webpack public path to specify base for all assets in the app  [string]
  --ignoreWarnings  Webpack will no longer print warnings during compilation  [boolean]
  --profile         Turn on profiling support in production  [boolean] [default: false]
```

- **`--profile`** - disables some optimizations to allow for better debugging while also trying to be as close to the production build as possible. Currently this option disables mangling of classes and functions, which produces more readable stack traces.

:::note

Additionally in comparison with dev command, the build has `clean` option enabled by default.

:::
