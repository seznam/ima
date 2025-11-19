---
"@ima/dev-utils": major
"@ima/server": major
---

Production logger is now console, move devLogger to dev-utils to allow apps to use current devLogger

To use devLogger in your application, you can import it in environment definition from @ima/dev-utils:

```js
import { createDevServerLogger } from '@ima/dev-utils';

...
    <environment_name>: {
        $Server: {
            ...
            logger: createDevServerLogger(),
        },
    },
...
```
