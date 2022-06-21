# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [18.0.0-rc.1](https://github.com/seznam/ima/compare/v18.0.0-rc.0...v18.0.0-rc.1) (2022-06-21)


### Features

* 🎸 Node 18 native fetch support ([#212](https://github.com/seznam/ima/issues/212)) ([69df0a3](https://github.com/seznam/ima/commit/69df0a3bf334217b051f2cb261adc572f0e5093c))





# [18.0.0-rc.1](https://github.com/seznam/ima/compare/v18.0.0-rc.0...v18.0.0-rc.1) (2022-06-21)


### Features

* 🎸 Node 18 native fetch support ([#212](https://github.com/seznam/ima/issues/212)) ([69df0a3](https://github.com/seznam/ima/commit/69df0a3bf334217b051f2cb261adc572f0e5093c))





# [18.0.0-rc.0](https://github.com/seznam/ima/compare/v17.12.3...v18.0.0-rc.0) (2022-05-26)


### Bug Fixes

* 🐛 Added misssing template dependency ([e05d835](https://github.com/seznam/ima/commit/e05d83593e153c90e77080d8c5a36765f245553c))
* 🐛 Added uknown error filter to hmr client ([38a5929](https://github.com/seznam/ima/commit/38a5929bb2b5fed457b3d486f15f44fe91f0cbae))
* 🐛 Benchmark fix ([7743870](https://github.com/seznam/ima/commit/774387046fdf54f1460c94d4b87d259a1d8dbfd8))
* 🐛 Correct npm registry in package-lock ([578881d](https://github.com/seznam/ima/commit/578881df74807be320e045d8b38b095745f32309))
* 🐛 Fix HMR disconnect on controller error ([3554457](https://github.com/seznam/ima/commit/35544577ca01b2d437bd936efff358cda4cdb987))
* 🐛 Fix localize from hook ([28c3f50](https://github.com/seznam/ima/commit/28c3f5080f210ac8f7270e2cea262aca9ea039a3))
* 🐛 Fix peer deps in benchmark ([8e94e8f](https://github.com/seznam/ima/commit/8e94e8f82eb45f5474c42ffcfe9bababc4ccb6dc))
* 🐛 fixed dev task ([a25466c](https://github.com/seznam/ima/commit/a25466c89267f171a9c5abec549e8c55d090f2c7))
* 🐛 Fixed doubling of runtime errors ([2c7cbab](https://github.com/seznam/ima/commit/2c7cbab8fbbc53b874c2bfcfc68537103f529aef))
* 🐛 Fixed IMA.js SPA mode ([fbbffa2](https://github.com/seznam/ima/commit/fbbffa2c68557dcf27a9c89e1117bb4c3d543245))
* 🐛 Fixed incorrect error handling in services.js ([cbdddc8](https://github.com/seznam/ima/commit/cbdddc8d6d4398c3f3f7956cadb8c2900e63911e))
* 🐛 HMR fixes ([3b9fafd](https://github.com/seznam/ima/commit/3b9fafd7637edc9ac52131fbd77749a40328dfe3))
* 🐛 Location of localized files ([b258e21](https://github.com/seznam/ima/commit/b258e21e3f29cea4f272f9142e4030689c34aa09))
* 🐛 Minor error reporting fixes ([94a53c8](https://github.com/seznam/ima/commit/94a53c8265312315eaaf912d3c294a2a0ac73a75))
* 🐛 Removed start script from CLI ([1de9631](https://github.com/seznam/ima/commit/1de96310f19ad7fcf6e981d1394b523e2f3f8bef))
* 🐛 Reverted mini-css-extract-plugin, native css is optional ([f00c359](https://github.com/seznam/ima/commit/f00c35909f9a8cb21319d00ce830b1075653afaf))
* 🐛 updated packagelocks ([c3d6ce1](https://github.com/seznam/ima/commit/c3d6ce1f8b4d224673793261f60469f3c840b096))
* 🐛 Verdacio fix ([c1709ff](https://github.com/seznam/ima/commit/c1709ff1399dc5459cce72bc020de693e8f442bc))
* 🐛 Verdacio fix take 4 ([24f3607](https://github.com/seznam/ima/commit/24f36071fd57483b538693a076914f9ce3032f75))
* broken test infrastructure for new create-ima-app apps ([#183](https://github.com/seznam/ima/issues/183)) ([53832c7](https://github.com/seznam/ima/commit/53832c79d83f7ed0532eb82abca1fcee0896a79a))


### Features

* 🎸 Added new @ima/dev-utils package ([77859dd](https://github.com/seznam/ima/commit/77859dd03b31ce948167b615a13416e69258d822))
* 🎸 Added new server 'dev' logger ([f928862](https://github.com/seznam/ima/commit/f92886247ab10cc64893ee40e0e9129324cde3c5))
* 🎸 Added nodemon for server-side changes reloading ([e2e55e8](https://github.com/seznam/ima/commit/e2e55e8df611f36b0f3c808aeaac49e950f48a70))
* 🎸 added postcss-loader ([d2a7bc4](https://github.com/seznam/ima/commit/d2a7bc48683afdfa7c52cafe0dd83af9b3911d3b))
* 🎸 Added profile option to production build ([ff6baf6](https://github.com/seznam/ima/commit/ff6baf66f38219c539a7d6c2b55c37abfaf6fe78))
* 🎸 Added support for react fast refresh ([d41363b](https://github.com/seznam/ima/commit/d41363b177098656fb2bbee671e90527e5c0c048))
* 🎸 Automatic react runtime ([66ef765](https://github.com/seznam/ima/commit/66ef765ce095474ef9f50c4207fb6bca23096993))
* 🎸 Better cache busting in default create-ima-app template ([ff2276f](https://github.com/seznam/ima/commit/ff2276fac6d970288ad973ad9c898fddc4243373))
* 🎸 Bundle performance, bundle splitting in dev ([c875ae9](https://github.com/seznam/ima/commit/c875ae9b79a5cadef98cd9625cd200fb55defe4f))
* 🎸 Hello example with init webpack build ([7bc7d68](https://github.com/seznam/ima/commit/7bc7d6870978fee9f776020cf52c86947b62a799))
* 🎸 Hidden swcMinimizer behind experimental flag ([16a68ac](https://github.com/seznam/ima/commit/16a68accbf5394658bf385020168f06f6d4fd0d5))
* 🎸 init Localize feature implementation ([daac90a](https://github.com/seznam/ima/commit/daac90acf4040b72f0ad3ec13fb1405b46d4497e))
* 🎸 Migrated from chalk to picocolors ([af67e8a](https://github.com/seznam/ima/commit/af67e8a4862603414b29f10d0e69a5216516dfe4))
* 🎸 Moved error-overlay feature behind $Debug flag ([f42d290](https://github.com/seznam/ima/commit/f42d290ec07c760af45ba8d071b40b5364c67cd4))
* 🎸 Server-side console compile error reporting ([1a5d988](https://github.com/seznam/ima/commit/1a5d98808e263f271d4b15fcda69a81beea55f0b))
* 🎸 Show localization in example ([5f8976a](https://github.com/seznam/ima/commit/5f8976a79f03d169ca8725acfbc0eeb306581658))
* 🎸 source-maps, global variables ([597ec8c](https://github.com/seznam/ima/commit/597ec8c93d5f0d8d5434529e25f835b628bc65cf))
* 🎸 UI, HMR, Compile error handling improvements ([96d49fb](https://github.com/seznam/ima/commit/96d49fb04fd06b58459add7427d59f0fd007bbbb))
* 🎸 Updated Hello(empty) template ([32eb318](https://github.com/seznam/ima/commit/32eb3185ab9c65d110f0388cf32a82fa3f510c8d))
* 🎸 WebpackManifestPlugin, es5 hot reload ([d8e1f85](https://github.com/seznam/ima/commit/d8e1f853fc666867c82676ff72497cc84fffa666))





## [17.12.3](https://github.com/seznam/ima/compare/v17.12.2...v17.12.3) (2022-03-10)

**Note:** Version bump only for package create-ima-app





## [17.12.2](https://github.com/seznam/ima/compare/v17.12.1...v17.12.2) (2022-02-07)

**Note:** Version bump only for package create-ima-app





## [17.12.1](https://github.com/seznam/ima/compare/v17.12.0...v17.12.1) (2021-12-09)

**Note:** Version bump only for package create-ima-app





# [17.12.0](https://github.com/seznam/ima/compare/v17.11.3...v17.12.0) (2021-11-01)

**Note:** Version bump only for package create-ima-app





## [17.11.3](https://github.com/seznam/ima/compare/v17.11.2...v17.11.3) (2021-08-27)

**Note:** Version bump only for package create-ima-app





## [17.11.2](https://github.com/seznam/ima/compare/v17.11.1...v17.11.2) (2021-07-16)

**Note:** Version bump only for package create-ima-app





## [17.11.1](https://github.com/seznam/ima/compare/v17.11.0...v17.11.1) (2021-07-13)

**Note:** Version bump only for package create-ima-app





# [17.11.0](https://github.com/seznam/ima/compare/v17.10.0...v17.11.0) (2021-06-12)


### Bug Fixes

* remove proxy limit in production ([81c6084](https://github.com/seznam/ima/commit/81c6084aaf80587fe0f1e007de485b980cde643f))





# [17.10.0](https://github.com/seznam/ima/compare/v17.9.0...v17.10.0) (2021-03-30)

**Note:** Version bump only for package create-ima-app





# [17.9.0](https://github.com/seznam/ima/compare/v17.8.1...v17.9.0) (2021-03-21)

**Note:** Version bump only for package create-ima-app





## [17.8.1](https://github.com/seznam/ima/compare/v17.8.0...v17.8.1) (2021-02-17)

**Note:** Version bump only for package create-ima-app





# [17.8.0](https://github.com/seznam/ima/compare/v17.7.10...v17.8.0) (2021-02-03)


### Features

* 🎸 added getTransactionStatePatches method ([5082fc1](https://github.com/seznam/ima/commit/5082fc11e03dd36abbe5793f8bbd7c2c72c3131e))





## [17.7.10](https://github.com/seznam/ima/compare/v17.7.9...v17.7.10) (2021-01-07)

**Note:** Version bump only for package create-ima-app





## [17.7.9](https://github.com/seznam/ima/compare/v17.7.8...v17.7.9) (2020-12-08)

**Note:** Version bump only for package create-ima-app





## [17.7.8](https://github.com/seznam/ima/compare/v17.7.7...v17.7.8) (2020-12-08)

**Note:** Version bump only for package create-ima-app





## [17.7.7](https://github.com/seznam/ima/compare/v17.7.6...v17.7.7) (2020-12-08)

**Note:** Version bump only for package create-ima-app





## [17.7.6](https://github.com/seznam/ima/compare/v17.7.5...v17.7.6) (2020-12-07)

**Note:** Version bump only for package create-ima-app





## [17.7.5](https://github.com/seznam/ima/compare/v17.7.4...v17.7.5) (2020-12-07)

**Note:** Version bump only for package create-ima-app





## [17.7.4](https://github.com/seznam/ima/compare/v17.7.3...v17.7.4) (2020-11-18)

**Note:** Version bump only for package create-ima-app





## [17.7.3](https://github.com/seznam/ima/compare/v17.7.2...v17.7.3) (2020-08-14)

**Note:** Version bump only for package create-ima-app





## [17.7.2](https://github.com/seznam/ima/compare/v17.7.1...v17.7.2) (2020-07-24)

**Note:** Version bump only for package create-ima-app





## [17.7.1](https://github.com/seznam/ima/compare/v17.7.0...v17.7.1) (2020-05-28)

**Note:** Version bump only for package create-ima-app





# [17.6.0](https://github.com/seznam/ima/compare/v17.5.3...v17.6.0) (2020-05-12)


### Features

* 🎸 Add Node 14 support ([75b9d8f](https://github.com/seznam/ima/commit/75b9d8f4adcc9b11fea5ebc3861ee6cea422e182))





## [17.5.3](https://github.com/seznam/ima/compare/v17.5.2...v17.5.3) (2020-04-16)

**Note:** Version bump only for package create-ima-app





## [17.5.2](https://github.com/seznam/ima/compare/v17.5.1...v17.5.2) (2020-03-19)

**Note:** Version bump only for package create-ima-app





## [17.5.1](https://github.com/seznam/ima/compare/v17.5.0...v17.5.1) (2020-03-16)

**Note:** Version bump only for package create-ima-app





# [17.5.0](https://github.com/seznam/ima/compare/v17.4.0...v17.5.0) (2020-03-02)


### Features

* 🎸 added overloadConcurrency property ([8c9cc5d](https://github.com/seznam/ima/commit/8c9cc5dca74faf942d6ac1768adbfb3f8b8d9c9e))





# [17.4.0](https://github.com/seznam/ima/compare/v17.3.0...v17.4.0) (2020-01-09)


### Features

* 🎸 updated dependencies, fixed repository in package-lock ([c01ac9f](https://github.com/seznam/ima/commit/c01ac9f612e398b18ddb3f2088070651932b54ad))
* added ima-devtools, ima-devtools-scripts ([7a7c475](https://github.com/seznam/ima/commit/7a7c475f5a81e215a36b5fd976049c99fa860c41))





# [17.3.0](https://github.com/seznam/ima/compare/v17.2.0...v17.3.0) (2020-01-08)

**Note:** Version bump only for package create-ima-app





# [17.2.0](https://github.com/seznam/ima/compare/v17.1.1...v17.2.0) (2020-01-06)

**Note:** Version bump only for package create-ima-app





## [17.1.1](https://github.com/seznam/ima/compare/v17.1.0...v17.1.1) (2019-12-20)

**Note:** Version bump only for package create-ima-app





# [17.1.0](https://github.com/seznam/ima/compare/v17.0.1...v17.1.0) (2019-12-11)

**Note:** Version bump only for package create-ima-app





## [17.0.1](https://github.com/seznam/ima/compare/v17.0.0...v17.0.1) (2019-12-06)

**Note:** Version bump only for package create-ima-app





# [17.0.0](https://github.com/seznam/ima/compare/v17.0.0-rc.10...v17.0.0) (2019-12-06)

**Note:** Version bump only for package create-ima-app





# [17.0.0-rc.10](https://github.com/seznam/ima/compare/v17.0.0-rc.9...v17.0.0-rc.10) (2019-12-05)

**Note:** Version bump only for package create-ima-app





# [17.0.0-rc.9](https://github.com/seznam/ima/compare/v17.0.0-rc.8...v17.0.0-rc.9) (2019-12-04)


### Features

* 🎸 Dependencies update ([8ca12f3](https://github.com/seznam/ima/commit/8ca12f3e1c5f63c733e39aaf63d1fcf6ada967ba))





# [17.0.0-rc.8](https://github.com/seznam/ima/compare/v17.0.0-rc.7...v17.0.0-rc.8) (2019-12-02)


### Bug Fixes

* 🐛 Implement new hot-reload plugin for all examples ([cc5d7bf](https://github.com/seznam/ima/commit/cc5d7bfbc231e4e87199da55fe1c5a3bfe95c1bf))


### Features

* added dependency check to create-ima-app ([#13](https://github.com/seznam/ima/issues/13)) ([6f485e5](https://github.com/seznam/ima/commit/6f485e59475ab513282cea96b740d0335dc86043))





# [17.0.0-rc.7](https://github.com/seznam/ima/compare/v17.0.0-rc.6...v17.0.0-rc.7) (2019-11-28)


### Features

* 🎸 Split server and client bundle in vendors ([cda9a55](https://github.com/seznam/ima/commit/cda9a55eb5873919b63fd3bae860e083f00ec81b))





# [17.0.0-rc.6](https://github.com/seznam/ima/compare/v17.0.0-rc.5...v17.0.0-rc.6) (2019-11-26)

**Note:** Version bump only for package create-ima-app





# [17.0.0-rc.5](https://github.com/seznam/ima/compare/v17.0.0-rc.4...v17.0.0-rc.5) (2019-11-21)

**Note:** Version bump only for package create-ima-app





# [17.0.0-rc.4](https://github.com/seznam/ima/compare/v17.0.0-rc.3...v17.0.0-rc.4) (2019-11-21)


### Features

* 🎸 Initialize create-ima-app CLI tool ([#3](https://github.com/seznam/ima/issues/3)) ([8ed5f1c](https://github.com/seznam/ima/commit/8ed5f1c68dd852e4f12960029080edca0d892f3f))
