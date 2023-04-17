<p align="center">
  <img height="200" src="https://imajs.io/img/logo.svg">
</p>

# Create IMA.js App
Create IMA.js applications easily with simple command.

#### Documentation

We have prepared a complex tutorial for you:
[Your first IMA.js application](https://imajs.io/tutorial/introduction).
This tutorial covers the basics of creating isomorphic web applications using
IMA.js, but you will encounter some more advanced concepts in there as well.

For a more in-depth information about the IMA.js see a [full documentation](https://imajs.io/docs) and more on [imajs.io](https://imajs.io/docs).

## Quickstart
```shell
npx create-ima-app my-app
cd my-app
npm run dev
```
`npx` comes with npm 5.2+ and higher. For earlier versions simply install `create-ima-app` globally and continue as before.
```shell
npm install -g create-ima-app my-app
create-ima-app my-app
```
Then open [http://localhost:3001/](http://localhost:3001/) to see your application. When you're ready to deploy your application, run `npm run build` to create production-ready minified bundle in `build/` directory.

## Getting started
**Node >= 8** is required for the installation. You can use [nvm](https://github.com/nvm-sh/nvm) to easily manage your local node version. To create new app you can choose one of the following methods based on your preferences.

### npm
```shell
npm init ima-app my-app
```
### npx
```shell
npx create-ima-app my-app
```
### yarn
```shell
yarn create ima-app my-app
```

This will install all needed dependencies and create following directory structure inside `./my-app` directory.
```
my-app
├── LICENSE
├── README.md
├── app
│   ├── assets
│   │   ├── less
│   │   └── static
│   ├── build.js
│   ├── component
│   │   └── document
│   ├── config
│   │   ├── bind.js
│   │   ├── routes.js
│   │   ├── services.js
│   │   └── settings.js
│   ├── environment.js
│   ├── main.js
│   └── page
│       ├── AbstractPageController.js
│       ├── error
│       ├── home
│       └── notFound
├── gulpConfig.js
├── gulpfile.js
├── jest.config.json
├── jest.setup.js
├── package-lock.json
├── package.json
└── server
    └── server.js
```

## Available commands
Once you've created your new IMA.js project, following commands become available to you through npm.

#### `npm run dev`
To start development server on [http://localhost:3001/](http://localhost:3001/). This will also start gulp tasks in watch mode, so any changes you make to the source code are automatically re-builded.

#### `npm run test`
To start jest test runners.

#### `npm run lint`
To run eslint on your application source files. We've prepared pre-configured `.eslintrc.js` file which follows our IMA.js coding styles, but feel free to adjust this to your needs.

#### `npm run build`
To build your application.

#### `npm run start`
To start IMA.js server.

## Why use this?
Developing IMA.js application is fairly easy, but the initial setup process can be quite tiresome. This tool aims to streamline this process, save your time and provide you with buildable application with opinionated defaults that can be easily customized to your needs.
