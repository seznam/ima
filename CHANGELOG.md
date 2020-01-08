# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [17.3.0](https://github.com/seznam/ima/compare/v17.2.0...v17.3.0) (2020-01-08)


### Bug Fixes

* 🐛 clientrouter ([c08c41a](https://github.com/seznam/ima/commit/c08c41a103e3be7820c48a4cadbcba9ab4191b73)), closes [#30](https://github.com/seznam/ima/issues/30)
* 🐛 Crashing MS Edge (using spread operator inside object) ([d126644](https://github.com/seznam/ima/commit/d126644a5312beee9512fcaf5bddd0cba0b4ab89))
* 🐛 viewAdapter set state from props ([70d77e2](https://github.com/seznam/ima/commit/70d77e26d795283f8225275e1027172dea8aa172))


### Features

* 🎸 added @ima/devtools-scripts ([3ed4ce6](https://github.com/seznam/ima/commit/3ed4ce62004df1a43f423541454ad7a85e932ba2))





# [17.2.0](https://github.com/seznam/ima/compare/v17.1.1...v17.2.0) (2020-01-06)


### Features

* 🎸 the getBootConfig method is public ([db88f4d](https://github.com/seznam/ima/commit/db88f4d3bb121dc8ee463141ff50039fcf9d2d74))





## [17.1.1](https://github.com/seznam/ima/compare/v17.1.0...v17.1.1) (2019-12-20)


### Bug Fixes

* 🐛 web socket task is done after listening event is emitted ([74fa23d](https://github.com/seznam/ima/commit/74fa23d33a87411a3fabc0d95a23cf66d285fbb3))





# [17.1.0](https://github.com/seznam/ima/compare/v17.0.1...v17.1.0) (2019-12-11)


### Bug Fixes

* 🐛 changing views between pages ([0c25ef5](https://github.com/seznam/ima/commit/0c25ef5ad4a8688c8605fd08f5bd32fe8c331764))
* 🐛 propagation of state and React context ([dc164c3](https://github.com/seznam/ima/commit/dc164c3ed55e786010ac2a82e081ec15efbf1dc1))


### Features

* **core:** added Object Container as a constant to Object Container ([6547e3f](https://github.com/seznam/ima/commit/6547e3fcfdc3572b115779f9b1805b2703a44259))





## [17.0.1](https://github.com/seznam/ima/compare/v17.0.0...v17.0.1) (2019-12-06)

**Note:** Version bump only for package ima





# [17.0.0](https://github.com/seznam/ima/compare/v17.0.0-rc.10...v17.0.0) (2019-12-06)

### Bug Fixes

* 🐛 getCurrentRouteInfo returns not-found instead exception ([88077d4](https://github.com/seznam/ima/commit/88077d44ebc40249e1bd2bdf55fe5a359b4bc3df))
* 🐛 core exports for all files ([c484f33](https://github.com/seznam/ima/commit/c484f33d17f701ce9e4e8f437b04ba377fcea98f))
* 🐛 Error in component will no longer cause whitescreen view ([5b5354b](https://github.com/seznam/ima/commit/5b5354bb10dce52aec0b022b75cf800df8e6efc2))
* 🐛 Many scenarios for jscodeshift import transformers ([ebb04e1](https://github.com/seznam/ima/commit/ebb04e1fe6214afab61b142d8192a6584170ad92))
* 🐛 Export RendererTypes from core ([2a06da6](https://github.com/seznam/ima/commit/2a06da6aa2ff5154466fd70b589dab9321322ed0))
* 🐛 Fix cookie expiration date for Edge ([#15](https://github.com/seznam/ima/issues/15)) ([1b536dd](https://github.com/seznam/ima/commit/1b536dd648ec1ffc367b7af17458e6d5152ad305))
* 🐛 Implement new hot-reload plugin for all examples ([cc5d7bf](https://github.com/seznam/ima/commit/cc5d7bfbc231e4e87199da55fe1c5a3bfe95c1bf))
* 🐛 plugin-websocket server import ([0cca73f](https://github.com/seznam/ima/commit/0cca73fc2bcc60dabc03e89abc3177a6f22e97c2))
* 🐛 Use client version of core for browsers ([0e6c808](https://github.com/seznam/ima/commit/0e6c80897cd5af8eebc4a5f696ea0bc40d29acbf))
* 🐛 Error page no longer displays white screen ([#4](https://github.com/seznam/ima/issues/4)) ([9345834](https://github.com/seznam/ima/commit/9345834615b154795064117e57c4aa315a752750))
* **component-utils:** better check for object type ([4caae44](https://github.com/seznam/ima/commit/4caae44295b883656611c92d4a176d5e3eef7e3b))
* **component-utils:** pull-request fixes ([1b2c9e9](https://github.com/seznam/ima/commit/1b2c9e94fcef8dcb26d8b77c3d4c85f9bfc7981e))
* **dictionary:** set current language to dictionary config ([ddb951c](https://github.com/seznam/ima/commit/ddb951cc0cd49ecf851160e7444dd1662390ec32))
* **firefox-prefetch:** IMA should not re-render prefetched URLs that are included in rel="next" links ([bae6aaf](https://github.com/seznam/ima/commit/bae6aaf2d0d849e48225d85e218cc30359c7cb64))
* **hotreload:** hotreload by websocket ([615282b](https://github.com/seznam/ima/commit/615282b05cba361377f5564211c80a204cc07909))
* **httpproxy:** must set cookies manually only on server side ([2234693](https://github.com/seznam/ima/commit/2234693d367343d6511bd55b4a6a0a6ccdbe42e9))
* **imaloader:** export now accepts object in key parameter ([bb5f66f](https://github.com/seznam/ima/commit/bb5f66f0c3ee13cbbe43083d81f46e27b1d0b39c))
* **imaloader:** must be in es5 syntax ([07e4bc4](https://github.com/seznam/ima/commit/07e4bc47707748079205b1abb24504b6c73fd5c2))
* **imaloader:** must be written in es5 syntax ([401c345](https://github.com/seznam/ima/commit/401c3455e9a6011a7b7bd2c1f47b100284090e13))
* **main.js:** fix hotreload ([7669056](https://github.com/seznam/ima/commit/7669056bc994f5d08b8b54c8d62a811ecd862114))
* **onload:** wait for DOM to be interactive ([ae915d2](https://github.com/seznam/ima/commit/ae915d2185333648b2063f5af388971765edfec0))
* **pagemanager:** page view can be defined as namespace ([86aa17e](https://github.com/seznam/ima/commit/86aa17e7771d737e0d16d6fde7b63c2e39f09a8f))
* **pagenavigation:** scrollTo fix ([5e4fc35](https://github.com/seznam/ima/commit/5e4fc35e4f9e9d5583e67b36ca4041fe898410a1))
* **partialstate:** fix async bug between view and extension ([f095271](https://github.com/seznam/ima/commit/f0952712bfb273cba83340f812bf05d03943b552))
* **transform:** refactored es6 import statements to use require ([3781a80](https://github.com/seznam/ima/commit/3781a8066231c345ff33684a9c0965d3f67ee1ad))
* **viewadapter:** memoize react context value ([4795f76](https://github.com/seznam/ima/commit/4795f76b438509d475a721ca9375bdcf414ceb59))


### Code Refactoring

* **dictionary:** rename config language attribute ([90bc016](https://github.com/seznam/ima/commit/90bc01673fe2cdd977873465e6aaf71e93cd7df5))


### Features

* 🎸 Dependencies update ([8ca12f3](https://github.com/seznam/ima/commit/8ca12f3e1c5f63c733e39aaf63d1fcf6ada967ba))
* 🎸 added creating websocket server for hot reloading ([abbfd5c](https://github.com/seznam/ima/commit/abbfd5cd1da0884540af8eea9168030d9c835116))
* 🎸 added unlisten method and allow hot reloading ([1b5b465](https://github.com/seznam/ima/commit/1b5b46557d9104dc9525adc51e1159b3181239e6))
* added dependency check to create-ima-app ([#13](https://github.com/seznam/ima/issues/13)) ([6f485e5](https://github.com/seznam/ima/commit/6f485e59475ab513282cea96b740d0335dc86043))
* 🎸 Add Node.js v12 support ([#9](https://github.com/seznam/ima/issues/9)) ([77d23f8](https://github.com/seznam/ima/commit/77d23f85975f7efba219399d1c2ebaaef063bb44))
* 🎸 Split server and client bundle in vendors ([cda9a55](https://github.com/seznam/ima/commit/cda9a55eb5873919b63fd3bae860e083f00ec81b))
* 🎸 Initialize create-ima-app CLI tool ([#3](https://github.com/seznam/ima/issues/3)) ([8ed5f1c](https://github.com/seznam/ima/commit/8ed5f1c68dd852e4f12960029080edca0d892f3f))
* **cache:** support for Infinite value in cache ttl field ([5402312](https://github.com/seznam/ima/commit/5402312b5edd09f2267765db3c3157abfe7c4da2))
* **client:** removed server side code from client build ([4cb26e5](https://github.com/seznam/ima/commit/4cb26e52ac1864b3fdff32dd13f833aec3cac0ef))
* **devtool:** removed Devtool class and $Devtool alias from ima core ([21c2a7e](https://github.com/seznam/ima/commit/21c2a7e3a7db5ce3d5c4741af9a963abb90c7bd6))
* **helpers:** assignRecursivelyWithTracking tests ([2f42204](https://github.com/seznam/ima/commit/2f42204ac3e3fbe3c2bc1a2b251e91dee61dcb45))
* **helpers:** recursive assign with tracking ([508aaf1](https://github.com/seznam/ima/commit/508aaf13c273f314b3d91835e5cbed81d3b2dc93))
* **lifecyclemethod:** allow using async/await in life cycle method ([54f04bf](https://github.com/seznam/ima/commit/54f04bfc578d38fd0e8cef246c22a8be8c257e27))
* **namespace:** added set method to ns ([fd49e9a](https://github.com/seznam/ima/commit/fd49e9a2703126dab6c9f20888dfe3ed90300496))
* **page-renderer:** component utils lazy creation of instances ([61e31a1](https://github.com/seznam/ima/commit/61e31a185e8a59d103182b819823a4b6365d6de2))
* **pagemanager:** support for using async for load and update methods ([aaf9be5](https://github.com/seznam/ima/commit/aaf9be5711aff1a14614deffe5e294548d95064e))
* **pagerenderer:** added new renderer events MOUNTED,UPDATED,UNMOUNTED ([a493e6f](https://github.com/seznam/ima/commit/a493e6f9e09942523f23b2a78f2fa5009e3b3633))
* **transform:** context-api-v17 codemod, transform tests, jscodeshift ([369767b](https://github.com/seznam/ima/commit/369767b65a19ea56ee1680b6b76cc1cef6485f45))


### Performance Improvements

* ⚡️ Remove unnecessary fibers dependency from gulp-tasks ([dcbfa3c](https://github.com/seznam/ima/commit/dcbfa3c4011bc9ee24e416d6f46560595be21d65))
* **hydrate:** removed junk from hydrating app ([876c098](https://github.com/seznam/ima/commit/876c098abf922cf3566c2564ab7f1f6557926a38))


### BREAKING CHANGES

* **dictionary:** Rename config attribute from config.language to config.$Language in dictionary.
It's for keeping code style in configuration objects.
* getCurrentRouteInfo returns not-found instead exception if not-found
route is set
