# IMA.js-gulp-tasks

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
