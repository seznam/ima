---
"@ima/server": minor
---

Allow explicit environment selection for each server instance.

- **What** Add the optional `environmentName` argument to `createIMAServer` and `environmentFactory`, including public TypeScript declarations. Explicit names override the environment captured during module import, while omitted names preserve the existing resolution timing and supplied environment objects retain precedence.
- **Why** Testing configurations must select their environment consistently even when `@ima/server` has already been imported, without mutating process variables or changing existing server and Storybook defaults.
- **How** Pass `environmentName` when creating a server or resolving a named environment. Existing callers require no changes.
