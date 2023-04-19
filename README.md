<div align="center">
<img width="200" src="https://imajs.io/img/logo.svg" />
</div>

# IMA.js

[![Build Status](https://travis-ci.com/seznam/ima.svg?branch=master)](https://travis-ci.com/seznam/ima) [![dependencies Status](https://david-dm.org/seznam/ima/status.svg)](https://david-dm.org/seznam/ima)
[![Known Vulnerabilities](https://snyk.io/test/npm/ima/badge.svg)](https://snyk.io/test/npm/ima)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

The IMA.js is an application development stack for developing isomorphic
applications written in pure JavaScript and React.

## Why we use IMA.js and you should too?

Here at [Seznam.cz](https://www.seznam.cz), development of a frontend application comes with many checkboxes that need to be ticked off before the project goes public. Mainly because of a diverse audience and a challenging product requirements.

In order to **not** reinvent the wheel on every project and to address all of these problems (checkboxes), we have created the IMA.js framework. Here are a few outlines that we're most proud of:

- [X] **Isomorphic** - application logic is first executed at the server-side, generates the page markup, and when the application logic is executed at the client-side it automatically binds to the server-generated markup and acts like a single-page application (or a multi-page application if the client does not support JavaScript). This allows for fast load times, out-of-the-box support for web crawlers and greater overall user experience (or UX for short).
- [X] **React compatible** - IMA.js Views extend the React Component and are in tight cooperation with our Controllers. That means you can use the full magic of React v16 without loosing anything.
- [X] **Production ready** - there's no need for additional setup or configuration. IMA.js uses environment-specific configurations from the start.
- [X] **Battle tested** - IMA.js is used on various projects across Seznam.cz. Some of them pushing the limits of what a frontend application can do.

## Documentation

We have prepared a complex tutorial for you:
[Your first IMA.js application](https://imajs.io/tutorial/introduction).
This tutorial covers the basics of creating isomorphic web applications using
IMA.js, but you will encounter some more advanced concepts in there as well.

For a more in-depth information about the IMA.js see a [full documentation](https://imajs.io/docs) and more on [imajs.io](https://imajs.io).

## Main IMA.js parts
- **core** - it contains base classes and common classes for every day work which allows you server side rendering and hydrating application in browser.
- **server** - it contains methods which allow you  to connect IMA application with the express framework.
- **gulp-tasks** - IMA.js uses gulp for bundling and automatization. There are prepared common tasks and a base configuration.

## Plugins
See the [ima-plugins](https://github.com/seznam/IMA.js-plugins) repository for available IMA.js plugins.

## Getting Started
Initialize application skeleton with single command

```bash
npx create-ima-app
# or if you are using yarn
yarn create ima-app
```

and start the development!

```bash
cd create-ima-app
npm run dev
# or if you are using yarn
yarn dev
```

## Contributing

See [How to Contribute](https://imajs.io/contributing/how-to-contribute).
