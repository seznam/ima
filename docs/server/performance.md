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

Enable SPA prefetch mode in your server environment configuration:

```javascript title="server/config/environment.js"
module.exports = {
  prod: {
    $Server: {
      serveSPAPrefetch: {
        // Enable SPA prefetch mode - when true, all requests will use SPA prefetch
        // (unless blacklisted or controlled by degradation logic)
        allow: true,

        // Optional: Blacklist specific user agents (e.g., search engine bots)
        blackList: (userAgent) => {
          return /Googlebot|SeznamBot/i.test(userAgent);
        }
      }
    }
  }
};
```

### Configuration Options

#### allow

> `boolean = false`

Enables SPA prefetch mode. When `true`, requests will be served in SPA prefetch mode instead of full SSR. If a degradation function is configured, it can be used to conditionally enable or disable SPA prefetch based on custom logic.

#### blackList

> `(userAgent: string) => boolean`

Optional function that receives the user agent string and returns `true` to prevent SPA prefetch mode for specific clients. Useful for ensuring search engine bots always receive fully rendered HTML.

### Force SPA Prefetch in Development

During development, you can force all requests to use SPA prefetch mode:

```bash
npx ima dev --forceSPAPrefetch
```

This sets the `IMA_CLI_FORCE_SPA_PREFETCH` environment variable, bypassing all conditions and always serving pages in SPA prefetch mode.

## Custom Degradation

For advanced control over when to use SPA or SPA prefetch mode, you can optionally implement custom degradation functions. This gives you full control based on your application's needs.

```javascript title="server/config/environment.js"
module.exports = {
  prod: {
    $Server: {
      serveSPA: {
        allow: true
      },
      serveSPAPrefetch: {
        allow: true
      },
      degradation: {
        // Optional: Custom logic to determine when to serve SPA
        isSPA: (event) => {
          const { req } = event;
          // Your custom logic here (e.g., based on server load, request type, etc.)
          return false;
        },

        // Optional: Custom logic to determine when to serve SPA prefetch
        isSPAPrefetch: (event) => {
          const { req } = event;
          // Your custom logic here (e.g., based on request headers, time of day, server metrics, etc.)
          // Example: Enable based on CPU usage, request rate, or other runtime metrics
          // When not defined, SPA prefetch will be enabled for all requests (subject to blacklist)
          return false;
        }
      }
    }
  }
};
```

The degradation functions receive the request event and should return `true` when the respective mode should be used. If degradation functions are not configured, SPA prefetch will be enabled by default (when `allow` is `true`), and only the blacklist will be checked.
