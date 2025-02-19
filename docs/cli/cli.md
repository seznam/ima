---
title: 'Introduction to @ima/cli'
description: 'CLI > Introduction to @ima/cli'
---

The **IMA.js CLI** allows you to build, run and watch your application for changes during development. These features are handled by the following commands: `build`, `dev`, and `start`.

You can always list available commands by running:

```bash npm2yarn
npx ima --help
```

:::note

[npx](https://www.npmjs.com/package/npx) comes pre-installed with npm 5.2+ and higher.

:::

This should produce following output:

```
Usage: ima <command>

Commands:
  ima build  Build an application for production
  ima dev    Run application in development watch mode
  ima start  Start the application in production mode

Options:
  --version  Show version number  [boolean]
  --help     Show help  [boolean]
```

## Development

The `npx ima dev` command starts the application in the **development** mode with HMR, error-overlay, source maps and other debugging tools enabled.

By default the application starts on [http://localhost:3001](http://localhost:3001) with [companion dev server](./advanced-features#dev-server) running at [http://localhost:3101](http://localhost:3101). These can be further customized through the app **environment** settings and CLI arguments.

You can also run `npx ima dev --help` to list all available options that you can use:

```
ima dev

Run application in development watch mode

Options:
  --version         Show version number  [boolean]
  --help            Show help  [boolean]
  --clean           Clean build folder before building the application  [boolean] [default: true]
  --clearCache      Deletes node_modules/.cache directory to invalidate loaders cache  [boolean]
  --verbose         Use default webpack CLI output instead of custom one  [boolean]
  --inspect         Enable Node inspector mode  [boolean]
  --ignoreWarnings  Webpack will no longer print warnings during compilation  [boolean]
  --open            Opens browser window after server has been started  [boolean] [default: true]
  --openUrl         Custom URL used when opening browser window  [string]
  --legacy          Runs application in legacy mode  [boolean] [default: false]
  --forceLegacy     Forces runner.js to execute legacy client code  [boolean] [default: false]
  --forceSPA        Forces application to run in SPA mode  [boolean] [default: false]
  --writeToDisk     Write static files to disk, instead of serving it from memory  [boolean] [default: false]
  --reactRefresh    Enable/disable react fast refresh for React components [boolean] [default: true]
  --lazyServer      Enable/disable lazy init of server app factory [boolean] [default: true]
  --port            Dev server port (overrides ima.config.js settings)  [number]
  --hostname        Dev server hostname (overrides ima.config.js settings)  [string]
  --publicUrl       Dev server publicUrl (overrides ima.config.js settings)  [string]
```

:::info

Any of the above mentioned options can be combined together in all different combinations and all options have specified default value. This means that in normal cases you can run `npx ima dev` without any additional arguments.

:::

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
  --ignoreWarnings  Webpack will no longer print warnings during compilation  [boolean]
  --profile         Turn on profiling support in production  [boolean] [default: false]
```

## Start

The `npx ima start` command starts the application server. This command is designed to run your application after it has been built using the `build` command in production.

```
ima start

Start the application in production mode

Options:
  --version  Show version number  [boolean]
  --help     Show help  [boolean]
  --server   Custom path to the server file (relative to project root)  [string] [default: "server/server.js"]
```

The start command will:
1. Run your application in production mode (by default)
2. Handle process signals (SIGTERM, SIGINT) for graceful shutdown
3. Provide proper error handling and logging

By default, the command looks for the server file at `server/server.js` in your project root. You can customize this path using the `--server` option:

```bash
# Using default server path
npx ima start

# Using custom server path
npx ima start --server custom/path/to/server.js
```

## CLI options

Most of the following options are available for both `dev` and `build` commands, however some may be exclusive to only one of them. You can always use the `--help` argument to show all available options for each command.

:::tip

When you run into any issues with the application build, you can always run the app with `npx ima dev --clearCache` to make sure that all cache and tmp files are deleted before next build and see if this resolves your issues.

Similarly you can use the `--verbose` option to show more information during build that can aid you in **debugging process** in case anything happens.

:::

### --version

Prints `@ima/cli` version.

### --help

Prints help dialog.

### --clean

> `boolean = true`

Deletes `./build` folder before running the application.

### --clearCache

> `boolean = false`

Clears `./node_modules/.cache` folder. This is used to store webpack filesystem cache and other webpack loader and plugins cache.

### --verbose

> `boolean = false`

Disables custom CLI logging style in favor of default webpack CLI verbose. This can be useful for debugging.

### --inspect

> `boolean = false`

Disable/enable node [inspector](https://nodejs.org/en/docs/guides/debugging-getting-started) mode.

### --ignoreWarnings

> `boolean = false`

Ignore reporting of webpack warning messages. The CLI automatically caches all existing warnings and shows just new warnings rebuilds in watch mode.

### --open

> `boolean = true`

Enable/disable auto opening of app URL in the browser window on startup.

:::tip

If you find this option annoying, you can completely **disable this feature across all IMA.js applications** by putting `IMA_CLI_OPEN=false` in your environment.

:::

### --openUrl

> `boolean = true`

Allows you to customize URL which is opened when the server starts in development mode.

:::tip

You can also use `IMA_CLI_OPEN_URL='http://ima.dev:3001'` env variable to set this option.

This is usefull when you have project-specific URLs. You can then set this environment variable in application's `ima.config.js` and don't have to worry about using `--openUrl` CLI argument everytime you're starting the application in dev mode.

:::

### --legacy

> `boolean = false`

By default the CLI only builds `es` version of JS files in development mode. Use this option to enable [additional build of non es version](./compiler-features#server-and-client-bundles).

### --forceLegacy

> `boolean = false`

Enables `legacy` mode and forces runner.js to load legacy code even if targeted browser supports the latest client es version.

### --forceSPA

> `boolean = false`

Forces the application to run in SPA mode.

### --profile

> `boolean = false`

Disables some optimizations to allow for better debugging while also trying to be as close to the production build as possible. Currently this option disables mangling of classes and functions, which produces more readable stack traces.


### --writeToDisk

> `boolean = false`

By default the app **client static files are served from memory** in dev mode. Using this option you can force webpack to write these files and serve them from the disk.

:::tip

This option can be useful in some cases where you need to take a look at the compile source code, where it's easier to browse these files locally, rather than on the static server.

:::


### --reactRefresh

> `boolean = true`

Disable/enable [react fast refresh](https://github.com/pmmmwh/react-refresh-webpack-plugin) for React components.

:::tip

Disable this option if you are watching and editing `node_modules` files, this may result in less performant but more stable HMR experience.

:::

### --lazyServer

> `boolean = true`

Disable/enable lazy init of server app factory.


## Dev server options

Following options are used to customize the companion dev server location (only for `dev` command). These can be useful if you have some special dev environment, where you have an issue with the default configuration.

:::note

If you provide `port` and `hostname`, you don't need to define the `publicUrl`, the CLI will create it automatically, unless the `publicUrl` is completely different than the `hostname` and `port` provided.

:::

### --port

> `number`

Dev server port.

### --hostname

> `string`

Dev server hostname, for example: `localhost`, or `127.0.0.1`.

### --publicUrl

> `string`

Dev server public url, for example: `http://localhost:3101`.
