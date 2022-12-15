---
title: Error Handling
description: Basic features > Errors
---

This sections focuses on client and server-side error handling during development and in production.

## GenericError

Represents custom error class that poses a structure for http errors. This **should be preferred way** of throwing custom errors as it adds an ability to define http status code with additional custom params. To create such error you need to import **GenericError** from `@ima/core` and instantiate it:

```javascript
import { GenericError } from '@ima/core';

throw new GenericError(
  'Something went wrong.',
  { status: 500, custom: 'param' } // error parameters
);
```

GenericError instance has 2 methods:
- `getParams()` - Returns params argument (2nd argument) provided to the constructor.
- `getHttpStatus()` - Returns `status` property from the params.
