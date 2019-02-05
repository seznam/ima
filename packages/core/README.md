# IMA.js

[![Build Status](https://travis-ci.org/seznam/IMA.js-core.svg?branch=master)](https://travis-ci.org/seznam/IMA.js-core) [![dependencies Status](https://david-dm.org/seznam/IMA.js-core/status.svg)](https://david-dm.org/seznam/IMA.js-core)
[![Known Vulnerabilities](https://snyk.io/test/npm/ima/badge.svg)](https://snyk.io/test/npm/ima)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

This is the ima library of the IMA.js application stack, which is most likely
not what you are looking for.

You can find the IMA.js skeleton application at
<https://github.com/seznam/IMA.js-skeleton>.

## Contributing

Contributing to this repository is done via [Pull-Requests](https://github.com/seznam/IMA.js-core/pulls).
Any commit that you make must follow simple rules that are automatically validated upon committing.
1. type of change (`build`, `ci`, `chore`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`)
2. scope of change in brackets `( ... )`. This should be one-word description of what part of the repository you've changed.
3. colon `:`
4. message (lower-case)

`fix(iframe): message`

`feat(loader): message`

To simplify this process you can use `npm run commit` command that will interactively prompt for details and will also run linter before you commit. For more information see [commitizen/cz-cli](https://github.com/commitizen/cz-cli) repository.
