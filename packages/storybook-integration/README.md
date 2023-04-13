<p align="center">
  <img height="130" src="https://imajs.io/img/imajs-logo.png">
</p>

<h1 align="center">@ima/storybook-integration</h1>
  <p align="center"><i>Storybook integration for IMA.js applications.
</p>

---

## Init Storybook

First init storybook inside your application using official [installation guide](https://storybook.js.org/docs/react/get-started/install/). **Skip babel init (installing dependencies and creating .babelrc) when asked, we replace babel with SWC.**

```bash
npx storybook@latest init
```

## Installation

```bash
npm install @ima/storybook-integration -D
```

## Usage

Register addon in config in `.storybook/main.js`. Optionally you can set custom language, for loading language files.

```js
const config = {
  // ...
  addons: [
    {
      name: "@ima/storybook-integration",
      options: {
        language: 'cs'
      }
    }
  ],
  // ....
};

export default config;
```
