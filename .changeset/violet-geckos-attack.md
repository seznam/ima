---
"@ima/storybook-integration": patch
"@ima/core": minor
---

Added support for custom event targets in Router's listen methods. This enables better control over routing behavior by allowing you to:
- Scope navigation handling to specific parts of your application
- Handle multiple independent routed sections on a page
- Better integrate IMA.js routing into existing applications

Changes:
- Modified `listen(target?: EventTarget)` method to allow for optional target
- Modified `unlisten(target?: EventTarget)` method to allow for optional target
- Added new `unlistenAll()` method to cleanup all event listeners at once
