= IMA.js skeleton application

The IMA.js is a application development stack for developing isomorphic
applications written in pure JavaScript.

Isomorphic applications consist of a single application logic that is first
executed at the server-side, generates the page markup, and then the
application logic is executed at the client-side, automatically binds to the
server-generated markup and acts like a single-page application (or a
multi-page application if the client does not support JavaScript). This allows
for fast load times, out-of-box support for web crawlers and greater overall
user experience (or UX for short).

== Installation

To install the IMA.js application development stack, start by cloning this git
repository:

```
git clone git@github.com:seznam/IMA.js-skeleton.git
git submodule init
git submodule update
```

Switch to the cloned `IMA.js-skeleton` directory and run the following commands
to set-up your application:

```
npm install -g gulp
npm install
gulp app:hello
gulp dev
```

These commands install the `gulp` tool locally, install the dependencies,
prepare the basic demo application and start the development server. Go ahead
and open `http://localhost:3001/` in your browser!

== Tutorial

The in-deep tutorial is being prepared and will be available shorty. For now,
keep tuned!

== IMA.js overview

IMA.js consists of several components:
- React for UI, which you should learn before you dive head-first into IMA.js
- Express.js as the web server, but you don't need to know express to use
  IMA.js
- ...and various little utilities you don't need to concern yourself with :)

The IMA.js is divided into the core library, which you'll use to build your
application, and the application server build on top of Express.js, that brings
your application to life.

The core library can be found in the `imajs/core/client` directory and you are
free to study the available APIs.

== Structure of your IMA.js application

You application resides in the `app` directory, so let's take a closer look at
the contents of the demo "hello world" application:

- `assets` - files preprocessed and copied to our build application for static
  access
  - `less` - Less CSS files defining common rules, overrides, macros, mixins
    and basic layout.
  - `static` - any files that do not need preprocessing (3rd party JS files,
    images, ...)
- `base` - base classes providing default implementation of some of the
  abstract APIs. We will use these to make our lives a little easier.
- `component` - our React components for use in view. We'll cover those later
  in this tutorial.
- `config` - configuration files. You don't need to worry about those right
  now, but feel free to study them.
- `locale` - localization files, providing localized phrases used in our
  application. This directory contains sub-directories for specific languages,
  each named after the
  [ISO 639-1](http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)
  two-character language code for the given language
- `page` - controllers, main views and page-specific Less CSS files for pages
  in our application. When is which page used is configurable.
  - `error` - page shown when the application encounters an error that prevents
    it from working properly
  - `home` - the index page, which we will modify into our guest book
  - `notFound` - page shown when the user navigates to a page that is not
    defined in our application

The `assets`, `config` and `locale` directories are expected by the IMA.js
application stack, the remaining directories can be renamed or moved an you are
free to organize your files in any way you like.

== Configuration

There are several configuration files in your IMA.js application:
- `app/build.js` specifies which JavaScript, JSX, Less CSS and language files
  your application consists of and in what order they should be included in
  your built application.
  The file also specifies which 3rd party bundled JavaScript and CSS files are
  to be included in your application.
- `app/vendor.js` sets references to any 3rd party vendor libraries to you
  `ns.Vendor` namespace in your application.
- `app/environment.js` configures the server-side environment. Notice that the
  `dev` and `test` environment configuration automatically inherits values from
  the `prod` environment.
- `app/config/services.js` specifies how fatal application errors should be
  handled at the client side.
- `app/config/routes.js` configures your router, mapping routes to the
  controllers and views in your application.
- `app/config/settings.js` configures your application and IMA.js services.
  Notice how, again, the `dev` and `test` environment configuration
  automatically inherits values from the `prod` environment.
- and finally, `app/config/bind.js` configures the object container (think of
  it as a more powerfull dependency injector) with the constants, dependencies
  of your classes and default implementors of interfaces. You can also create
  aliases for your classes and interfaces using the object container.

All of these files are neccessary and must remain in their locations.

== Other content

There are several directories we have not mentioned so far:
- `doc` contains the generated documentation of IMA.js and your application.
  The IMA.js relies on YUI doc for documentation building, and augments the YUI
  doc with support for several jsdoc-specific annotations.
- `build` contains your build application. All files are generated, so any
  changes you make will be automatically discarded once the application is
  rebuilt.
- `imajs/examples` contains the example IMA.js application for you to study.
  You can install any of the examples into your skeleton application by running
  the `gulp app:(name of the example)` command.
- `imajs/server` contains the application server. You will most likely won't
  have to concern yourself with these files, but feel free to study them or
  modify them if the need arises.
