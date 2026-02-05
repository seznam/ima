---
"@ima/testing-library": minor
---

Added `beforeCreateIMAServer` and `afterCreateIMAServer` hooks to `ServerConfiguration` interface, allowing custom logic execution before and after IMA server creation. You can use this new options in `setImaTestingLibraryServerConfig`. If you have some IMA server hooks, that need to be executed in tests, you can now attach them using these new configurations.
