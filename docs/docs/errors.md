---
layout: "docs"
---

IMA.js implements a custom error class that poses a structure for http errors.

To create such error you need to import **GenericError** from `ima/error/GenericError` and instantiate it.

```javascript
throw new GenericError(
  'Something went wrong.', // error message
  { status: 500 } // error parameters
);
```

GenericError instance has 2 methods:
- `getParams()` - Returns params argument (2nd argument) provided to the constructor.
- `getHttpStatus()` - Returns `status` property from the params.
