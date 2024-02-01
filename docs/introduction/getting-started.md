---
title: Getting Started with IMA.js
description: 'Introduction > Resources to get started learning and using IMA.js'
---

The **IMA.js** is an application development stack for developing isomorphic applications written in pure JavaScript and React.
It helps you develop fully isomorphic JavaScript applications that behave consistently in many different environments with ease
using the provided tools and several [plugins](https://github.com/seznam/IMA.js-plugins) we already have available.

IMA.js development stack consists of many different components. Here's a summary of few of the main ones:
- [React](https://reactjs.org/docs/getting-started.html) for UI, which you should [learn before](https://reactjs.org/tutorial/tutorial.html) you dive head-first into IMA.js.
- [Express.js](http://expressjs.com/) as the web server, but you don't need to know express to use IMA.js.
- [Webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org/) and [Vite](https://vitejs.dev/) with various other tools which are used for building the application.
- And various little utilities you don't need to concern yourself with :).

:::info

The IMA.js is divided into the **core library**, which you'll use to build your
application, and the **application server** build on top of Express.js, that brings
your application to life.

:::

You can find the core and server library along with many other IMA.js related packages in our monorepo at
[https://github.com/seznam/ima](https://github.com/seznam/ima).

## Installation

To install and run your new IMA.js application, you can use our **`create-ima-app`** npm package.
Start by running following command:

```bash npm2yarn
npx create-ima-app my-app
```

:::tip

*([npx](https://www.npmjs.com/package/npx) comes with npm 5.2+ and higher, [see instructions for older npm versions](https://github.com/facebook/create-react-app#creating-an-app))*

:::

This will bootstrap your new application and install all dependencies. 

After the installation succeeds, run following commands to start your application:

```bash npm2yarn
cd my-app
npm run dev
```

Before going ahead, now that your application is running, you can either continue reading this documentation,
which describes many different parts of IMA.js in detail, take a direct look at the
 [API](../api/classes/ima_core.Bootstrap.md) or [**start with our tutorial**](./../tutorial/introduction.md).

### Available commands

Once you've initialized your new IMA.js project, following commands become available to you through npm.

- `npm run dev` - Starts development server in ES13 mode on [`http://localhost:3001/`](http://localhost:3001/). This will also start task in watch mode, so any changes you make to the source code are automatically re-builded.
- `npm run test` - Starts jest test runners.
- `npm run lint` - Runs eslint on your application source files. We've prepared pre-configured .eslintrc.js file which follows our IMA.js coding styles, but feel free to adjust this to your needs.
- `npm run build` - Builds your application. For more information *(see [Production use](#production-use))*.
- `npm run start` - Starts IMA.js server.

The new IMA [cli](https://imajs.io/cli/) brings more configuration for your application.

### Why should I use `create-ima-app` command?
Developing IMA.js application is fairly easy, but the initial setup process can be quite tiresome.
This tool aims to streamline this process, save your time and provide you with buildable
application with opinionated defaults that can be easily customized to your needs.

## Application structure

Running `npx create-ima-app my-app` command will create following directory structure:

```
my-app
├── app
│   ├── component
│   │   └── card
│   ├── config
│   │   ├── bind.js
│   │   ├── routes.js
│   │   ├── services.js
│   │   └── settings.js
│   ├── document
│   │   └── DocumentView.jsx
│   ├── less
│   │   ├── global.less
│   │   └── app.less
│   ├── page
│   │   ├── AbstractPageController.js
│   │   ├── error
│   │   ├── home
│   │   └── notFound
│   ├── public
│   │   ├── cards.json
│   │   ├── favicon.ico
│   │   └── ...
│   └─── main.js
└── server
│   ├── config
│   │   └── environment.js
│   ├── template
│   │   ├── 400.ejs
│   │   ├── 500.ejs
│   │   └── spa.ejs
│   └── app.js
│   └── server.js
├── LICENSE
├── README.md
├── ima.config.js
├── jest.config.json
├── jest.setup.js
├── jsConfig.json
├── package-lock.json
└── package.json
```

So let's take a closer look at the **contents of the application**:

- `app` - main application folder where all application source code is located.
  - `component` - our React components for use in the view. Components are
  covered in [part 3 of our tutorial](../tutorial/adding-some-state.md).
  - `config`, `environment.js` - configuration files. For more information see
  [Configuration](./configuration) page.
  - `less` - Less CSS files defining common rules, overrides, macros, mixins
    and the basic UI layout.
  - `page` - controllers, main views and page-specific Less CSS files for pages
    in our application. Usage of these is configured via routing.
    - `error` - the page shown when the application encounters an error that
      prevents it from working properly.
    - `home` - the index (home) page.
    - `notFound` - the page shown when the user navigates to a page that is not
      defined in our application.
  - `public` - files that are preprocessed and copied to `built/static/public/` for our build application,
    usually as static resources.

<!-- TODO The `assets` and `config` directories are **expected** by the IMA.js
application stack, the remaining directories can be renamed or moved and you
are free to organize your files in any way you like (but you will have to
update the configuration accordingly). -->

## Production use

If you want to deploy your IMA.js application to production, the installation is
similar to the dev environment. **To install the IMA.js application**, start by cloning your application git
repository on your production server:

```bash
git clone [your-application-git-repository]
```

Switch to the cloned directory and run the following commands to set-up your
application - same as in the development mode - and build it:

```bash npm2yarn
npm install
npm run build
```

Now after building your IMA.js application your server is ready to run it. You can start your application using the following command:

```bash npm2yarn
npm run start
```

Your application is now running at [`http://localhost:3001/`](http://localhost:3001/)
(unless configured otherwise).

<!-- TODO ### Building for SPA deployment

It is also possible to deploy your IMA.js application as an SPA (single-page
application). To do that, run the following command to build your application:

```bash npm2yarn
npm run build:spa
```

Your built application will be in the `build` directory, ready to deploy
to a HTTP server. -->
