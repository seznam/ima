# IMA.js skeleton application

The IMA.js is an application development stack for developing isomorphic
applications written in pure JavaScript.

Isomorphic applications consist of a single application logic that is first
executed at the server-side, generates the page markup, and then the
application logic is executed at the client-side, automatically binds to the
server-generated markup and acts like a single-page application (or a
multi-page application if the client does not support JavaScript). This allows
for fast load times, out-of-box support for web crawlers and greater overall
user experience (or UX for short).

## Installation

To install the IMA.js application development stack, start by cloning this git
repository:

```
git clone https://github.com/seznam/IMA.js-skeleton.git
```

Switch to the cloned `IMA.js-skeleton` directory and run the following commands
to set-up your application:

```
git submodule init
git submodule update
```

```
npm install -g gulp
npm install
gulp app:hello
gulp dev
```

These commands install the [`gulp`](http://gulpjs.com/) command-line tool on
your computer, locally install the dependencies, prepare the basic demo
application and start the development server. Go ahead and open
[`http://localhost:3001/`](http://localhost:3001/) in your browser!

## Production use

If you want deploy your IMA.js application to production, the installation is similar like in dev enviroment.

To install the IMA.js application, start by cloning your application git
repository on your production server:
```
git clone https://github.com/seznam/IMA.js-skeleton.git // use your application repository url
```

Switch to the cloned directory and run the following commands
to set-up your application - same like in development mode:

```
git submodule init
git submodule update
```
```
npm install -g gulp
npm install
NODE_ENV=production gulp build
```

Now is your server ready for running IMA.js application.

Run it with the following command:

```
NODE_ENV=production node build/server.js
```
Your application is running on [`http://localhost:3001/`](http://localhost:3001/) (by default) now!

## Tutorial

We have prepared a complex tutorial for you:
[Your first IMA.js application](https://github.com/seznam/IMA.js-skeleton/wiki/Tutorial,-part-1).
This tutorial covers the basics of creating isomorphic web applications using
IMA.js, but you will encounter some more advanced concepts in there as well.

## IMA.js overview

IMA.js consists of several components:
- React for UI, which you should learn before you dive head-first into IMA.js
- Express.js as the web server, but you don't need to know express to use
  IMA.js
- ...and various little utilities you don't need to concern yourself with :)

The IMA.js is divided into the core library, which you'll use to build your
application, and the application server build on top of Express.js, that brings
your application to life.

The core library can be found in the `imajs/core/client` directory and we
encourage you to study the available APIs.

## Structure of your IMA.js application

You application resides in the `app` directory, so let's take a closer look at
the contents of the demo "hello world" application:

- `assets` - files that are preprocessed and copied to our built application,
  usually as static resources
  - `less` - Less CSS files defining common rules, overrides, macros, mixins
    and the basic UI layout.
  - `static` - any files that do not need preprocessing (3rd party JS files,
    images, ...)
- `base` - base classes providing default implementation of some of the
  abstract APIs. We can use these to make our lives a little easier in some
  cases.
- `component` - our React components for use in the view. We'll cover those
  in the tutorial.
- `config` - configuration files. You don't need to worry about those right
  now, but feel free to study them.
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

## Configuration

There are several configuration files in your IMA.js application:
- `gulpConfig.js` contains configuration for the gulp tasks we use to build and
  run your application.
- `karma.conf.js` is used to configure the
  [karma](http://karma-runner.github.io/0.13/index.html) test runner.
- `app/build.js` specifies which JavaScript, JSX, Less CSS and language files
  your application consists of and in what order they should be included in
  your built application.
  The file also specifies which 3rd party bundled JavaScript and CSS files are
  to be included in your application.
- `app/vendor.js` loads and sets references to any 3rd party vendor libraries
  to be linked to your application in the `ns.Vendor` namespace and the
  `app/vendor` ES2015 module.
- `app/environment.js` configures the server-side environment. Notice that the
  `dev` and `test` environment configuration automatically inherits values from
  the `prod` environment (except for the `$Language` which has to be configured
  individually).
- `app/config/services.js` specifies how the fatal application errors should be
  handled at the client side.
- `app/config/routes.js` configures your router, mapping routes to the
  controllers and views in your application.
- `app/config/settings.js` configures your application and IMA.js services.
  Notice how, again, the `dev` and `test` environment configuration
  automatically inherits values from the `prod` environment.
- and finally, the `app/config/bind.js` configures the object container (think
  of it as a more powerful dependency injector) with support for constants,
  managing dependencies of your classes and setting the default implementors of
  interfaces. You can also create aliases for your classes and interfaces using
  the object container.

All of these files are necessary and must remain in their locations.

## Other content

There are several directories we have not mentioned so far:
- `doc` contains the generated documentation of IMA.js and your application.
  The IMA.js relies on [YUI doc](http://yui.github.io/yuidoc/) for
  documentation building, and augments the YUI doc with support for several
  [jsdoc](http://usejsdoc.org/)-specific annotations.
- `build` contains your built application. All files are generated, so any
  changes you make will be automatically discarded once the application is
  rebuilt.
- `imajs/examples` contains the example IMA.js applications for you to study.
  You can install any of the examples into your project skeleton by running
  the `gulp app:(name of the example)` command.
- `server` and `imajs/server` contain the application server. You will most
  likely won't have to concern yourself with these files, but feel free to
  study them or modify them if the need arises.
