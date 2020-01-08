---
layout: "docs"
title: "Docs - Devtools introduction"
---

With the introduction of IMA.js v17 we've implemented custom devtools that are available as a 
**Chrome extension**. Main purpose of these devtools is to provide developers with easy access
to debug and monitor IMA.js applications. 

The devtools works similarly to [kuker extension](https://github.com/krasimir/kuker).
This means that they display messages about method and event calls which are wrapped in a proxy like
object using custom script that gets injected to a page. You can then filter and look through received images
which can help you debug how each component behaves in your application.

The extension **requires no additional installation or dependencies** in your IMA.js application. It will
work with any IMA.js application from v17 and above. 

As of now it's only available to [**download**]() for **Chrome** in the [**Chrome web store**]().
~~~~
## How it works?

<div class="image is-padded-with-shadow">
  <img src="{{ '/img/docs/devtools-diagram.png?v=' | append: site.github.build_revision | relative_url }}" />
</div>

After you download and enable an IMA.js devtools extension, on **every page load** the extension starts injecting
very small script (that won't affect any functionality of other pages), which checks for the presence of IMA.js application.
The result of detection is then sent to the extension's **background** script.

In case an IMA.js application is **not detected**, the extension doesn't really do anything else.

In case **it is detected**, additionally to sending the result of detection to extension's **background** script,
the detection script does three more things:

1. It creates a special `$IMA.devtool.postMessage` function on `window`, which the devtool script uses to communicate
with chrome IMA.js devtool panel through `window.postMessage`.
2. Additionally, it modifies `$IMA.Runner`, which let's us register new `preRun` commands that are executed before
the original runners. This is used for the actual [devtools script](/docs/devtools-introduction#devtools-script).
3. The background script, upon receiving the `ALIVE` messages, creates initializes bi-directional communication bridge
between **content script** (where we listen on messages sent through `$IMA.devtool.postMessage` function) and IMA.js
devtool panel.

### Devtools script

The devtools script is an essential part of this browser extension. As we've already mentioned, it is registered
as a `preRun` command for the IMA.js application and it's executed before an actual runner scripts.

The devtools script uses [to-aop](https://www.npmjs.com/package/to-aop) npm package (which uses ES6 Proxies) to
wrap IMA.js app method calls in Proxy-like objects, which then before execution, send an information about it's
call, arguments and payload to the devtools panel. The panel then batch-processes these messages and displays them. 

It can be customized through extension's [options](/docs/devtools-options), where you can define what exactly
should be wrapped using proxies and how it should be pre-processed before sending it to the user. In the
[next section](/docs/devtools-ui) we're going to talk about the devtools UI and it's components. 
