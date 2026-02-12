---
"@ima/server": patch
---

Fix starting of monitoring.

- **What** Use `start` instead of `monitor.start`. Method `start` will start both monitor and shortMonitor.
- **Why** ShortMonitor was not started and we were not collecting shortMetrics.
- **How** Nothing.