---
"create-ima-app": minor
"@ima/server": minor
"@ima/core": minor
"@ima/cli": minor
---

Added support for 'json' response type in controllers, enabling direct JSON responses from server-side routes without rendering HTML. Introduced the 'use server' directive in the CLI to strip server-only code (e.g., controllers with 'use server') from client bundles, optimizing bundle size and preventing server code leakage to the client. Currently, its main purpose is for JSON controllers, but it effectively stubs any exports from the file and removes the implementation in client bundles.
