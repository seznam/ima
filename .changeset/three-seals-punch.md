---
"@ima/storybook-integration": minor
---

Removed `require` from `exports` fields since it is not supported by this package (module-only)
Added exports to `.` path -> `@ima/storybook-integration` is now a valid import path, which exports utilities and decorators that can be used in your stories.
Updated README.md with usafe information on `isStorybook` helper and other utilities and decorators.
