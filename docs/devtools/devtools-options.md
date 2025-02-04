---
title: Options
description: Devtools > Available options and customization
---

![](/img/docs/devtools-options.png)

As we've already talked about in [the introduction section](./devtools-introduction), the devtools
use special devtools script which defines which parts of IMA.js application should send messages about
their activity to the IMA.js devtool panel. This code can be easily customized through the extension's options page.

You can get to this page either by clicking on **Settings button** in the devtool panel itself (_hidden behind the
"three dots" menu button_) or by mouse-right clicking on the extension icon in chrome toolbar
and choosing the "Options" button.

## Quick UI overview

Main concept of the options is that you can create multiple **presets**, where each preset contains a set of **hooks** -
these are snippets of JavaScript code, that define which parts of IMA.js app should be wrapped in previously mentioned
[proxies](./devtools-introduction.md#devtools-script).

> **Note:** Don't forget to always save your changes after doing any changes, otherwise the changes won't propagate.

### Presets modal window

You can create multiple presets or edit existing ones by clicking on the **"Load or Create Preset"** button, where
you're presented with Presets modal window. Selected presets are **marked bold**.

![](/img/docs/devtools-options-presets.png)

Notice that there's already a **Default** preset, which is not editable (but can be copied!). This preset
is read-only and you can't edit it directly. This is so in the future we can safely update the default detection script
without a need to worry about breaking your own code.

To create new preset or edit the default one, start by creating a blank preset by clicking on the **"Create Preset"**
button, or copy exiting one using the duplicate icon.

> **Note:** Changes to the presets are saved after closing the modal window.

## Hooks

![](/img/docs/devtools-options-hooks.png)

Each hook can be individually **enabled/disabled** and has it's own name, description and code. First three are pretty
self explanatory so we'll talk mostly about the **code** and available API.

First thing you need to understand is, that all hooks that are enabled, in whole active preset are concatenated and
basically copy & pasted into the devtools code, so they're part of the devtools code itself. This means that if you
have any error in any hook, **it can prevent the extension from working correctly**. To minimize the size of the extension
bundle and for the simplicity sake we don't include any syntax validation in the UI, so please keep mind on that.

> **Note:** As this code is injected to every web page with IMA.js present, you can use chrome devtools and it's debugger
>to debug and fix any potential issues with your hook's code.

### Available API

There are mainly **three functions** that you can (and probably will) use in your hooks:

#### 1. `aop(target, pattern)`

This is the main hooks function, which defines which `target` should be wrapped in what proxy, defined by `pattern`.

- `target` **\{Class}** - JavaScript @/object constructor that is wrapped in proxy.
- `pattern` **\{object}** - result of `createHook` function.

#### 2. `createHook(name, regular, callback)`

Helper function that defines proxies on methods that match `regular` regular expression. It's essentially used
in the **second argument** of `aop()` function.

- `name` **\{hookName}** - defines when the proxy content should be executed (e.g. event message sent to devtools).
- `regular` **\{(string\|function\|RegExp)}** - string or regexp that defines method names which should be wrapped in
   proxy or a function that returns true for given metadata.
- `callback` **\{function}** - callback that is executed, when proxy is called. Receives `meta` object as an argument.

Where `hookName` is defined as:

```javascript
const hookName = Object.freeze({
  beforeMethod: 'beforeMethod',
  afterMethod: 'afterMethod',
  aroundMethod: 'aroundMethod',
  beforeGetter: 'beforeGetter',
  afterGetter: 'afterGetter',
  aroundGetter: 'aroundGetter',
  beforeSetter: 'beforeSetter',
  afterSetter: 'afterSetter',
  aroundSetter: 'aroundSetter'
});
```

#### 3. `emit(identifier, meta, options, overrides = {})`

Helper function that sends passed in data to the devtools panel, while doing some pre-processing so the data
can be displayed properly. It is used **at the end of `createHook` callback function**.

- `identifier` **\{string}** - name identifying sent message displayed in devtool panel.
  By default it corresponds to the name of the wrapped class, but it can be overridden in the `options`.
- `meta` **\{object}** - metadata describing received event. They're automatically created as a callback parameter
  in the `createHook` function.
- `options` **\{object}** - additional options passed into the event payload. Currently only `{ color: 'color' }` is supported
  (for available colors, see below).
- `overrides`  **\{object}** - optional object with overrides, that is merged with the `meta` sent in second argument.

#### 4. `importIMAClass(path, module);`

Utility function, used to import modules from `$IMA.Loader.modules`, that can be used in creating your own
custom hooks.

- `path` **\{string}** - corresponds to absolute path to application's class from the `/app` directory. Or a package name
in case of npm package.
- `module` **\{?string}** - used for named exports, can be left blank in case of default exports.

### Message colors

Currently there are 13 colors (we're using the [Open Color](https://yeun.github.io/open-color/) color scheme),
that you can use to differentiate each hook with:

<table class="table is-bordered">
  <thead>
    <tr>
      <th>Name</th>
      <th>Color</th>
    </tr>
  </thead>
  <tbody>
  </tbody>
</table>

## Conclusion

You should by ok with the **default preset** for most cases but in case you head into defining a custom one, here are
some notes on this matter.

Defining **custom hooks** requires some more knowledge into the devtools that you can get by studying the devtool script to see how things work. We suggest to start by customizing the default set, changing few rules or splitting
existing hooks into more smaller ones, before heading in and defining whole new preset.
