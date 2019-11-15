![IMA.js logo](https://imajs.io/img/imajs-logo.png)

# IMA.js

[![Build Status](https://travis-ci.com/seznam/ima.svg?branch=master)](https://travis-ci.com/seznam/ima) [![dependencies Status](https://david-dm.org/seznam/ima/status.svg)](https://david-dm.org/seznam/ima)
[![Known Vulnerabilities](https://snyk.io/test/npm/ima/badge.svg)](https://snyk.io/test/npm/ima)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

The IMA.js is an application development stack for developing isomorphic
applications written in pure JavaScript and React.

## Why we use IMA.js and you should too?

Here at [Seznam.cz](https://www.seznam.cz), development of a frontend application comes with many checkboxes that need to be ticked off before the project goes public. Mainly because of a diverse audience and a challenging product requirements.

In order to **not** reinvent the wheel on every project and to address all of these problems (checkboxes) we created the IMA.js framework. Here are a few outlines that we're most proud of:

- [X] **Isomorphic** - application logic is first executed at the server-side, generates the page markup, and then when the application logic is executed at the client-side it automatically binds to the server-generated markup and acts like a single-page application (or a multi-page application if the client does not support JavaScript). This allows for fast load times, out-of-box support for web crawlers and greater overall user experienc (or UX for short).
- [X] **React compatible** - IMA.js Views extend the React Component and are in tight cooperation with our Controllers. That means you can use the full magic of React v16 without loosing anything.
- [X] **Production ready** - there's no need for additional setup or configuration. IMA.js uses evironment-specific configurations from the start.
- [X] **Battle tested** - IMA.js is used on various projects across Seznam.cz. Some of them pushing the limits of what a frontend application can do.

## Documentation

We have prepared a complex tutorial for you:
[Your first IMA.js application](https://github.com/seznam/IMA.js-skeleton/wiki/Tutorial,-part-1).
This tutorial covers the basics of creating isomorphic web applications using
IMA.js, but you will encounter some more advanced concepts in there as well.

For a more in-depth information about the IMA.js see a [full documentation](https://github.com/seznam/IMA.js-skeleton/wiki/Documentation).

## Main IMA.js parts
- **core** - it contains base classes and common classes for every days work which allow you server side rendering and hydrating application in browser.
- **server** - it contains methods which allow you connect IMA application with express framework.
- **gulp-tasks** - IMA.js use for bundling and automatisation gulp. There are prepared common tasks and base configuration.

## Plugins
See [ima-plugins](https://github.com/seznam/IMA.js-plugins) repository for available IMA.js plugins.

## Getting Started
Initialize application skeleton with single command.

```bash
npx create-ima-app
```

Load one of the web templates to get you started.

```bash
npm run app:hello
npm run app:feed
npm run app:todos
```

Start the development!

```bash
npm run dev
```

## Contributing

Contribute to this project via [Pull-Requests](https://github.com/seznam/ima/pulls).

We are following [Conventional Commits Specification](https://www.conventionalcommits.org/en/v1.0.0/#summary). To simplify the commit process, you can use `npm run commit` command. It opens an interactive interface, which should help you with commit message composition.
