---
title: 'LESS Constants Plugin'
description: 'CLI > CLI Plugins and their API > LESS Constants Plugin'
---

Adds preprocessor which converts theme values defined in the JS file, to their **LESS variable counterparts**.

Can be used to share theme variables between JS and LESS files or even multiple npm packages to allow for easier overrides.

## Installation

```bash npm2yarn
npm install @ima/cli-plugin-less-constants -D
```

## Usage

First create new plugin instance in the `ima.config.js` file:

```js title=./ima.config.js
const { LessConstantsPlugin } = require('@ima/cli-plugin-less-constants');

/**
 * @type import('@ima/cli').ImaConfig
 */
module.exports = {
  plugins: [
    new LessConstantsPlugin({
      entry: './app/config/theme.js'
    })
  ],
};
```

### Create theme.js file with constants definitions

Then export your LESS JS constants from the provided entry file, using the available [`units` helper functions](./less-constants-plugin.md#units), imported from the CLI plugin:

```js title=./app/config/theme.js
import { units, media } from '@ima/cli-plugin-less-constants/units';

export default {
  bodyfontSize: units.rem(1),
  headerHeight: units.px(120),
  bodyWidth: units.vw(100),
  greaterThanMobile: media.maxWidthMedia(360, 'screen'),
  zIndexes: units.lessMap({
    header: 100,
    footer: 200,
    body: 1,
  }),
};
```

This produces the following output:

```less title=./build/less-constants/constants.less
@bodyfont-size: 1rem;
@header-height: 120px;
@body-width: 100vw;
@greater-than-mobile: ~"screen and (max-width: 360)";
@z-indexes: {
  header: 100;
  footer: 200;
  body: 1;
}
```

### Import generated `constants.less` in globals

Finally don't forget to import the generated `./build/less-constants/constants.less` file in your `./app/less/globals.less` to have the variables available in all LESS files automatically without explicit import.

```js title=./app/less/globals.less
@import "../../build/less-constants/constants.less";
```

### Usage in JavaScript

Since every unit returns [`Unit`](./less-constants-plugin.md#units) object, you can always access it's value through the `.valueOf()` method or use the CSS interpreted value by calling `.toString()`.

```jsx
import { headerHeight } from 'app/config/theme.js';

export default function ThemeComponent({ children, title, href }) {
  return (
    <div>
      Header height has an absolute value of: {headerHeight.valueOf()} {/* 120 */},
      while it's CSS value is: {headerHeight.toString()} {/* 120px */}
    </div>
  );
}
```

:::caution

The constants are generated only in the [`preProcess`](../cli-plugins-api.md#plugins-api) which **runs just ones before the compilation**. So make sure to restart the built manually, when you add any new constants, to allow for the regeneration of the `constants.less` file.

:::

## Options

```ts
new LessConstantsPlugin(options: {
  entry: string;
  output?: string;
});
```

### entry

> `string`

Path to the LESS constants JS file.

### output

> `string`

Optional custom output path, defaults to `./build/less-constants/constants.less`.


## Units

The plugin provides unit functions for almost every unit available + some other helpers. Each helper returns `Unit` object with following interface:

```ts
export interface Unit {
  valueOf: () => string;
  toString: () => string;
}
```
 - **Numeric values** - `em`, `ex`, `ch`, `rem`, `lh`, `rlh`, `vw`, `vh`, `vmin`, `vmax`, `vb`, `vi`, `svw`, `svh`, `lvw`, `lvh`, `dvw`, `dvh`, `cm`, `mm`, `Q`, `inches`, `pc`, `pt`, `px`, `percent`.
 - **Color values** - `hex`, `rgb`, `rgba`, `hsl`, `hsla`.
 - **Media queries** - `maxWidthMedia`, `minWidthMedia`, `minAndMaxWidthMedia`, `maxHeightMedia`, `minHeightMedia`.
 - **LESS map helper** - `lessMap` can be used to group together similar values in an "object-like" value.

### Custom units

If you're missing any additional helpers, you can always define your own, either custom ones (as long as they adhere to the `Unit` interface) or you can use the following helper:

```typescript
import { asUnit } from '@ima/cli-plugin-less-constants/units';

function asUnit(
  unit: string,
  parts: (string | number)[],
  template = '${parts}${unit}'
): Unit {
  return {
    __propertyDeclaration: true,

    valueOf(): string {
      return parts.length === 1 ? parts[0].toString() : this.toString();
    },

    toString(): string {
      return template
        .replace('${parts}', parts.join(','))
        .replace('${unit}', unit);
    },
  };
}
```
