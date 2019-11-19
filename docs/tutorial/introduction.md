---
layout: "tutorial"
---
# 1. Introduction

---

## Your first IMA.js application

In this tutorial we will build our first IMA.js web application - a simple
guest book which will list the posts left by other visitors and allow us to
write new posts.

Through the course of this turorial, we will work with
[git](http://git-scm.com/), [gulp](http://gulpjs.com/),
[ES2015 (ES6)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/New_in_JavaScript/ECMAScript_6_support_in_Mozilla),
[Less CSS](http://lesscss.org/) and
[React](https://facebook.github.io/react/). Feel free to familiarize yourself
with any of these tools upfront if you are not already. Don't worry though,
we'll take things slow and assume no prior knowledge of these tools in this
tutorial.

We do, however, assume that you are familiar with
JavaScript (ECMAScript 2015), the
[MVC pattern](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller),
and the
[Single-page application architecture (SPA)](http://en.wikipedia.org/wiki/Single-page_application).
Knowledge of an SPA framework such as [Angular](https://angularjs.org/) or
[Ember](http://emberjs.com/) is recommended, but not neccessary.

We also assume that you have [Node.js](https://nodejs.org/) with NPM (the
current version is recommended) and a Git client installed on your computer.

This tutorial has been written for IMA.js version 0.13.0. If there is a newer
version available, some things may be slightly different, but we'll do our best
to update this tutorial ASAP.

### Setup

First we need to fetch the IMA.js application stack using git. So open up a
terminal and run the following command:

```
git clone https://github.com/seznam/IMA.js-skeleton.git
```

Now switch to the new directory:

```
cd IMA.js-skeleton
```

Before continuing, we may want to install some tools globally (this step is
optional). Run the following command to install [gulp](http://gulpjs.com/)
(you may need to use `sudo` on Linux):

```
npm install --global gulp
```

We can now install our local dependencies:

```
npm install
```

With our dependencies installed, we can now install a "hello world" demo web
application that will provide us with the basic directory structure:

```
npm run app:hello
```

To finish our setup, we will start a development server that will allow us to
see our application in action.

But enough talk, let's start the development server:

```
npm run dev
```

You can view the basic "hello world" application be opening
[`http://localhost:3001/`](http://localhost:3001/) in your browser.

The dev server will keep running in the background, watching for any changes to
the project files we will do, and reload the app, allowing us the see the
result in the browser without having to restart to dev server.

If you'll happen to not see the changes you've made through this tutorial in
your browser, check whether the dev server did not crash or freeze (or didn't
pick up some new files). Should that happen, you can kill the server by
pressing `Ctrl+C` and restart it by running `npm run dev`. If you see an
error after you restarted the dev server, check your source code. The error
should hint you what to look for and where to find the source of the trouble.

Finally, you may encounter the `ENOSPC` error when working with a large project
using a *nix OS. This can be fixed using the following code snippet ran from a
terminal
([source of the snippet here](http://stackoverflow.com/questions/16748737/grunt-watch-error-waiting-fatal-error-watch-enospc)):

```
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

If you want to, you may install the following extensions to Google Chrome to
have them reload the page whenever the server is ready so serve the updated
application:

- [LiveReload](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei)
  to reload the page
- [fb-flo](https://chrome.google.com/webstore/detail/fb-flo/ahkfhobdidabddlalamkkiafpipdfchp)
  to reload the CSS styles (configure the server port to 5888)

Additionally, if you want to, you may install the
[React inspector](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
to inspect your view with ease.

### Directories and files in your application

So let's take a look at the directories and files in our application and what
they do.

All files that are specific to our application are located in the `app`,
directory. The `package.json` file provides the `npm`  tool with information
about the dependencies of our application, `gulpConfig.js` configures our gulp tasks, and, finally,
the `gulpfile.js` loads the tasks we can run using the `gulp` tool.

You may have also noticed the `doc`, `build` and `server` directories. The
`doc` directory contains the documentation for IMA.js APIs and our application
rendered to HTML, while the `server` contains the application logic of the HTTP
server serving our application. Finally, the `build` directory is used as an
output directory for the built application and its resources.

Let's take a closer look at the contents of the `app` directory:

- `assets` - files that are preprocessed and copied to our built application,
  usually as static resources
  - `less` - Less CSS files defining common rules, overrides, macros, mixins
    and basic layout.
  - `static` - any files that do not need preprocessing (3rd party JS files,
    images, ...)
- `base` - directory for abstract classes providing default
  application-specific implementation of some of the abstract APIs, that are
  not related to the view. We usually use these to make our lives a little
  easier when working with our models and controllers. We will not utilize
  these during this tutorial, however.
- `component` - our React components for use in view. We'll cover those later
  in this tutorial. This directory should contain only classes related to the
  UI.
- `config` - configuration files. You don't need to worry about those right
  now, but feel free to study them.
- `page` - controllers, main views and page-specific Less CSS files for pages
  in our application. Usage of these is configured via routing.
  - `error` - page shown when the application encounters an error that prevents
    it from working properly.
  - `home` - the index (home) page, which we will modify into our guest book.
  - `notFound` - page shown when the user navigates to a page that is not
    defined in our application.

The `config` directory is required by the IMA.js (unless you configure IMA.js
to grab the files in these directories from a different location). The
remaining directories can be renamed or moved and you are free to organize your
files in any way you like (but you may have to update the configuration
accordingly in some cases).

So now that you know your way around the directory structure, let's do some
coding in the [part 2 of this tutorial](Tutorial,-part-2).
