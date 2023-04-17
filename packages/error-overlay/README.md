<p align="center">
  <img height="130" src="https://imajs.io/img/logo.svg">
</p>

<h1 align="center">@ima/error-overlay</h1>
  <p align="center"><i>Simple web component which provides UI around runtime and compile errors emitted through <code>@ima/hmr-client</code> event emitter.</i>
</p>

---

It is used on server (injected in **server** error-view ejs template) and **client**. The `@ima/hmr-client` package takes care of the initialization of the web component on the client side.

## Description

The error overlay **tries to parse received errors** with the aid of utilities from `@ima/dev-utils` using available source maps and show original file contents snippet in order to aid with faster and simpler debugging when error occurs. When no source maps are available, the overlay at least falls back to the compiled sources.

There are currently only 2 types of error the overlay shows `runtime` and `compile`. Compile errors occur when webpack compilation fails, while runtime errors are caused by an error in the application itself.

## Usage:
Inject `overlay.js` script into the application (available in dist directory) and create web component element:
```html
<ima-error-overlay public-url="http://localhost:3101" server-error="" />
```
The component accepts 2 arguments:
- `public-url` - url of the `@ima/cli` dev server. The error overlay uses API of this dev server to download static files, their source maps and handle file opening in editor. Without this attribute the error-overlay functionality is very limited.
- `server-error` **(optional)** - JSON stringified error object. This is used to send an error data to the overlay on server-side in the error-view.

The web component injects it's **styles** into the `shadowDOM` in order to eliminate any possible conflicts with the application styles.

---

This package is part of the IMA.js application stack, see [imajs.io](https://imajs.io/) for more info about the whole project.
