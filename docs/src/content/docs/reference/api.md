---
title: API
sidebar:
  order: 1
---

## new StyleDictionary()

Create a new StyleDictionary instance.

| Param               | Type                                              | Description                                                                                                                                                                      |
| ------------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `config`            | [`Config`](/reference/config)                     | Configuration options to build your style dictionary. If you pass a string, it will be used as a path to a JSON config file. You can also pass an object with the configuration. |
| `options`           | `Object`                                          | Options object when creating a new StyleDictionary instance.                                                                                                                     |
| `options.init`      | `boolean`                                         | `true` by default but can be disabled to delay initializing the dictionary. You can then call `sdInstance.init()` yourself, e.g. for testing or error handling purposes.         |
| `options.verbosity` | `'silent'\|'default'\|'verbose'`                  | Verbosity of logs, overrides `log.verbosity` set in SD config or platform config.                                                                                                |
| `options.warnings`  | `'error'\|'warn'\|'disabled'`                     | Whether to throw warnings as errors, warn or disable warnings, overrides `log.verbosity` set in SD config or platform config.                                                    |
| `options.volume`    | `import('memfs').IFs \| typeof import('node:fs')` | FileSystem Volume to use as an alternative to the default FileSystem, handy if you need to isolate or "containerise" StyleDictionary files                                       |

Example:

```js title="build-tokens.js"
import StyleDictionary from 'style-dictionary';

const sd = new StyleDictionary('config.json');
const sdTwo = new StyleDictionary({
  source: ['tokens/*.json'],
  platforms: {
    scss: {
      transformGroup: 'scss',
      buildPath: 'build/',
      files: [
        {
          destination: 'variables.scss',
          format: 'scss/variables',
        },
      ],
    },
    // ...
  },
});
```

Using volume option:

```js title="build-tokens.js"
import { Volume } from 'memfs';
// You will need a bundler like webpack/rollup for memfs in browser...
// Or use as a prebundled fork:
import memfs from '@bundled-es-modules/memfs';
const { Volume } = memfs;

const vol = new Volume();

const sd = new StyleDictionary(
  {
    tokens: {
      colors: {
        red: {
          value: '#FF0000',
          type: 'color',
        },
      },
    },
    platforms: {
      css: {
        transformGroup: 'css',
        files: [
          {
            destination: 'variables.css',
            format: 'css/variables',
          },
        ],
      },
    },
  },
  { volume: vol },
);

await sd.buildAllPlatforms();

vol.readFileSync('/variables.css');
/**
 * :root {
 *   --colors-red: #FF0000;
 * }
 */
```

## Instance methods

### init

```ts
type init = (config: Config) ⇒ Promise<SDInstance>
```

Called automatically when doing `new StyleDictionary(config)` unless passing a second argument with `init` property set to `false`.
In this scenario, you can call `.init()` manually, e.g. for testing or error handling purposes.

| Param                  | Type                             | Description                                                                                                                   |
| ---------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `initConfig`           | `Object`                         | Init configuration options.                                                                                                   |
| `initConfig.verbosity` | `'silent'\|'default'\|'verbose'` | Verbosity of logs, overrides `log.verbosity` set in SD config or platform config.                                             |
| `initConfig.warnings`  | `'error'\|'warn'\|'disabled'`    | Whether to throw warnings as errors, warn or disable warnings, overrides `log.verbosity` set in SD config or platform config. |

---

### extend

```ts
type extend = (config: Config | string, options: Options) ⇒ Promise<SDInstance>
```

Extend a Style Dictionary instance with a config object, to create an extension instance.

| Param                    | Type                                              | Description                                                                                                                                                                                                                   |
| ------------------------ | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `config`                 | [`Config`](/reference/config)                     | Configuration options to build your style dictionary. If you pass a string, it will be used as a path to a JSON config file. You can also pass an object with the configuration.                                              |
| `options`                | `Object`                                          |                                                                                                                                                                                                                               |
| `options.verbosity`      | `'silent'\|'default'\|'verbose'`                  | Verbosity of logs, overrides `log.verbosity` set in SD config or platform config.                                                                                                                                             |
| `options.warnings`       | `'error'\|'warn'\|'disabled'`                     | Whether to throw warnings as errors, warn or disable warnings, overrides `log.verbosity` set in SD config or platform config.                                                                                                 |
| `options.volume`         | `import('memfs').IFs \| typeof import('node:fs')` | Pass a custom Volume to use instead of filesystem shim itself. Only possible in browser or in Node if you're explicitly using `memfs` as filesystem shim (by calling `setFs()` function and setting it to the `memfs` module) |
| `options.mutateOriginal` | `boolean`                                         | Private option, do not use                                                                                                                                                                                                    |

Example:

```js title="build-tokens.js"
import StyleDictionary from 'style-dictionary';

const sd = new StyleDictionary('config.json');

const sdExtended = await sd.extend({
  source: ['tokens/*.json'],
  platforms: {
    scss: {
      transformGroup: 'scss',
      buildPath: 'build/',
      files: [
        {
          destination: 'variables.scss',
          format: 'scss/variables',
        },
      ],
    },
    // ...
  },
});
```

Volume option also works when using extend:

```js
const extendedSd = await sd.extend(cfg, { volume: vol });
```

---

### getPlatformTokens

> Replaces the deprecated `exportPlatform` method, with a slightly different (expanded) return value

```ts
type getPlatformTokens = (platform: string, opts: { cache?: boolean }) => Promise<Dictionary>;
```

Exports a dictionary object containing the tokens as object or flat array, after platform specific transformations and reference resolutions.

| Param    | Type                  | Description                                                                                                                                                          |
| -------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| platform | `string`              | The platform to be exported. Must be defined on the style dictionary.                                                                                                |
| opts     | `{ cache?: boolean }` | `cache` prop determines whether or not it should return the cached tokens if they've already been transformed/resolved earlier for this platform. `false` by default |

---

### getPlatformConfig

> Replaces the deprecated `getPlatform` method, returns just the PlatformConfig, use `getPlatformTokens` if you need the Dictionary

```ts
type getPlatformConfig = (platform: string, opts: { cache?: boolean }) => Promise<PlatformConfig>;
```

Returns a processed version of the user config for the platform.

| Param    | Type                  | Description                                                                                                                                                          |
| -------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| platform | `string`              | The platform to be exported. Must be defined on the style dictionary.                                                                                                |
| opts     | `{ cache?: boolean }` | `cache` prop determines whether or not it should return the cached tokens if they've already been transformed/resolved earlier for this platform. `false` by default |

---

### formatPlatform

```ts
type formatPlatform = (
  platform: string,
  opts: { cache?: boolean },
) => Promise<Array<{ output: unknown; destination?: string }>>;
```

| Param    | Type                  | Description                                                                                                                                                     |
| -------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| platform | `string`              | Name of the platform you want to build.                                                                                                                         |
| opts     | `{ cache?: boolean }` | `cache` prop determines whether or not it should reuse the cached tokens/config if they've already been processed earlier for this platform. `false` by default |

Runs [`getPlatform`](#getplatform) under the hood, and then loops over the `files`, and formats the dictionary for each file, returning an array of file objects:

- `output` property, which is usually a string but depending on the format, it could also be any other data type. This is useful if you don't intend to write to a file, but want to do something else with the formatted tokens.
- `destination` property, this one is optional, if you don't intend on writing to a file you don't need this, but it can still be useful to name your outputs if you've got multiple `files`.

---

### formatAllPlatforms

```ts
type formatAllPlatforms = (opts: {
  cache?: boolean;
}) => Promise<Record<string, Array<{ output: unknown; destination?: string }>>>;
```

| Param | Type                  | Description                                                                                                                                                     |
| ----- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| opts  | `{ cache?: boolean }` | `cache` prop determines whether or not it should reuse the cached tokens/config if they've already been processed earlier for this platform. `false` by default |

Runs [`formatPlatform`](#formatplatform) under the hood but for each platform.

The resulting object is similar, but an `Object` with key-value pairs where they key is the platform key, and the value is the same data from the `formatPlatform` method.

This is useful if you don't want to write to the filesystem but want to do something custom with the data instead.

---

### buildPlatform

```ts
type buildPlatform = (platform: string, opts: { cache?: boolean }) => Promise<SDInstance>;
```

Takes a platform and performs all transforms to
the tokens object (non-mutative) then
builds all the files and performs any actions. This is useful if you only want to
build the artifacts of one platform to speed up the build process.

This method is also used internally in [buildAllPlatforms](#buildallplatforms) to
build each platform defined in the config.

| Param    | Type                  | Description                                                                                                                                                     |
| -------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| platform | `string`              | Name of the platform you want to build.                                                                                                                         |
| opts     | `{ cache?: boolean }` | `cache` prop determines whether or not it should reuse the cached tokens/config if they've already been processed earlier for this platform. `false` by default |

Example:

```js title="build-web.js"
// Async, so you can do `await` or .then() if you
// want to execute code after buildAllPlatforms has completed
await sd.buildPlatform('web');
```

```bash
style-dictionary build --platform web
```

---

### buildAllPlatforms

```ts
type buildAllPlatforms = (opts: { cache?: boolean }) => Promise<SDInstance>;
```

Uses [`buildPlatform`](#buildplatform) under the hood for each platform.

| Param | Type                  | Description                                                                                                                                                     |
| ----- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| opts  | `{ cache?: boolean }` | `cache` prop determines whether or not it should reuse the cached tokens/config if they've already been processed earlier for this platform. `false` by default |

:::tip
In the majority of cases, this is the method you'll use.
:::

Example:

```js
import StyleDictionary from 'style-dictionary';
const sd = new StyleDictionary('config.json');

// Async, so you can do `await` or .then() if you
// want to execute code after buildAllPlatforms has completed
await sd.buildAllPlatforms();
```

```bash
style-dictionary build
```

---

### cleanPlatform

```ts
type cleanPlatform = (platform: string, opts: { cache?: boolean }) => Promise<SDInstance>;
```

Takes a platform and performs all transforms to
the tokens object (non-mutative) then
cleans all the files and performs the undo method of any [actions](/reference/hooks/actions).

| Param    | Type                  | Description                                                                                                                                                     |
| -------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| platform | `string`              | Name of the platform you want to clean.                                                                                                                         |
| opts     | `{ cache?: boolean }` | `cache` prop determines whether or not it should reuse the cached tokens/config if they've already been processed earlier for this platform. `false` by default |

---

### cleanAllPlatforms

```ts
type cleanAllPlatforms = (opts: { cache?: boolean }) => Promise<SDInstance>;
```

Uses [`cleanPlatform`](#cleanplatform) under the hood for each platform.

Does the reverse of [buildAllPlatforms](#buildallplatforms) by
performing a clean on each platform. This removes all the files
defined in the platform and calls the undo method on any actions.

| Param | Type                  | Description                                                                                                                                                     |
| ----- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| opts  | `{ cache?: boolean }` | `cache` prop determines whether or not it should reuse the cached tokens/config if they've already been processed earlier for this platform. `false` by default |

---

## Deprecated instance methods

- For `exportPlatform`, use `getPlatformTokens` instead, turning off the cache option if needed.
- For `getPlatform`, use `getPlatformConfig` insetad, turning off the cache option if needed.

### exportPlatform

```ts
type exportPlatform = (platform: string, opts: { cache?: boolean }) => Promise<DesignTokens>;
```

Exports a tokens object with applied platform transforms.

This is useful if you want to use a Style Dictionary in JS build tools like Webpack.

| Param    | Type                  | Description                                                                                                                                                     |
| -------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| platform | `string`              | Name of the platform you want to build.                                                                                                                         |
| opts     | `{ cache?: boolean }` | `cache` prop determines whether or not it should reuse the cached tokens/config if they've already been processed earlier for this platform. `false` by default |

---

### getPlatform

```ts
type getPlatform = (
  platform: string,
  opts: { cache?: boolean },
) => Promise<{
  platformConfig: PlatformConfig;
  dictionary: {
    tokens: DesignTokens;
    allTokens: DesignToken[];
  };
}>;
```

`SDInstance.getPlatform(platform) ⇒ Promise<Object>`

Wrapper around [`exportPlatform`](#exportplatform), returns a bit more data.

Returns an object with `platformConfig` and `dictionary` properties:

- `platformConfig` a processed version of the user config for the platform
- `dictionary` an object with `tokens` after transformations and reference resolutions, and an `allTokens` property which is a flattened (Array) version of that.

This is useful if you want to use a Style Dictionary in JS build tools like Webpack.

| Param    | Type                  | Description                                                                                                                                                     |
| -------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| platform | `string`              | Name of the platform you want to build.                                                                                                                         |
| opts     | `{ cache?: boolean }` | `cache` prop determines whether or not it should reuse the cached tokens/config if they've already been processed earlier for this platform. `false` by default |

---

## Class methods

:::tip
Can also be used on the instance if you want to register something only on that particular StyleDictionary instance, as opposed to registering it globally for all instances.
Registering on the class means all **future** created instances will be affected. **Priorly** created instances will not be affected.
:::

### registerAction

> `StyleDictionary.registerAction(action) ⇒ StyleDictionary`

Adds a custom [action](/reference/hooks/actions) to Style Dictionary. Custom
actions can do whatever you need, such as: copying files,
base64'ing files, running other build scripts, etc.
After you register a custom action, you then use that
action in a platform your config.json

You can perform operations on files generated by the style dictionary
as actions run after these files are generated.
Actions are run sequentially, if you write synchronous code then
it will block other actions, or if you use asynchronous code like Promises
it will not block.

| Param       | Type       | Description                                        |
| ----------- | ---------- | -------------------------------------------------- |
| action      | `Object`   |                                                    |
| action.name | `string`   | The name of the action                             |
| action.do   | `function` | The action in the form of a function. Can be async |
| action.undo | `function` | A function that undoes the action. Can be async    |

Example:

```js
StyleDictionary.registerAction({
  name: 'copy_assets',
  do: async function (dictionary, config) {
    console.log('Copying assets directory');
    await fs.promises.copy('assets', config.buildPath + 'assets');
  },
  undo: async function (dictionary, config) {
    console.log('Cleaning assets directory');
    await fs.promises.remove(config.buildPath + 'assets');
  },
});
```

---

### registerFileHeader

> `StyleDictionary.registerFileHeader(fileHeader) ⇒ StyleDictionary`

Add a custom [fileHeader](/reference/hooks/file-headers) to the Style Dictionary. File headers are used in
formats to display some information about how the file was built in a comment.

| Param              | Type       | Description                                                                                                                                                                                                                             |
| ------------------ | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| options            | `Object`   |                                                                                                                                                                                                                                         |
| options.name       | `string`   | Name of the format to be referenced in your config.json                                                                                                                                                                                 |
| options.fileHeader | `function` | Function that returns an array of strings, which will be mapped to comment lines. It takes a single argument which is the default message array. See [file headers](/references/hooks/file-headers) for more information. Can be async. |

Example:

```js
StyleDictionary.registerFileHeader({
  name: 'myCustomHeader',
  fileHeader: function (defaultMessage) {
    return [...defaultMessage, `hello, world!`];
  },
});
```

---

### registerFilter

> `StyleDictionary.registerFilter(filter) ⇒ StyleDictionary`

Add a custom [filter](/reference/hooks/filters) to the Style Dictionary.

| Param         | Type       | Description                                                                   |
| ------------- | ---------- | ----------------------------------------------------------------------------- |
| Filter        | `Object`   |                                                                               |
| Filter.name   | `string`   | Name of the filter to be referenced in your config.json                       |
| Filter.filter | `function` | Filter function, return boolean if the token should be included. Can be async |

Example:

```js
StyleDictionary.registerFilter({
  name: 'isColor',
  filter: function (token) {
    return token.type === 'color';
  },
});
```

---

### registerFormat

> `StyleDictionary.registerFormat(format) ⇒ StyleDictionary`

Add a custom [format](/reference/hooks/formats) to the Style Dictionary.

| Param         | Type       | Description                                                                                                                                                                                            |
| ------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| format        | `Object`   |                                                                                                                                                                                                        |
| format.name   | `string`   | Name of the format to be referenced in your config.json                                                                                                                                                |
| format.format | `function` | Function to perform the format. Takes a single argument. See [creating custom formats](/references/hooks/formats#creating-formats) Must return a string, which is then written to a file. Can be async |

Example:

```js
StyleDictionary.registerFormat({
  name: 'json',
  format: function ({ dictionary, platform, options, file }) {
    return JSON.stringify(dictionary.tokens, null, 2);
  },
});
```

---

### registerParser

> `StyleDictionary.registerParser(parser) ⇒ StyleDictionary`

Adds a custom [parser](/reference/hooks/parsers) to parse style dictionary files.

| Param          | Type       | Description                                                                                                                                                                                                                         |
| -------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Parser.name    | `string`   | Name of the parser to be referenced in your config.json                                                                                                                                                                             |
| Parser.pattern | `Regex`    | A file path regular expression to match which files this parser should be be used on. This is similar to how webpack loaders work. `/\.json$/` will match any file ending in '.json', for example.                                  |
| Parser.parser  | `function` | Function to parse the file contents. Takes 1 argument, which is an object with 2 properties: `contents` wich is the string of the file contents and `filePath`. The function should return a plain JavaScript object. Can be async. |

Example:

```js
StyleDictionary.registerParser({
  name: 'json-parser',
  pattern: /\.json$/,
  parser: ({ contents, filePath }) => {
    return JSON.parse(contents);
  },
});
```

---

### registerPreprocessor

> `StyleDictionary.registerPreprocessor({ name, preprocessor }) => StyleDictionary`

Adds a custom [preprocessor](/reference/hooks/preprocessors) to preprocess already parsed Style Dictionary objects.

| Param                     | Type       | Description                                                                                               |
| ------------------------- | ---------- | --------------------------------------------------------------------------------------------------------- |
| Preprocessor              | `Object`   |                                                                                                           |
| Preprocessor.name         | `string`   | Name of the format to be referenced in your config.json                                                   |
| Preprocessor.preprocessor | `function` | Function to preprocess the dictionary. The function should return a plain Javascript object. Can be async |

Example:

```js
StyleDictionary.registerPreprocessor({
  name: 'strip-third-party-meta',
  preprocessor: (dictionary) => {
    delete dictionary.thirdPartyMetadata;
    return dictionary;
  },
});
```

---

### registerTransform

> `StyleDictionary.registerTransform(transform) ⇒ StyleDictionary`

Add a custom [transform](/reference/hooks/transforms) to the Style Dictionary.
Transforms can manipulate a token's name, value, or attributes.

| Param                | Type       | Description                                                                                                                                                                                                                                                                                       |
| -------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| transform            | `Object`   | Transform object                                                                                                                                                                                                                                                                                  |
| transform.type       | `string`   | Type of transform, can be: name, attribute, or value                                                                                                                                                                                                                                              |
| transform.name       | `string`   | Name of the transform (used by transformGroup to call a list of transforms).                                                                                                                                                                                                                      |
| transform.transitive | `boolean`  | If the value transform should be applied transitively, i.e. should be applied to referenced values as well as absolute values.                                                                                                                                                                    |
| transform.filter     | `function` | [Filter](/reference/hooks/filters) function, return boolean if transform should be applied. If you omit the filter function, it will match all tokens.                                                                                                                                            |
| transform.transform  | `function` | Modifies a design token object. The transform function will receive the token and the platform configuration as its arguments. The transform function should return a string for name transforms, an object for attribute transforms, and same type of value for a value transform. Can be async. |

Example:

```js
StyleDictionary.registerTransform({
  name: 'time/seconds',
  type: 'value',
  filter: function (token) {
    return token.type === 'time';
  },
  transform: function (token) {
    // Note the use of prop.original.value,
    // before any transforms are performed, the build system
    // clones the original token to the 'original' attribute.
    return (parseInt(token.original.value) / 1000).tostring() + 's';
  },
});
```

---

### registerTransformGroup

> `StyleDictionary.registerTransformGroup(transformGroup) ⇒ StyleDictionary`

Add a custom [transformGroup](/reference/hooks/transform_groups) to the Style Dictionary, which is a
group of transforms.

| Param                     | Type       | Description                                                                                                                                                           |
| ------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| transformGroup            | `Object`   |                                                                                                                                                                       |
| transformGroup.name       | `string`   | Name of the transform group that will be referenced in config.json                                                                                                    |
| transformGroup.transforms | `string[]` | Array of strings that reference the name of transforms to be applied in order. Transforms must be defined and match the name or there will be an error at build time. |

Example:

```js
StyleDictionary.registerTransformGroup({
  name: 'Swift',
  transforms: ['attribute/cti', 'size/pt', 'name'],
});
```

---
