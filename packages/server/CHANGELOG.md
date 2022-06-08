# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [18.0.0-rc.0](https://github.com/seznam/ima/compare/v17.12.3...v18.0.0-rc.0) (2022-05-26)


### Bug Fixes

* 🐛 Dev logger fixes ([dd93463](https://github.com/seznam/ima/commit/dd9346389da3f2f580ffaad1c344ec9911512b1f))
* 🐛 Fix dependency to build.js in urlParser ([604d05a](https://github.com/seznam/ima/commit/604d05a4d8d9d06ecd3ad41640c145e5e7c51e83))
* 🐛 Fixed doubling of runtime errors ([2c7cbab](https://github.com/seznam/ima/commit/2c7cbab8fbbc53b874c2bfcfc68537103f529aef))
* 🐛 Fixed handleError issues and incorrect dependencies ([bf8f7f6](https://github.com/seznam/ima/commit/bf8f7f628b4a77abff8a89306fbd1adf6bfb863a))
* 🐛 Fixed IMA.js SPA mode ([fbbffa2](https://github.com/seznam/ima/commit/fbbffa2c68557dcf27a9c89e1117bb4c3d543245))
* 🐛 Fixed lengthy server error processing ([a76f1cc](https://github.com/seznam/ima/commit/a76f1cc291da7e1c927180ee51e5ec44f67f0755))
* 🐛 Fixed PROD env, dev error handling ([8c987ff](https://github.com/seznam/ima/commit/8c987ff37e09884e3de8fff9c87f817291bc2a71))
* 🐛 Fixed reloading of locale files ([2f653d7](https://github.com/seznam/ima/commit/2f653d77d1865b5cb4fb321aeba3593bc1918a70))
* 🐛 Fixed server-side HMR ([19b9a24](https://github.com/seznam/ima/commit/19b9a24f59a1138a9ac767ce78b6d51d50b50dff))
* 🐛 Fixed server-side runtime errors ([b8512eb](https://github.com/seznam/ima/commit/b8512eb07c788432ea293c5d94d4486bb036b504))
* 🐛 Location of localized files ([b258e21](https://github.com/seznam/ima/commit/b258e21e3f29cea4f272f9142e4030689c34aa09))
* 🐛 Minor HMR error handling fixes ([1f15b7d](https://github.com/seznam/ima/commit/1f15b7d005e5aa7d9a572b74fa1b7ce17a8bf5b5))
* 🐛 Reverted back to using mini-css-extract-plugin by defaul ([c9da2f7](https://github.com/seznam/ima/commit/c9da2f7f41f2d2e264cd4205bf383716947112a3))
* 🐛 updated packagelocks ([c3d6ce1](https://github.com/seznam/ima/commit/c3d6ce1f8b4d224673793261f60469f3c840b096))


### Features

* 🎸 Added basic fast-refresh error-overlay interop ([6249ce9](https://github.com/seznam/ima/commit/6249ce98e89c7d5b6033e4ee5863614dd7c4f152))
* 🎸 Added dev server public, port and hostname options ([c68d150](https://github.com/seznam/ima/commit/c68d150eb7a69df8658dd04588aa622b0f696e76))
* 🎸 Added forceSPA flag to ima dev script ([adbdb70](https://github.com/seznam/ima/commit/adbdb707bc44ace0857f620da6b884ef2b2f718e))
* 🎸 Added new server 'dev' logger ([f928862](https://github.com/seznam/ima/commit/f92886247ab10cc64893ee40e0e9129324cde3c5))
* 🎸 Added stack frame mapping to original source ([58d0be7](https://github.com/seznam/ima/commit/58d0be70cc63de92075cdd30e693f5af7d4cb89a))
* 🎸 Better server init app errors handling ([7e9b28b](https://github.com/seznam/ima/commit/7e9b28b28ced86b8d59168a854c81b395a1f8f6d))
* 🎸 init Localize feature implementation ([daac90a](https://github.com/seznam/ima/commit/daac90acf4040b72f0ad3ec13fb1405b46d4497e))
* 🎸 Migrated from chalk to picocolors ([af67e8a](https://github.com/seznam/ima/commit/af67e8a4862603414b29f10d0e69a5216516dfe4))
* 🎸 Moved error-overlay feature behind $Debug flag ([f42d290](https://github.com/seznam/ima/commit/f42d290ec07c760af45ba8d071b40b5364c67cd4))
* 🎸 New stack-trace parser, moved all parsing to overlay ([a4ceef5](https://github.com/seznam/ima/commit/a4ceef54664bee6f1d075f2f2e16b0ea676946fe))
* 🎸 Replace imaLoader for app/main by refactored appFactory ([3297b7b](https://github.com/seznam/ima/commit/3297b7b294b0dc237fc11f64c8606480b9152b92))
* 🎸 SSR error page is now reloaded upon rebuild ([cecd001](https://github.com/seznam/ima/commit/cecd0010df337ca0343902503c76d0434fc351e9))
* 🎸 UI optimizations ([a059078](https://github.com/seznam/ima/commit/a059078ba3dbd07310d4e4ed8481ff48ad523d41))
* 🎸 Updated verdacio ([f0cdbbe](https://github.com/seznam/ima/commit/f0cdbbe65ae523c74e3ddaad655dc0c0a689413a))





## [17.12.2](https://github.com/seznam/ima/compare/v17.12.1...v17.12.2) (2022-02-07)

**Note:** Version bump only for package @ima/server





# [17.12.0](https://github.com/seznam/ima/compare/v17.11.3...v17.12.0) (2021-11-01)


### Features

* 🎸 Enable setting headers for redirects ([#141](https://github.com/seznam/ima/issues/141)) ([da0cb80](https://github.com/seznam/ima/commit/da0cb80d8719cd6b8811ceb62f7eb1e526e49193))





## [17.11.2](https://github.com/seznam/ima/compare/v17.11.1...v17.11.2) (2021-07-16)


### Bug Fixes

* 🐛 passing at least query params to error route ([#126](https://github.com/seznam/ima/issues/126)) ([6b1224e](https://github.com/seznam/ima/commit/6b1224edd28d4ff8e853d46e46ac2b9b4160da2e))





## [17.11.1](https://github.com/seznam/ima/compare/v17.11.0...v17.11.1) (2021-07-13)


### Bug Fixes

* 🐛 passing original params to not-found and error route ([#122](https://github.com/seznam/ima/issues/122)) ([131fb7f](https://github.com/seznam/ima/commit/131fb7fdb4d239c1efe49b9254ca1585e1b90315))





# [17.11.0](https://github.com/seznam/ima/compare/v17.10.0...v17.11.0) (2021-06-12)


### Bug Fixes

* 🐛 errorHandler middleware where app is next function ([37b5d51](https://github.com/seznam/ima/commit/37b5d5179ee2dea7a73498eb70141bbab43d9053))





# [17.9.0](https://github.com/seznam/ima/compare/v17.8.1...v17.9.0) (2021-03-21)

**Note:** Version bump only for package @ima/server





# [17.8.0](https://github.com/seznam/ima/compare/v17.7.10...v17.8.0) (2021-02-03)

**Note:** Version bump only for package @ima/server





## [17.7.9](https://github.com/seznam/ima/compare/v17.7.8...v17.7.9) (2020-12-08)

**Note:** Version bump only for package @ima/server





## [17.7.5](https://github.com/seznam/ima/compare/v17.7.4...v17.7.5) (2020-12-07)

**Note:** Version bump only for package @ima/server





## [17.7.3](https://github.com/seznam/ima/compare/v17.7.2...v17.7.3) (2020-08-14)

**Note:** Version bump only for package @ima/server





## [17.7.2](https://github.com/seznam/ima/compare/v17.7.1...v17.7.2) (2020-07-24)

**Note:** Version bump only for package @ima/server





# [17.7.0](https://github.com/seznam/ima/compare/v17.6.0...v17.7.0) (2020-05-28)


### Bug Fixes

* 🐛 Fix warning when using npm 6+ ([09b315a](https://github.com/seznam/ima/commit/09b315addf3ec6db8b8ff59b34c92aa017a0e562))





# [17.6.0](https://github.com/seznam/ima/compare/v17.5.3...v17.6.0) (2020-05-12)


### Features

* 🎸 Add Node 14 support ([75b9d8f](https://github.com/seznam/ima/commit/75b9d8f4adcc9b11fea5ebc3861ee6cea422e182))





# [17.5.0](https://github.com/seznam/ima/compare/v17.4.0...v17.5.0) (2020-03-02)


### Features

* 🎸 added overload server detection ([9cfac61](https://github.com/seznam/ima/commit/9cfac61c40c3df06ee6bb9145fd4eb7be1fc8a93))





# [17.4.0](https://github.com/seznam/ima/compare/v17.3.0...v17.4.0) (2020-01-09)

**Note:** Version bump only for package @ima/server





# [17.2.0](https://github.com/seznam/ima/compare/v17.1.1...v17.2.0) (2020-01-06)


### Features

* 🎸 the getBootConfig method is public ([db88f4d](https://github.com/seznam/ima/commit/db88f4d3bb121dc8ee463141ff50039fcf9d2d74))





## [17.0.1](https://github.com/seznam/ima/compare/v17.0.0...v17.0.1) (2019-12-06)

**Note:** Version bump only for package @ima/server





# [17.0.0](https://github.com/seznam/ima/compare/v17.0.0-rc.10...v17.0.0) (2019-12-06)

**Note:** Version bump only for package @ima/server





# [17.0.0-rc.9](https://github.com/seznam/ima/compare/v17.0.0-rc.8...v17.0.0-rc.9) (2019-12-04)


### Features

* 🎸 Dependencies update ([8ca12f3](https://github.com/seznam/ima/commit/8ca12f3e1c5f63c733e39aaf63d1fcf6ada967ba))





# [17.0.0-rc.7](https://github.com/seznam/ima/compare/v17.0.0-rc.6...v17.0.0-rc.7) (2019-11-28)


### Features

* 🎸 Add Node.js v12 support ([#9](https://github.com/seznam/ima/issues/9)) ([77d23f8](https://github.com/seznam/ima/commit/77d23f85975f7efba219399d1c2ebaaef063bb44))





# [17.0.0-rc.5](https://github.com/seznam/ima/compare/v17.0.0-rc.4...v17.0.0-rc.5) (2019-11-21)

**Note:** Version bump only for package @ima/server





# [17.0.0-rc.4](https://github.com/seznam/ima/compare/v17.0.0-rc.3...v17.0.0-rc.4) (2019-11-21)

**Note:** Version bump only for package @ima/server





# [17.0.0-rc.3](https://github.com/seznam/ima/compare/v17.0.0-rc.2...v17.0.0-rc.3) (2019-11-07)

**Note:** Version bump only for package @ima/server





# [17.0.0-rc.2](https://github.com/seznam/ima/compare/v17.0.0-rc.1...v17.0.0-rc.2) (2019-11-07)

**Note:** Version bump only for package @ima/server





# [17.0.0-rc.1](https://github.com/seznam/ima/compare/v17.0.0-rc.0...v17.0.0-rc.1) (2019-11-07)

**Note:** Version bump only for package @ima/server





# 17.0.0-rc.0 (2019-11-07)

**Note:** Version bump only for package @ima/server
