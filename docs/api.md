# API

## new StyleDictionary()

> new StyleDictionary() ⇒ [<code>style-dictionary</code>](#module_style-dictionary)

Create a new StyleDictionary instance.

| Param        | Type                           | Description                                                                                                                                                                      |
| ------------ | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| config       | [<code>Config</code>](#Config) | Configuration options to build your style dictionary. If you pass a string, it will be used as a path to a JSON config file. You can also pass an object with the configuration. |
| options      | <code>Object</code>            | Options object when creating a new StyleDictionary instance.                                                                                                                     |
| options.init | <code>Boolean</code>           | `true` by default but can be disabled to delay initializing the dictionary. You can then call `sdInstance.init()` yourself, e.g. for testing or error handling purposes.         |

**Example**

```js
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

## init

> StyleDictionary.init() ⇒ [<code>Promise<style-dictionary></code>](#module_style-dictionary)

Called automatically when doing `new StyleDictionary(config)` unless passing a second argument with `init` property set to `false`. In this scenario, you can call `.init()` manually, e.g. for testing or error handling purposes.

## extend

> StyleDictionary.extend(config) ⇒ [<code>Promise<style-dictionary></code>](#module_style-dictionary)

Extend a Style Dictionary instance with a config object, to create an extension instance.

| Param          | Type                            | Description                                                                                                                                                                       |
| -------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| config         | [<code>Config</code>](#Config)  | Configuration options to build your style dictionary. If you pass a string, it will be used as a path to a JSON config file. You can also pass an object with the configuration.  |
| mutateOriginal | [<code>Boolean</code>](#Config) | Whether or not the original SD instance should be mutated during extension. `false` by default. You will likely never need to set this to `true`, consider this argument private. |

**Example**

```js
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

---

## buildAllPlatforms

> StyleDictionary.buildAllPlatforms() ⇒ [<code>Promise<style-dictionary></code>](#module_style-dictionary)

The only top-level method that needs to be called
to build the Style Dictionary.

**Example**

```js
import StyleDictionary from 'style-dictionary';
const sd = new StyleDictionary('config.json');

// Async, so you can do `await` or .then() if you
// want to execute code after buildAllPlatforms has completed
await sd.buildAllPlatforms();
```

---

## buildPlatform

> StyleDictionary.buildPlatform(platform) ⇒ [<code>Promise<style-dictionary></code>](#module_style-dictionary)

Takes a platform and performs all transforms to
the tokens object (non-mutative) then
builds all the files and performs any actions. This is useful if you only want to
build the artifacts of one platform to speed up the build process.

This method is also used internally in [buildAllPlatforms](#buildAllPlatforms) to
build each platform defined in the config.

| Param    | Type                | Description                             |
| -------- | ------------------- | --------------------------------------- |
| platform | <code>String</code> | Name of the platform you want to build. |

**Example**

```js
// Async, so you can do `await` or .then() if you
// want to execute code after buildAllPlatforms has completed
await sd.buildPlatform('web');
```

```bash
$ style-dictionary build --platform web
```

---

## cleanAllPlatforms

> StyleDictionary.cleanAllPlatforms() ⇒ [<code>Promise<style-dictionary></code>](#module_style-dictionary)

Does the reverse of [buildAllPlatforms](#buildAllPlatforms) by
performing a clean on each platform. This removes all the files
defined in the platform and calls the undo method on any actions.

---

## cleanPlatform

> StyleDictionary.cleanPlatform(platform) ⇒ [<code>Promise<style-dictionary></code>](#module_style-dictionary)

Takes a platform and performs all transforms to
the tokens object (non-mutative) then
cleans all the files and performs the undo method of any [actions](actions.md).

| Param    | Type                |
| -------- | ------------------- |
| platform | <code>String</code> |

---

## exportPlatform

> StyleDictionary.exportPlatform(platform) ⇒ <code>Promise<Object></code>

Exports a tokens object with applied
platform transforms.

This is useful if you want to use a style
dictionary in JS build tools like webpack.

| Param    | Type                | Description                                                           |
| -------- | ------------------- | --------------------------------------------------------------------- |
| platform | <code>String</code> | The platform to be exported. Must be defined on the style dictionary. |

---

## registerAction

> StyleDictionary.registerAction(action) ⇒ [<code>style-dictionary</code>](#module_style-dictionary)

Adds a custom action to Style Dictionary. Custom
actions can do whatever you need, such as: copying files,
base64'ing files, running other build scripts, etc.
After you register a custom action, you then use that
action in a platform your config.json

You can perform operations on files generated by the style dictionary
as actions run after these files are generated.
Actions are run sequentially, if you write synchronous code then
it will block other actions, or if you use asynchronous code like Promises
it will not block.

| Param         | Type                  | Description                           |
| ------------- | --------------------- | ------------------------------------- |
| action        | <code>Object</code>   |                                       |
| action.name   | <code>String</code>   | The name of the action                |
| action.do     | <code>function</code> | The action in the form of a function. |
| [action.undo] | <code>function</code> | A function that undoes the action.    |

**Example**

```js
StyleDictionary.registerAction({
  name: 'copy_assets',
  do: function (dictionary, config) {
    console.log('Copying assets directory');
    fs.copySync('assets', config.buildPath + 'assets');
  },
  undo: function (dictionary, config) {
    console.log('Cleaning assets directory');
    fs.removeSync(config.buildPath + 'assets');
  },
});
```

---

## registerFileHeader

> StyleDictionary.registerFileHeader(options) ⇒ [<code>style-dictionary</code>](#module_style-dictionary)

Add a custom file header to the style dictionary. File headers are used in
formats to display some information about how the file was built in a comment.

| Param              | Type                  | Description                                                                                                                                                                                                        |
| ------------------ | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| options            | <code>Object</code>   |                                                                                                                                                                                                                    |
| options.name       | <code>String</code>   | Name of the format to be referenced in your config.json                                                                                                                                                            |
| options.fileHeader | <code>function</code> | Function that returns an array of strings, which will be mapped to comment lines. It takes a single argument which is the default message array. See [file headers](formats.md#file-headers) for more information. |

**Example**

```js
StyleDictionary.registerFileHeader({
  name: 'myCustomHeader',
  fileHeader: function (defaultMessage) {
    return [...defaultMessage, `hello, world!`];
  },
});
```

---

## registerFilter

> StyleDictionary.registerFilter(filter) ⇒ [<code>style-dictionary</code>](#module_style-dictionary)

Add a custom filter to the style dictionary

| Param          | Type                  | Description                                                       |
| -------------- | --------------------- | ----------------------------------------------------------------- |
| filter         | <code>Object</code>   |                                                                   |
| filter.name    | <code>String</code>   | Name of the filter to be referenced in your config.json           |
| filter.matcher | <code>function</code> | Matcher function, return boolean if the token should be included. |

**Example**

```js
StyleDictionary.registerFilter({
  name: 'isColor',
  matcher: function (token) {
    return token.attributes.category === 'color';
  },
});
```

---

## registerFormat

> StyleDictionary.registerFormat(format) ⇒ [<code>style-dictionary</code>](#module_style-dictionary)

Add a custom format to the style dictionary

| Param            | Type                  | Description                                                                                                                                                                |
| ---------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| format           | <code>Object</code>   |                                                                                                                                                                            |
| format.name      | <code>String</code>   | Name of the format to be referenced in your config.json                                                                                                                    |
| format.formatter | <code>function</code> | Function to perform the format. Takes a single argument. See [creating custom formats](formats.md#creating-formats) Must return a string, which is then written to a file. |

**Example**

```js
StyleDictionary.registerFormat({
  name: 'json',
  formatter: function ({ dictionary, platform, options, file }) {
    return JSON.stringify(dictionary.tokens, null, 2);
  },
});
```

---

## registerParser

> StyleDictionary.registerParser(pattern, parse) ⇒ [<code>style-dictionary</code>](#module_style-dictionary)

Adds a custom parser to parse style dictionary files

| Param   | Type                  | Description                                                                                                                                                                                                       |
| ------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| pattern | <code>Regex</code>    | A file path regular expression to match which files this parser should be be used on. This is similar to how webpack loaders work. `/\.json$/` will match any file ending in '.json', for example.                |
| parse   | <code>function</code> | Function to parse the file contents. Takes 1 argument, which is an object with 2 attributes: contents wich is the string of the file contents and filePath. The function should return a plain Javascript object. |

**Example**

```js
StyleDictionary.registerParser({
  pattern: /\.json$/,
  parse: ({ contents, filePath }) => {
    return JSON.parse(contents);
  },
});
```

---

## registerPreprocessor

> StyleDictionary.registerPreprocessor({ name, preprocessor }) => [<code>style-dictionary</code>](#module_style-dictionary)

Adds a custom parser to parse style dictionary files

| Param                     | Type                  | Description                                                                                  |
| ------------------------- | --------------------- | -------------------------------------------------------------------------------------------- |
| Preprocessor              | <code>Object</code>   |                                                                                              |
| Preprocessor.name         | <code>String</code>   | Name of the format to be referenced in your config.json                                      |
| Preprocessor.preprocessor | <code>function</code> | Function to preprocess the dictionary. The function should return a plain Javascript object. |

**Example**

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

## registerTransform

> StyleDictionary.registerTransform(transform) ⇒ [<code>style-dictionary</code>](#module_style-dictionary)

Add a custom transform to the Style Dictionary
Transforms can manipulate a token's name, value, or attributes

| Param                 | Type                  | Description                                                                                                                                                                                                                                                                             |
| --------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| transform             | <code>Object</code>   | Transform object                                                                                                                                                                                                                                                                        |
| transform.type        | <code>String</code>   | Type of transform, can be: name, attribute, or value                                                                                                                                                                                                                                    |
| transform.name        | <code>String</code>   | Name of the transformer (used by transformGroup to call a list of transforms).                                                                                                                                                                                                          |
| transform.transitive  | <code>Boolean</code>  | If the value transform should be applied transitively, i.e. should be applied to referenced values as well as absolute values.                                                                                                                                                          |
| [transform.matcher]   | <code>function</code> | Matcher function, return boolean if transform should be applied. If you omit the matcher function, it will match all tokens.                                                                                                                                                            |
| transform.transformer | <code>function</code> | Modifies a design token object. The transformer function will receive the token and the platform configuration as its arguments. The transformer function should return a string for name transforms, an object for attribute transforms, and same type of value for a value transform. |

**Example**

```js
StyleDictionary.registerTransform({
  name: 'time/seconds',
  type: 'value',
  matcher: function (token) {
    return token.attributes.category === 'time';
  },
  transformer: function (token) {
    // Note the use of prop.original.value,
    // before any transforms are performed, the build system
    // clones the original token to the 'original' attribute.
    return (parseInt(token.original.value) / 1000).toString() + 's';
  },
});
```

---

## registerTransformGroup

> StyleDictionary.registerTransformGroup(transformGroup) ⇒ [<code>style-dictionary</code>](#module_style-dictionary)

Add a custom transformGroup to the Style Dictionary, which is a
group of transforms.

| Param                     | Type                              | Description                                                                                                                                                           |
| ------------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| transformGroup            | <code>Object</code>               |                                                                                                                                                                       |
| transformGroup.name       | <code>String</code>               | Name of the transform group that will be referenced in config.json                                                                                                    |
| transformGroup.transforms | <code>Array.&lt;String&gt;</code> | Array of strings that reference the name of transforms to be applied in order. Transforms must be defined and match the name or there will be an error at build time. |

**Example**

```js
StyleDictionary.registerTransformGroup({
  name: 'Swift',
  transforms: ['attribute/cti', 'size/pt', 'name/cti'],
});
```

---
