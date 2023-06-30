---
"@ima/react-page-renderer": patch
---

The error thrown in react view in request phase can cause problem in error and next response phases. In before error phase we remove viewAdpater for next before response phase which will be skip when page renderer not set the new react components.
