# @ima/gulp-tasks

[![Build Status](https://travis-ci.org/seznam/ima.svg?branch=master)](https://travis-ci.org/seznam/ima) [![dependencies Status](https://david-dm.org/seznam/ima/status.svg)](https://david-dm.org/seznam/ima)
[![Known Vulnerabilities](https://snyk.io/test/npm/ima/badge.svg)](https://snyk.io/test/npm/ima)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)


This repository houses the default build tasks implementation for IMA.js
applications, see [imajs.io](https://imajs.io/) for more info about the whole project.

## Watch task notifications

By default the watch task is used to run specific gulp tasks depends on source files change.

From version 0.16.4 the watch task can be configured to run native DGRAM/UDP4 server. This server is waiting for messages and runs assigned gulp tasks if any message matches the configured jobs key/regex.

The configuration can be set in gulp config:

```
// gulpConfig.js in project
let defaultConfig = require('@ima/gulp-tasks/gulpConfig');

defaultConfig.notifyServer.enable = true; /* this is only one required option to enable this feature. Disabled by default */
/* Default settings: */
defaultConfig.notifyServer.jobRunTimeout = 200, /* this timeout specify how long to wait before task run after first message is received, should be set to higher time than the same type of messages can be sent from client within one link process */
defaultConfig.notifyServer.server = 'localhost',
defaultConfig.notifyServer.port = 4445,
defaultConfig.notifyServer.messageJobs = {
        '(js|ejs|jsx)': ['vendor:build'], /* value declares gulp tasks to run when the message matches the regex represented by the key */
        '(css|sass|less)': ['less:build']
    }
}
```
