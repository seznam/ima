---
"@ima/core": major
---

Removed support for `HttpAgent` options.listener (these were used mainly in plugin-xhr, which is now unsupported)
**BREAKING CHANGE**: You can now define multiple `postProcessors[]` in `HttpAgent` options, this however presents a breaking change, since if you are already using any `postProcessor`, you need to update your options to `postProcessors` and make sure to pass an array to this option.
