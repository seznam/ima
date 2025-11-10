---
"@ima/react-page-renderer": major
"@ima/server": major
"@ima/cli": major
---
- Added new SPA Prefetch render mode, for more information see the documentation.

## BREAKING CHANGES

The degradation logic has been completely refactored. The old concurrency-based and SPA configuration options have been removed in favor of a more flexible degradation function system.

#### Removed Environment Options

The following environment configuration options have been **removed**:

- `$Server.staticConcurrency` - Removed, use `degradation.isStatic` function instead
- `$Server.overloadConcurrency` - Removed, use `degradation.isOverloaded` function instead
- `$Server.serveSPA.allow` - Removed, use `degradation.isSPA` function instead
- `$Server.serveSPA.blackList` - Removed, use `degradation.isSPA` with user agent degradation instead

#### Migration Guide

**Before (old configuration):**
```javascript
module.exports = {
  prod: {
    $Server: {
      staticConcurrency: 100,
      overloadConcurrency: 100,
      serveSPA: {
        allow: true,
        blackList: userAgent => new RegExp('Googlebot|SeznamBot').test(userAgent),
      },
    },
  },
};
```

**After (new configuration):**
```javascript
const { createUserAgentDegradation, invert } = require('@ima/server/degradation');

module.exports = {
  prod: {
    $Server: {
      degradation: {
        // Replace serveSPA.blackList: serve SPA for all user agents EXCEPT bots
        isSPA: invert(
          createUserAgentDegradation(/Googlebot|SeznamBot/i)
        ),

        // Replace staticConcurrency: serve static pages when needed
        isStatic: (event) => {
          // Your custom logic here
          return false;
        },

        // Replace overloadConcurrency: show overload message when needed
        isOverloaded: (event) => {
          // Your custom logic here
          return false;
        },
      },
    },
  },
};
```

#### Replacing SPA Blacklist

To replace the old `serveSPA.blackList` functionality, use the `invert` helper with `createUserAgentDegradation`:

```javascript
const { createUserAgentDegradation, invert } = require('@ima/server/degradation');

module.exports = {
  prod: {
    $Server: {
      degradation: {
        // Old: blackList: userAgent => /Googlebot|SeznamBot/.test(userAgent)
        // New: Serve SPA for all requests EXCEPT those matching the blacklist pattern
        isSPA: invert(
          createUserAgentDegradation(/Googlebot|SeznamBot/i)
        ),
      },
    },
  },
};
```

For more information and examples, see the [Performance & Degradation documentation](/docs/server/performance).
