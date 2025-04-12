---
"@ima/helpers": patch
---

Add helper function assignTransformation() that labels provided callback function so it can be invoked in assign() as a transformation.  

- **What?** Add helper function assignTransformation() that accepts a callback function and labels it with unique symbol, so it can be invoked in assign() as a transformation. Expand conditional logic in assign() to detect the transformation function and call it with current value.
- **Why?** We want to have an option to provide custom transformation function when merging settings. For example to enable appending new values to an existing arrays, instead of directly overriding them. More on this topic: [IMA Docs](https://imajs.io/plugins/plugin-api) 
- **How?** Nothing.
