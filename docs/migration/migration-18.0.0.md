---
title: Migration 18.0.0
description: Migration > Migration to version 18.0.0
---

IMA.js brings few major breaking changes. For more information read below.

## Update requirements
IMA.js v18 requires node >= 18, npm >= 8 and react 18.

## Moved from gulp to webpack
You can remove gulp things. There is new @ima/cli plugin for helping with webpack.
From now, you have to import everything you want to be present in your bundle (that's how webpack works).

### Change scripts in package.json
There is new @ima/cli used in scripts instead of gulp.

**Example:**
```js
...
 "scripts": {
    "test": "jest",
    "lint": "eslint './**/*.{js,jsx,ts,tsx}'",
    "dev": "ima dev",
    "build": "NODE_ENV=production ima build",
    "start": "NODE_ENV=production node server/server.js"
},
...
```
Remove `"main": "build/server.js"` from `package.json` too. (Server is not anymore in build/server.js.)

### Remove gulp specific things
Dependencies:
* @ima/gulp-task-loader
* @ima/gulp-tasks
Files:
* gulpfile.js
* gulpConfig.js

### Removed build.js, optionally add ima.config.js file to root
* look at [ima.config.js](../cli/ima-config-js) 
* definition of languages moved from `build.js` to `ima.config.js`
* definition of less file pathes is not needed - see section Styles below

## Moved from babel to swc
You can remove @babel dependencies (except for eslint specific). 

Add `@swc/jest` devDependency for tests.

## New React-page-renderer
* React-page-renderer moved to new package @ima/react-page-renderer 
```
npm i @ima/react-page-renderer
```
* You can use codemod `npx @cns/web-plugins-codemods` -> ima18: react page renderer imports

## Update DocumentView
Rewrite your DocumentView similar like in create-ima-app.

## Update Server
You have to add dependecy to `error-to-json` on your own. It was removed from @ima/server.
Rewrite your server similar like in create-ima-app.

### Split server.js -> server.js and app.js
This change is optionally, but we use it in our create-ima-app.

### Server changes
Remove:
```
'use strict';

require('@ima/core/polyfill/imaLoader.js');
require('@ima/core/polyfill/imaRunner.js');
```

Replace this part:
```
let imaServer = require('@ima/server');

let clientApp = imaServer.clientApp;
let urlParser = imaServer.urlParser;
let environment = imaServer.environment;
let logger = imaServer.logger;
let cache = imaServer.cache;
```
Replace by
```
const imaServer = require('@ima/server')();
const { serverApp, urlParser, environment, logger, cache, memStaticProxy } =
  imaServer;

require('@ima/react-page-renderer/hook/server')(imaServer);
```

### Move environment.js file
* File `app/environment.js` was moved to location `/server/config/environment.js`
  There was removed **test** env.

### Templates
* 400, 500, spa templates are in `server/template` (look at [create-ima-app](https://github.com/seznam/ima/tree/master/packages/create-ima-app/template/server/template))

## Assets => app/public
Everything from folder app/public is moved to build folder into static folder.

## Styles
* Remove files mark as `FAKE FILE FOR GULP LESS`
* Move less files from `assets/less` to `app/less`
* You have to move definition of less files pathes from build.js to "imports" - you have two options:
  * import less files per component
  * import root less file e.g. in main.js and use glob pattern to import other less files similar like it was in build.js
* app/less/globals.less - this file is prepending to every less file so that you can import here variables, mixins, etc.
* strictMaths is enabled

## Tests 
Add `@swc/jest` dependency.
Add `identity-obj-proxy` for css/less in jest.
Replace `enzyme-adapter-react-16` with `@cfaester/enzyme-adapter-react-18`.

## Other changes
* Prepared for typescript

## Deleted packages
You can remove following packages:
* @ima/react-hooks - functionality moved to @ima/react-page-renderer
* @ima/plugin-less-constants moved to @ima/cli-plugin-less-constants
* @ima/plugin-hot-reload
* @ima/plugin-websocket
* @ima/gulp-task-loader
* @ima/gulp-tasks

## IMA.js Plugins

All IMA.js plugins need to be updated to the latest version. Older versions won't work.
