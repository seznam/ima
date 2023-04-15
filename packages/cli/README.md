<p align="center">
  <img height="130" src="https://imajs.io/img/logo.svg">
</p>

<h1 align="center">@ima/cli</h1>
  <p align="center"><i><code>@ima/cli</code> takes care of building and running the IMA.js application in dev (watch) mode.</i>
</p>

---

Small CLI wrapper around webpack used to build and watch IMA.js applications during development. It takes care of generating webpack configurations and running webpack based on passed arguments and ima config.

It also leverages the `@ima/hmr-client` and `@ima/error-overlay` in dev environment to provide better developer experience.

For more information on how to customize ima apps though `ima.config.js` or how to use the CLI and define custom CLI plugins, [take a look at the documentation](https://imajs.io).

## Installation

```
npm install @ima/cli --save-dev
```


## Usage

```
npx ima dev
npx ima build
npx ima --help
```

---

This package is part of the IMA.js application stack, see [imajs.io](https://imajs.io/) for more info about the whole project.
