---
title: Migration 18.0.0
description: Migration > Migration to version 18.0.0
---

## Update Node
node 18 a npm >= 8

## Update React to 18

## Moved from gulp to webpack
You can remove gulp things. There is new @ima/cli plugin for helping with webpack.
* change scripts in package.json
* remove gulpfile
* you have to import everything you want to be present in your bundle

### Removed build.js, add ima.config.js
* look at create-ima-app `ima.config.js`
* definition of languages moved from `build.js` to `ima.config.js`
* definition of less file pathes is not needed - see section Styles below

## New React-page-renderer
* React-page-renderer moved to new package @ima/react-page-renderer
* You can use codemod `npx @cns/web-plugins-codemods` -> ima18: react page renderer imports

## Update DocumentView
Rewrite your DocumentView similar like in create-ima-app.

## Update Server
Rewrite your server similar like in create-ima-app.

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

## Other changes
* file `app/environment.js` moved to location `/server/config/environment.js`
* 400, 500, spa templates are in `server/template` (look at create-ima-app)
* Prepared for typescript

## Deleted packages
* @ima/react-hooks - functionality moved to @ima/react-page-renderer
* @ima/plugin-less-constants moved to @ima/cli-plugin-less-constants
* @ima/plugin-hot-reload
* @ima/plugin-websocket

## IMA.js Plugins

All IMA.js plugins need to be updated to the latest version. Older versions won't work.
