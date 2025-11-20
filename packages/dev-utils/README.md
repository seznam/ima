<p align="center">
  <img height="130" src="https://imajs.io/img/logo.svg" />
</p>

<h1 align="center">@ima/dev-utils</h1>
<p align="center"><i>Used to share common methods and utils used across other dev packages (@ima/cli, @ima/error-overlay, etc.).</i></p>

---

Currently it mainly contains methods for compile and runtime error parsing which are used in multiple other packages.

There's intentionally no "main" export or index file and each utils file has to be imported with it's direct path. This is because some packages are used on client only while others may contain some nodejs specific syntax.

This means that you need to import each utility as:
```javascript
import { extractSourceMappingUrl } from '@ima/dev-utils/sourceMapUtils';
import { FragmentLine } from '@ima/dev-utils/sourceFragment';
import { parseCompileError } from '@ima/dev-utils/compileErrorParser';
// ...
```


## Contents
- `compileErrorParser` - used to parse compile errors from currently used loaders.
- `cliUtils` - utilities for CLI error formatting.
- `helpers` - general regexps and other helpers.
- `sourceFragment` - utility to create source fragment object containing X number of lines of code around highlighted line from provided source.
- `sourceMapUtils` - utils to extract source map URL from file contents.

---

This package is part of the IMA.js application stack, see [imajs.io](https://imajs.io/) for more info about the whole project.
