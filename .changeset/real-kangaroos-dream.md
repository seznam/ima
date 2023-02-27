---
"@ima/cli": minor
---

Performance improvement while building non-module CSS/LESS (\*.module.css) files on bundles that don't process CSS (server and client). In this cases the CSS imports are completely ignored which improves build performance merginally, depending on the amount of CSS files you app is using
