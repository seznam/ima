---
"create-ima-app": patch
---

  - **What?** Unfreeze pinned dependencies in the skeleton `package.json` template by adding `^` range prefix.
  - **Why?** Pinned dependencies cause unnecessary friction for new projects — any patch or minor update requires a manual bump. Using `^` allows projects to receive compatible updates automatically.
  - **How?** Nothing.
