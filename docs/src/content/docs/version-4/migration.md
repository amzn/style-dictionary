---
title: Migration Guidelines
sidebar:
  order: 2
---

Version 4 of Style-Dictionary comes with a good amount of breaking changes compared to version 3.

In this document, we will outline those breaking changes, ordered from most impactful to least.
Before and after examples are added to enable you to adjust your code to account for the changes.

## ES Modules instead of CommonJS

There are different ways to write JavaScript, NodeJS came up with CommonJS format and later browsers brought ES Modules format which NodeJS also supports.
ES Modules is nowadays considered the modern way to write JavaScript, NodeJS/Browser interoperability being only 1 of many reasons for that.

Therefore, in version 4, Style Dictionary has been entirely rewritten in ES Modules, in a way that is browser-compatible out of the box, allowing you to run it in many more places compared to before.

What this means for you is that if you are using Style Dictionary in a CommonJS project, you will have to either:

- convert your project to ESM by putting `"type": "module"` in your `package.json` and migrating your JS files to be ESM format. Note that you usually can still [import CommonJS dependencies](https://nodejs.org/api/module.html#modulecreaterequirefilename) from ESM files, although this is not possible in browser environments.
- use `.mjs` extension for your Style Dictionary consuming code, but keep the rest of your project as CommonJS.
- dynamically import Style Dictionary into your CommonJS files `const StyleDictionary = (await import('style-dictionary')).default;`
- use a bundler tool that allows ESM / CommonJS interoperability, meaning you can combine both syntaxes. If I'm not mistaken, [bun](https://bun.sh/) (NodeJS alternative) supports that by default

The above options are ordered, the top being the option we recommend the most, but this ordering is highly subjective.

```js title="build-tokens.js" del={1} ins={2}
const StyleDictionary = require('style-dictionary');
import StyleDictionary from 'style-dictionary';
```

## Instantiating Style Dictionary

Style Dictionary has become a class now in version 4 rather than just a regular JS object.
This means that you can create instances using the `new` class instantiator keyword.

Due to ES Modules being asynchronous by nature, you will need to `await` initialization before you can access properties such as the `tokens` on the instance.

`.extend()` method is still available on Style Dictionary instances if you want to create an instance (extend) from another instance.\
[See the extend docs](/reference/api#extend).

```js title="build-tokens.js" del={1,4} ins={2,5-6}
const StyleDictionary = require('style-dictionary');
import StyleDictionary from 'style-dictionary';

const sd = StyleDictionary.extend('config.json');
const sd = new StyleDictionary('config.json');
await sd.hasInitialized;

console.log(sd.tokens);
```

## Asynchronous API

There are a couple of reasons for making most of Style Dictionary's methods asynchronous but the 2 most important reasons are:

- ES Modules are asynchronous by nature, so many of the internal processes such as importing a config or token file are now async, causing other methods to become async as well by extension.
- Hooks now support asynchronous methods, to make them easier to work with. Example: you may want to run Prettier on your output files in your custom format, Prettier recently became async which means your format function would need to be async as well.

The following StyleDictionary class methods are now async:

- `extend()`
- `exportPlatform()`
- `getPlatform()`
- `buildAllPlatforms()`
- `buildPlatform()`
- `cleanAllPlatforms()`
- `cleanPlatform()`
- `extend()`

All hooks now support async functions as well, this should not be a breaking change for users since sync is also still supported.

```js title="build-tokens.js" del={7-8} ins={4,9-10}
import StyleDictionary from 'style-dictionary';

const sd = new StyleDictionary({ source: ['tokens.json'], platforms: {} });
await sd.hasInitialized;
console.log(sd.allTokens);

sd.cleanAllPlatforms();
sd.buildAllPlatforms();
await sd.cleanAllPlatforms();
await sd.buildAllPlatforms();
```

One exception is our `fileHeader` format helper utility, this is now an async function to support async fileHeaders.

```js title="build-tokens.js" del={9,13} ins={10,14-15}
import StyleDictionary from 'style-dictionary';

// yes, this is another breaking change, more on that later
import { fileHeader } from 'style-dictionary/utils';

StyleDictionary.registerFormat({
  name: 'custom/css',
  // this can be async now, usually it is if you use fileHeader format helper, since that now always returns a Promise
  formatter: function ({ dictionary, file, options }) {
  formatter: async function ({ dictionary, file, options }) {
    const { outputReferences } = options;
    return (
      fileHeader({ file }) +
      // this helper is now async! because the user-passed file.fileHeader might be an async function
      (await fileHeader({ file })) +
      ':root {\n' +
      formattedVariables({ format: 'css', dictionary, outputReferences }) +
      '\n}\n'
    );
  },
});
```

## CTI reliance

[CTI or Category / Type / Item](/info/tokens/#category--type--item) used to be the default way of structuring design tokens in Style Dictionary.
Often, what type of token a token is, would be determined by looking at the "category" part of the token taxonomy.
Most of the [Built-in transforms](/reference/hooks/transforms/predefined) `matcher` function would rely on the token's `attributes.category` property.
This in turn would rely on applying the [`attribute/cti` transform](/reference/hooks/transforms/predefined#attributecti) so that this attribute was set on a token.

In version 4, we have removed almost all hard-coupling/reliances on CTI structure and instead we will look for a `token.type` property to determine what type of token a design token is.
This aligns more with the [Design Token Community Group draft specification](https://design-tokens.github.io/community-group/format/) for standardizing design tokens JSON format.

```json title="tokens.json" ins={3-4,7} ""type": "color""
{
  "color": {
    // <-- this no longer needs to be "color" in order for
    // the tokens inside this group to be considered of type "color"
    "red": {
      "value": "#FF0000",
      "type": "color"
    }
  }
}
```

Additionally, the following transforms have changed:

- Built-in name transforms are now reliant only on the token path, and are renamed from `name/cti/casing` to just `name/casing`. `name/ti/camel` and `name/ti/constant` have been removed. For example `name/cti/kebab` transform is now `name/kebab`.
- Transform `content/icon` has been renamed to `html/icon` since it targets HTML entity strings, not just any icon content.
- `font/objC/literal`, `font/swift/literal` and `font/flutter/literal` have been removed in favor of `content/objC/literal`, `content/swift/literal` and `content/flutter/literal`, as they do he exact same transformations.

```json title="config.json" del={6,8,10,12,14,16-18} ins={7,9,11,13,15}
{
  "source": ["tokens.json"],
  "platforms": {
    "css": {
      "transforms": [
        "name/cti/camel",
        "name/camel",
        "name/cti/kebab",
        "name/kebab",
        "name/cti/snake",
        "name/snake",
        "name/cti/human",
        "name/human",
        "name/cti/human",
        "name/human",
        "font/objC/literal",
        "font/swift/literal",
        "font/flutter/literal"
      ]
    }
  }
}
```

## Package Entrypoints

We've adopted [package entrypoints](https://nodejs.org/api/packages.html#package-entry-points), which is also referred to as export maps.

What this means is, our `package.json` contains the following:

```json
{
  "exports": {
    ".": "./lib/StyleDictionary.js",
    "./fs": {
      "node": "./lib/fs-node.js",
      "default": "./lib/fs.js"
    },
    "./utils": "./lib/utils/index.js",
    "./types": "./types/index.d.ts"
  }
}
```

This allows Style Dictionary consumers to only import from those 4 entrypoints specified:

```ts
import StyleDictionary from 'style-dictionary';
import { usesReferences } from 'style-dictionary/utils';
import { fs, setFs } from 'style-dictionary/fs';
import type { DesignToken } from 'style-dictionary/types';
```

Any other imports e.g. directly from a file path is disallowed and most modern package entrypoints supporting tools will not let you import from them.
This sets a clear and explicit boundary between what is considered public API versus private API, and prevents accidentally running into breaking changes in the future.

Due to not allowing to import from file paths directly anymore, this is considered a breaking change.

:::note
In order for your imports to work at all with package entrypoints, the tool you use for resolving bare import specifiers must have package entrypoints.\
If you use `TypeScript` for example, you will need [`moduleResolution`](https://www.typescriptlang.org/tsconfig#moduleResolution) set to either `'nodenext'`, `'node16'` or `'bundler'`.\
For `Rollup`, you will need [`@rollup/plugin-node-resolve`](https://github.com/rollup/plugins/tree/master/packages/node-resolve/#readme).\
For `Webpack`, you will need version 5 at minimum.\
For `Vite`, version 3.
:::

## Format Helpers

We moved the format helpers away from the StyleDictionary module/class into the utils entrypoint, for consistency in our API.

```js title="build-tokens.js" del={1,3-4} ins={2}
import StyleDictionary from 'style-dictionary';
import { fileHeader, formattedVariables } from 'style-dictionary/utils';

const { fileHeader, formattedVariables } = StyleDictionary.formatHelpers;
```

## Types

Style Dictionary is entirely strictly typed now, and there will be `.d.ts` files published next to every file, this means that if you import from one of Style Dictionary's entrypoints, you automatically get the types implicitly with it. This is a big win for people using TypeScript, as the majority of the codebase now has much better types, with much fewer `any`s.

If you need to import some specific type interfaces separately, you can do so from the `style-dictionary/types` entrypoint.

```js title="build-tokens.js" del={1,3-5} ins={2}
import StyleDictionary from 'style-dictionary';
import type { DesignToken, Transform } from 'style-dictionary/types';

declare type DesignToken = StyleDictionary.DesignToken;
declare type Transform = StyleDictionary.Transform;
```

[`typescript/module-declarations` format](/reference/hooks/formats/predefined#typescriptmodule-declarations) is updated with current DesignToken type interface, and type interface changes are technically always breaking, which is why it's mentioned here.

## Reference utils

Our reference utilities are now available from `style-dictionary/utils` entrypoint rather than attached to your StyleDictionary instance.
We've also updated the function signatures of the reference utilities to address this change and make them easier to reuse as well as more consistent in their APIs.

```js title="build-tokens.js" del={9,11} ins={2,10,12}
import StyleDictionary from 'style-dictionary';
import { usesReferences, getReferences } from 'style-dictionary/utils';

StyleDictionary.registerFormat({
  name: `myCustomFormat`,
  formatter: function({ dictionary }) {
    return dictionary.allTokens.map(token => {
      let value = JSON.stringify(token.value);
      if (dictionary.usesReference(token.original.value)) {
      if (usesReferences(token.original.value, dictionary.tokens)) {
        const refs = dictionary.getReferences(token.original.value);
        const refs = getReferences(token.original.value, dictionary.tokens);
        refs.forEach(ref => {
          value = value.replace(ref.value, function() {
            return `${ref.name}`;
          });
        });
      }
      return `export const ${token.name} = ${value};`
    }).join(`\n`)
  }
});
```

In addition, we've added a [resolveReferences](/reference/utils/references#resolvereferences) utility to make it easy to get the resolved value of a token.

## OutputReferences function

We now allow specifying a `function` for `outputReferences`, conditionally outputting a ref or not per token.
We also published an [`outputReferencesFilter` utility function](/reference/utils/references#outputreferencesfilter) which will determine whether a token should be outputting refs based on whether those referenced tokens were filtered out or not.

If you are maintaining a custom format that allows `outputReferences` option, you'll need to take into account that it can be a function, and pass the correct options to it.

```js title="build-tokens.js" del={12} ins={13-17}
StyleDictionary.registerFormat({
  name: 'custom/es6',
  formatter: async (dictionary) => {
    const { allTokens, options, file } = dictionary;
    const { usesDtcg } = options;

    const compileTokenValue = (token) => {
      let value = usesDtcg ? token.$value : token.value;
      const originalValue = usesDtcg ? token.original.$value : token.original.value;

      // Look here 👇
      const shouldOutputRefs = outputReferences && usesReferences(originalValue);
      const shouldOutputRefs =
        usesReferences(original) &&
        (typeof options.outputReferences === 'function'
          ? outputReferences(token, { dictionary, usesDtcg })
          : options.outputReferences);

      if (shouldOutputRefs) {
        // ... your code for putting back the reference in the output
        value = ...
      }
      return value;
    }
    return `${allTokens.reduce((acc, token) => `${acc}export const ${token.name} = ${compileTokenValue(token)};\n`, '')}`;
  },
});
```

## Logging

Logging has been redesigned a fair bit and is more configurable now, [see Logging docs](/reference/logging).
Instead of only being able to specify `log: "error"` to change the default behavior of the logging to throw warnings as errors,
you can now also customize the verbosity of the logs and silence warnings and success logs.

```json title="config.json" del={3} ins={4-7}
{
  "source": ["tokens.json"],
  "log": "error",
  "log": {
    "warnings": "error", // "error", "warn", "disabled" -> "warn" is default
    "verbosity": "verbose" // "silent", "default", "verbose" -> "default" is default
  }
}
```

## Assets in CSS

We no longer wrap tokens of type `asset` in double quotes.
Rather, we added a transform `asset/url` that will wrap such tokens inside `url("")` statements, this transform is applied to transformGroups `scss`, `css` and `less`.

You may need to update your custom transforms if you were doing this transformation on your end, since it's now being done by default in those transformGroups.

## Removed Deprecated features

- `templates` and `registerTemplate`, use `formats` and `registerFormat` instead
- `properties` / `allProperties` props on the StyleDictionary instance

```js title="build-tokens.js" del={5} ins={6}
import StyleDictionary from 'style-dictionary';

const sd = new StyleDictionary({ source: ['tokens.json'], platforms: {} });
await sd.hasInitialized;
console.log(sd.allProperties, sd.properties);
console.log(sd.allTokens, sd.tokens);
```

- `format.formatter` old function signature of `(dictionary, platform, file)` in favor of `({ dictionary, platform, options, file })`.

```js title="build-tokens.js" del={8,10} ins={9,11}
import StyleDictionary from 'style-dictionary';

// yes, this is another breaking change, more on that later
import { fileHeader } from 'style-dictionary/utils';

StyleDictionary.registerFormat({
  name: 'custom/css',
  formatter: async function (dictionary, platform, file) {
  formatter: async function ({ dictionary, file, options }) {
    const { outputReferences } = file.options;
    const { outputReferences } = options;
    return (
      fileHeader({ file }) +
      // this helper is now async! because the user-passed file.fileHeader might be an async function
      (await fileHeader({ file })) +
      ':root {\n' +
      formattedVariables({ format: 'css', dictionary, outputReferences }) +
      '\n}\n'
    );
  },
});
```
