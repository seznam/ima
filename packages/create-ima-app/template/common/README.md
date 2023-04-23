![IMA.js logo](https://imajs.io/img/logo.svg)

# IMA.js skeleton application

The IMA.js is an application development stack for developing isomorphic
applications written in pure JavaScript and React.

## Why we use IMA.js and you should too?

Here at [Seznam.cz](https://www.seznam.cz), development of a frontend application comes with many checkboxes that need to be ticked off before the project goes public. Mainly because of a diverse audience and a challenging product requirements.

In order to **not** reinvent the wheel on every project and to address all of these problems (checkboxes) we created the IMA.js framework. Here are a few outlines that we're most proud of:

- [X] **Isomorphic** - application logic is first executed at the server-side, generates the page markup, and then when the application logic is executed at the client-side it automatically binds to the server-generated markup and acts like a single-page application (or a multi-page application if the client does not support JavaScript). This allows for fast load times, out-of-box support for web crawlers and greater overall user experienc (or UX for short).
- [X] **React compatible** - IMA.js Views extend the React Component and are in tight cooperation with our Controllers. That means you can use the full magic of React v16 without loosing anything.
- [X] **Production ready** - there's no need for additional setup or configuration. IMA.js uses environment-specific configurations from the start.
- [X] **Battle tested** - IMA.js is used on various projects across Seznam.cz. Some of them pushing the limits of what a frontend application can do.

## Documentation

We have prepared a complex tutorial for you:
[Your first IMA.js application](https://imajs.io/tutorial/introduction).
This tutorial covers the basics of creating isomorphic web applications using
IMA.js, but you will encounter some more advanced concepts in there as well.

For a more in-depth information about the IMA.js see a [full documentation](https://imajs.io/docs).

## Main IMA.js parts
- [IMA core](https://github.com/seznam/ima/tree/master/packages/core) - it contains base classes and common classes for every days work which allow you server side rendering and hydrating application in browser.
- [IMA server](https://github.com/seznam/ima/tree/master/packages/server) - it contains methods which allow you connect IMA application with express framework.
- [IMA bundle](https://github.com/seznam/ima/tree/master/packages/gulp-tasks) - IMA.js use for bundling and automation gulp. There are prepared common tasks and base configuration.

## Plugins
Here's a list of plugins maintained by Seznam.cz and other contributors that you can safely use in your app:
- [Abstract analytic](https://github.com/seznam/IMA.js-plugin-analytic)
- [Google analytic](https://github.com/seznam/IMA.js-plugin-analytic-google)
- [3rd party scripts loader](https://github.com/seznam/IMA.js-plugin-script-loader)
- [3rd party styles loader](https://github.com/seznam/IMA.js-plugin-style-loader)
- [REST-API Client](https://github.com/jurca/IMA-plugin-rest-client)
- [XHR](https://github.com/seznam/IMA.js-plugin-xhr) *(This is not a replacement for the fetch API that IMA.js uses by default.)*
- [UI Atoms](https://github.com/seznam/IMA.js-ui-atoms)
- [Extra-props selector](https://github.com/seznam/IMA.js-plugin-select)
- [Self XSS](https://github.com/seznam/IMA.js-plugin-self-xss)
