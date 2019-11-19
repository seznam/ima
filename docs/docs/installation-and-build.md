---
layout: "docs"
---

# Installation & build

---

## Overview

Before the installation itself you should know what you're about to install.
Here's a summary of which components the IMA.js consists of:
- React for UI, which you should learn before you dive head-first into IMA.js
- Express.js as the web server, but you don't need to know express to use
  IMA.js
- ...and various little utilities you don't need to concern yourself with :)

The IMA.js is divided into the core library, which you'll use to build your
application, and the application server build on top of Express.js, that brings
your application to life.

You can find the core library at
[https://github.com/seznam/IMA.js-core](https://github.com/seznam/IMA.js-core),
while the server can be found at
[https://github.com/seznam/IMA.js-server](https://github.com/seznam/IMA.js-server).

## Installation

To install the IMA.js application development stack, start by cloning this git
repository:

```console
git clone https://github.com/seznam/IMA.js-skeleton.git

## Optionally - name the folder of your application as you want
git clone https://github.com/seznam/IMA.js-skeleton.git my-project-name
```

Switch to the cloned directory (`IMA.js-skeleton` or `my-project-name`) and run 
the following commands to set-up your application:

```console
npm install
npm run app:hello
npm run dev

## for older browser (IE11)
npm run dev --legacy-compat-mode
```

These commands install the dependencies locally, prepare the basic demo
application and start the development server. Go ahead and open
[`http://localhost:3001/`](http://localhost:3001/) in your browser!

Running `npm run dev` builds ES6 version of your app. Transpiling to ES5 happens only when you append `--legacy-compat-mode` flag or when running `npm run build` command *(see [Production use](#production-use))*.

You also may want to install the [`gulp`](http://gulpjs.com/) tool globally in
order to access all the available tools, examples and commands (you may need to
use `sudo` on a UNIX-like system):

```console
npm install -g gulp
```

You probably will have to install also [`node-gyp`](https://github.com/nodejs/node-gyp#installation) - follow the installation instructions for your operating system in the linked README.md.

You may also try other local demos by running either of the following commands:

`npm run app:feed` - [Demo](https://imajs.io/examples/feed) - [Source code](https://github.com/seznam/IMA.js-examples/tree/master/feed)

`npm run app:todos` - [Demo](https://imajs.io/examples/todos) - [Source code](https://github.com/seznam/IMA.js-examples/tree/master/todos)

## Application structure

After you've cloned the skeleton and installed one of our examples, your 
application will be located in the `app` directory, so let's take a closer look 
at the contents of the application:

- `assets` - files that are preprocessed and copied to our built application,
  usually as static resources.
  - `less` - Less CSS files defining common rules, overrides, macros, mixins
    and the basic UI layout.
  - `static` - any files that do not need preprocessing (3rd party JS files,
    images, ...)
- `base` - base classes providing default implementation of some of the
  abstract APIs. We can use these to make our lives a little easier in some
  cases.
- `component` - our React components for use in the view. Components are 
covered in [part 3 of our tutorial](Tutorial,-part-3).
- `config` - configuration files. You don't need to worry about those right
  now. When the time comes you'll find more references on the 
  [Configuration](Configuration) page.
- `locale` - localization files, providing localized phrases used in our
  application. This directory contains sub-directories for specific languages,
  each named after the
  [ISO 639-1](http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)
  two-character language code for the given language.
- `page` - controllers, main views and page-specific Less CSS files for pages
  in our application. Usage of these is configured via routing.
  - `error` - the page shown when the application encounters an error that
    prevents it from working properly.
  - `home` - the index (home) page.
  - `notFound` - the page shown when the user navigates to a page that is not
    defined in our application.

The `assets`, `config` and `locale` directories are expected by the IMA.js
application stack, the remaining directories can be renamed or moved and you
are free to organize your files in any way you like (but you will have to
update the configuration accordingly).

## Production use

If you want to deploy your IMA.js application to production, the installation is
similar to the dev enviroment.

To install the IMA.js application, start by cloning your application git
repository on your production server:

```console
git clone https://github.com/seznam/IMA.js-skeleton.git // use your application's repository
```

Switch to the cloned directory and run the following commands to set-up your
application - same as in the development mode:

```console
npm install
npm run build
```

Now your server is ready for running the built IMA.js application.

You can run your application using the following command:

```console
npm run start
```

Your application is now running at [`http://localhost:3001/`](http://localhost:3001/)
(unless configured otherwise).

### Building for SPA deployment

It is also possible to deploy your IMA.js application as an SPA (single-page
application). To do that, run the following command to build your application:

```console
npm run build:spa
```

Your built application will be in the `build` directory, ready for deployment
to an HTTP server.
