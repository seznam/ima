---
title: Dictionary
description: Basic features > Dictionary and language features
---

Dictionary in IMA.js app serves many purposes. Simplest of them is keeping text strings out of component markup. More advanced one would be internationalization and in-text replacements.

## Configuration

First we need to tell IMA.js where to look for dictionary files. Naming convention of the files is up to you, but it should be clear what language are the files meant for and **glob pattern** has to be able to match path to the files. IMA.js **defaults to the following configuration:**

```js
languages: {
  cs: ['./app/**/*CS.json'],
  en: ['./app/**/*EN.json']
}
```

However you can easily override this settings in [ima.config.js](./../cli/ima.config.js.md#languages) (an example):

```javascript title="./ima.config.js"
module.exports = {
  languages: {
    cs: [
      './app/component/**/*CS.json',
      './app/page/**/*CS.json'
    ],
    en: [
      './app/component/**/*EN.json',
      './app/page/**/*EN.json'
    ],
    de: [
      './app/component/**/*DE.json',
      './app/page/**/*DE.json'
    ]
  }
}
```

### URL parser configuration

We also need to specify what language should be loaded. This is **done dynamically depending on current URL**. You can customize the URL patterns to language mapping in **environment settings**.

The configuration consists of simple key-value pairs, that are used for configuring the languages used with specific hosts or starting paths:

 - **`key`** - has to start with '//' instead of a protocol, and you can define the root path.
 - **`value`** - is a language to use when the key is matched by the current URL.

```js title="./server/config/environment.js"
module.exports = (() => ({
  prod: {
    $Language: {
      '//*:*/cs': 'cs', // https://ima-app.com/cs/custom-route
      '//*:*/en': 'en', // https://ima-app.com/en/custom-route
      '//*:*': 'cs', // https://ima-app.com/custom-route
    },
  }
}))();
```

#### `:language` placeholder

To make the language definition a bit easier for multilingua applications, you can use `:language` placeholder in following way:

```js title="./server/config/environment.js"
module.exports = (() => ({
  prod: {
    $Language: {
      '//*:*/:language': ':language', // https://ima-app.com/[en|cs]/custom-route
      '//*:*': 'cs', // https://ima-app.com/custom-route
    },
  }
}))();
```

### Language files

The [messageformat](http://messageformat.github.io/messageformat/) compiler, which processes our language files, expects .JSON files on the input. Contents of these files are objects, which can be nested into multiple levels. These levels are then represtend as a namespace `key` to the value in the dictionary.

```js title=./pollVoteEN.json
{
  "resultTitle": "Result of {name}:",
  "result": {
    "voted": "{count, plural, =0{Found no results} one{Found one result} other{Found # results} }",
    "reader": "{gender, select, male{He said} female{She said} other{They said} }",
  }
}
```

:::info

File name is used as a namespace for strings it defines. String defined under key `submit` in file `uploadFormCS.json` will be accessible under `uploadForm.submit`.

:::

## Usage

Every component and view extending `AbstractComponent` or `AbstractPureComponent` has access to `localize` method from within its instance. This method is alias to a `get` method from the Dictionary instance and takes 2 arguments:

 - **key** - namespace and name of the localization string -> if you have `resultTitle` string in file `pollVoteEN.json` the key to this string would be `pollVote.resultTitle`.
 - **parameters** - Optional object with replacements and parameters for [messageformat](http://messageformat.github.io/messageformat/) syntax. For more info about the syntax check out [ICU guide](http://userguide.icu-project.org/formatparse/messages).


```javascript
import { AbstractPureComponent } from '@ima/react-page-renderer';

class PollVote extends AbstractPureComponent {
  render() {
    return (
      <div>
        {this.localize('pollVote.resultTitle')}
        {this.localize('pollVote.result.voted', {count: 3})}
      </div>
    );
  }
}
```

:::tip

Use `useComponent().localize` or `useLocalize()` hooks in functional components.

```jsx
import { useComponent, useLocalize } from '@ima/react-page-renderer';

function PollVote() {
  // const { localize } = useComponent();
  const localize = useLocalize();

  return (
    <div>
      {localize('pollVote.resultTitle')}
      {localize('pollVote.result.voted', {count: 3})}
    </div>
  );
}
```

:::

## Messageformat library

For more information on the available selectors, formatters, and other details, please see [Format guide](http://messageformat.github.io/messageformat/guide/).

Dictionary is also registered in [Object Container](./object-container.md) and thus can be obtained in Controllers, Extensions and other classes constructed through OC.
