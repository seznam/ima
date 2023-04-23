<p align="center">
  <img height="130" src="https://imajs.io/img/logo.svg">
</p>

<h1 align="center">@ima/docs</h1>
  <p align="center">The [imajs.io](https://imajs.io/) docs and API webpage source files.</i>
</p>

---

This website is built using [Docusaurus 2](https://docusaurus.io/). The markdown files used for the documentation pages are located at the root of this repository in the `docs` directory.

## Installation & Usage

```
npm i
```

### Local Development

```
npm run dev
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
npm run build
```

This command generates `api` markdown files from JSdoc comments parsed directly from the source code. Additionally it generates website static content into the `build` directory.

### Deployment

Using SSH:

```
USE_SSH=true npm run deploy
```

Not using SSH:

```
GIT_USER=<Your GitHub username> npm run deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
