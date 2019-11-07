# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [17.0.0-rc.1](https://github.com/seznam/ima/compare/v17.0.0-rc.0...v17.0.0-rc.1) (2019-11-07)

**Note:** Version bump only for package ima





# 17.0.0-rc.0 (2019-11-07)


### Bug Fixes

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

* **hydrate:** removed junk from hydrating app ([876c098](https://github.com/seznam/ima/commit/876c098abf922cf3566c2564ab7f1f6557926a38))


### BREAKING CHANGES

* **dictionary:** Rename config attribute from config.language to config.$Language in dictionary.
It's for keeping code style in configuration objects.
