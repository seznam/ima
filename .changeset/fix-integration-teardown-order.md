---
"@ima/testing-library": patch
---

Fix integration application teardown order and immediate timers in jsdom.

- **What?** Integration `clearImaApp` now awaits page-manager destruction before unmounting React, while preserving unmount and environment cleanup when destruction fails. Integration boot supplies Node immediate timers when jsdom does not provide them and restores the original timer globals during cleanup.
- **Why?** Unmounting while page event handlers are still active can trigger new renders and asynchronous state updates after the test environment has been removed. The previous immediate-timer wrapper called an undefined function in jsdom, preventing real dictionary loading.
- **How?** Nothing.

**Ticket:** [CNSQA-1710](https://youtrack.seznam.net/issue/CNSQA-1710)
