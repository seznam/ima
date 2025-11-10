---
title: 'Performance & Degradation'
description: 'Server > Performance optimization and graceful degradation'
---

## SPA Prefetch Mode

SPA prefetch mode is a performance optimization technique that provides a middle ground between full server-side rendering (SSR) and pure single-page application (SPA) mode.

### How It Works

When enabled, the server:

1. Executes the full application lifecycle (controller, data fetching, etc.)
2. Serializes the page state and cache
3. Serves the SPA template with pre-fetched data included

The client then:

1. Boots instantly with the SPA template
2. Uses the pre-fetched state (no additional API calls needed)
3. Takes over with full client-side interactivity

This approach reduces server CPU load from HTML rendering while maintaining fast initial page loads with pre-fetched data.

### Configuration

Enable SPA prefetch mode by defining the `isSPAPrefetch` degradation function in your server environment configuration:

```javascript title="server/config/environment.js"
module.exports = {
  prod: {
    $Server: {
      degradation: {
        // Define degradation function to enable SPA prefetch mode
        isSPAPrefetch: (event) => {
          const userAgent = event.req.get('user-agent') || '';

          return /Googlebot|Bingbot|SeznamBot/i.test(userAgent);
        },
      },
    },
  },
};
```

:::important
The degradation function **MUST be defined** in order to use SPA prefetch mode. Simply defining the function enables the feature, and the function's return value determines when SPA prefetch mode is used.
:::

### Force SPA Prefetch in Development

During development, you can force all requests to use SPA prefetch mode:

```bash
npx ima dev --forceSPAPrefetch
```

This sets the `IMA_CLI_FORCE_SPA_PREFETCH` environment variable, bypassing all conditions and always serving pages in SPA prefetch mode.

## Degradation

Degradation functions provide fine-grained control over server rendering behavior. They are **required** to enable different rendering modes (SSR, SPA, SPA prefetch, static pages) and allow you to conditionally switch between them based on runtime conditions like server load, user agents, request paths, or any custom logic.

### Degradation Keys

The server supports the following degradation keys. **Defining a degradation function enables that mode**, and the function's return value determines when it's used:

- **`isSPAPrefetch`**: Enables and controls when to serve SPA prefetch pages (executes app lifecycle but renders SPA template with pre-fetched data)
- **`isSPA`**: Enables and controls when to serve pure SPA pages (no server-side execution)
- **`isOverloaded`**: Enables and controls when to show server overload message (503 status)
- **`isStatic`**: Enables and controls when to serve static error pages

### Basic Usage

Degradation functions receive an event object containing `req`, `res`, `context`, and `environment` properties, and return `true` when degradation should trigger:

```javascript title="server/config/environment.js"
module.exports = {
  prod: {
    $Server: {
      degradation: {
        // Serve SPA prefetch for bots to improve SEO
        isSPAPrefetch: (event) => {
          const userAgent = event.req.get('user-agent') || '';

          return /Googlebot|Bingbot|SeznamBot/i.test(userAgent);
        },

        // Serve SPA when server is under heavy load
        isSPA: (event) => {
          const { environment, context } = event;

          // Example using @esmj/monitor - https://github.com/mjancarik/esmj-monitor
          const { level } = context.performance.severity.getThreats();

          return level === 'high' || level === 'critical';
        },

        // Show overload page for very high concurrency
        isOverloaded: (event) => {
          return process.env.IS_DOWN === 'true';
        },

        // Serve static error pages during maintenance
        isStatic: (event) => {
          return process.env.MAINTENANCE_MODE === 'true';
        },
      },
    },
  },
};
```

### Array Degradation Functions

You can provide an **array of degradation functions** for more complex logic. Functions are evaluated in order, and degradation triggers when **any function returns `true`** (OR logic):

```javascript title="server/config/environment.js"
module.exports = {
  prod: {
    $Server: {
      degradation: {
        isSPAPrefetch: [
          // First check: Serve SPA prefetch for bots
          (event) => {
            const userAgent = event.req.get('user-agent') || '';

            return /Googlebot|Bingbot|SeznamBot/i.test(userAgent);
          },

          // Second check: Serve SPA prefetch during peak hours
          (event) => {
            const hour = new Date().getUTCHours();

            return hour >= 9 && hour <= 17; // 9 AM - 5 PM UTC
          },

          // Third check: Serve SPA prefetch for mobile devices
          (event) => {
            const userAgent = event.req.get('user-agent') || '';

            return /Mobile|Android|iPhone/i.test(userAgent);
          },
        ],
      },
    },
  },
};
```

:::important
**Execution order matters**: The first function that returns `true` triggers degradation immediately, and subsequent functions are not evaluated. This is useful for performance optimization.
:::

### Pre-configured Degradation Helpers

The `@ima/server` package provides pre-configured degradation helpers to simplify common use cases. These can be shared across projects and combined to create complex degradation strategies:

```javascript title="server/config/environment.js"
const {
  createUserAgentDegradation,
  createPathDegradation,
  createHeaderDegradation,
  combineAnd,
  combineOr,
  invert,
} = require('@ima/server/degradation');

module.exports = {
  prod: {
    $Server: {
      degradation: {
        // Serve SPA prefetch for bots
        isSPAPrefetch: createUserAgentDegradation(
          /Googlebot|Bingbot|SeznamBot/i,
        ),

        // Serve SPA for API endpoints only during POST requests
        isSPA: combineAnd(
          createPathDegradation(/^\/api\//),
          (event) => event.req.method === 'POST',
        ),

        // Show overload during peak hours OR for 25% of traffic
        isOverloaded: combineOr(
          (event) => {
            const hour = new Date().getUTCHours();

            return hour >= 9 && hour <= 17; // 9 AM - 5 PM UTC
          },
          (event) => Math.random() * 100 < 25, // Sampling 25% of requests
        ),

        // Serve static pages for heavy operations, but not for authenticated users
        isStatic: combineAnd(
          createPathDegradation('/heavy-operation'),
          invert(createHeaderDegradation('authorization')),
        ),
      },
    },
  },
};
```

#### Available Helpers

##### `createUserAgentDegradation(pattern)`

Checks user agent string against a pattern (RegExp or function):

```javascript
// Using RegExp
const botDegradation = createUserAgentDegradation(
  /Googlebot|Bingbot|SeznamBot/i,
);

// Using function
const customDegradation = createUserAgentDegradation((userAgent) => {
  return userAgent.includes('Bot') || userAgent.includes('Spider');
});
```

##### `createPathDegradation(pattern)`

Matches request paths (RegExp, string prefix, array of prefixes, or function):

```javascript
// Using RegExp
const apiDegradation = createPathDegradation(/^\/api\//);

// Using string prefix
const adminDegradation = createPathDegradation('/admin');

// Using array
const staticDegradation = createPathDegradation(['/static', '/assets']);

// Using function
const complexDegradation = createPathDegradation((path) => {
  return path.startsWith('/api/') && path.includes('/heavy-operation');
});
```

##### `createHeaderDegradation(headerName, matcher?)`

Checks request headers:

```javascript
// Check if header exists
const hasAuthDegradation = createHeaderDegradation('authorization');

// Check header value (string)
const jsonDegradation = createHeaderDegradation(
  'content-type',
  'application/json',
);

// Check header value (RegExp)
const mobileDegradation = createHeaderDegradation(
  'user-agent',
  /Mobile|Android|iPhone/i,
);

// Check header value (function)
const customHeaderDegradation = createHeaderDegradation('x-custom', (value) => {
  return value.length > 100;
});
```

##### `combineAnd(...degradationFns)`

Combines functions with AND logic (all must return `true`):

```javascript
const combinedDegradation = combineAnd(
  createUserAgentDegradation(/Googlebot/i),
  createPathDegradation('/products'),
);
```

##### `combineOr(...degradationFns)`

Combines functions with OR logic (any must return `true`):

```javascript
const combinedDegradation = combineOr(
  createUserAgentDegradation(/Bot/i),
  createPathDegradation('/static'),
);
```

##### `invert(degradationFn)`

Inverts a degradation function:

```javascript
const notBot = invert(createUserAgentDegradation(/Bot/i));
```

### Sharing Degradation Logic

You can create your own degradation helpers and share them across projects:

```javascript title="shared/degradation.js"
const {
  createUserAgentDegradation,
  combineOr,
} = require('@ima/server/degradation');

// Custom helper for your organization
function createSEOBotDegradation() {
  return createUserAgentDegradation(
    /Googlebot|Bingbot|SeznamBot|DuckDuckBot|Baiduspider|YandexBot/i,
  );
}

// Custom helper for mobile detection
function createMobileDeviceDegradation() {
  return createUserAgentDegradation(
    /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile/i,
  );
}

// Export for reuse
module.exports = {
  createSEOBotDegradation,
  createMobileDeviceDegradation,
};
```

Then use them in your environment configuration:

```javascript title="server/config/environment.js"
const {
  createSEOBotDegradation,
  createMobileDeviceDegradation,
} = require('../shared/degradation');
const { combineOr } = require('@ima/server/degradation');

module.exports = {
  prod: {
    $Server: {
      degradation: {
        // Serve SPA prefetch for SEO bots OR mobile devices
        isSPAPrefetch: combineOr(
          createSEOBotDegradation(),
          createMobileDeviceDegradation(),
        ),
      },
    },
  },
};
```
