---
title: Configuration
sidebar:
  order: 2
---

Style dictionaries are configuration driven. Your configuration lets Style Dictionary know:

1. Where to find your [design tokens](/reference/tokens)
1. How to transform and format them to generate output files

Here is an example configuration:

```json title="config.json"
{
  "source": ["tokens/**/*.json"],
  "platforms": {
    "scss": {
      "transformGroup": "scss",
      "prefix": "sd",
      "buildPath": "build/scss/",
      "files": [
        {
          "destination": "_variables.scss",
          "format": "scss/variables"
        }
      ],
      "actions": ["copy_assets"]
    },
    "android": {
      "transforms": ["attribute/cti", "name/snake", "color/hex", "size/remToSp", "size/remToDp"],
      "buildPath": "build/android/src/main/res/values/",
      "files": [
        {
          "destination": "style_dictionary_colors.xml",
          "format": "android/colors"
        }
      ]
    }
  }
}
```

## Configuration file formats

Style Dictionary supports configuration files in these file formats:

- JSON
- JSONC
- JSON5
- Javascript (ES Modules, default export)

Here is an example using an ES module for configuration:

```javascript title="config.js"
export default {
  source: [`tokens/**/*.json`],
  // If you don't want to call the registerTransform method a bunch of times
  // you can override the whole transform object directly. This works because
  // the .extend method copies everything in the config
  // to itself, allowing you to override things. It's also doing a deep merge
  // to protect from accidentally overriding nested attributes.
  transform: {
    // Now we can use the transform 'myTransform' below
    myTransform: {
      type: 'name',
      transformer: (token) => token.path.join('_').toUpperCase(),
    },
  },
  // Same with formats, you can now write them directly to this config
  // object. The name of the format is the key.
  format: {
    myFormat: ({ dictionary, platform }) => {
      return dictionary.allTokens.map((token) => `${token.name}: ${token.value};`).join('\n');
    },
  },
  platforms: {
    // ...
  },
};
```

Some interesting things you can do in a JS file that you cannot do in a JSON file:

- Add custom transforms, formats, filters, actions, preprocessors and parsers
- Programmatically generate your configuration

---

## Using configuration files

By default, the Style Dictionary [CLI](/reference/using_the_cli) looks for a `config.json` or `config.js` file in the root of your package.

```json5
// package.json
"scripts": {
  "build": "style-dictionary build"
}
```

You can also specify a custom location when you use the [CLI](/reference/using_the_cli) with the `--config` parameter.

```json5
// package.json
"scripts": {
  "build": "style-dictionary build --config ./sd.config.js"
}
```

## Using in Node

You can also use Style Dictionary as an [npm module](/reference/using_the_npm_module) and further customize how Style Dictionary is run, for example running Style Dictionary multiple times with different configurations. To do this you would create a Javascript file that imports the Style Dictionary npm module and calls the [`.extend`](/reference/api#extend) and [`.buildAllPlatforms`](/reference/api#buildallplatforms) functions.

```javascript
// build-tokens.js
import StyleDictionary from 'style-dictionary';

const myStyleDictionary = new StyleDictionary({
  // configuration
});

await myStyleDictionary.buildAllPlatforms();

// You can also extend Style Dictionary multiple times:
const myOtherStyleDictionary = await myStyleDictionary.extend({
  // new configuration
});

await myOtherStyleDictionary.buildAllPlatforms();
```

You would then change your npm script or CLI command to run that file with Node:

```json5
// package.json
"scripts": {
  "build": "node build-tokens.js"
}
```

---

## Attributes

| Attribute        | Type                             | Description                                                                                                                                                                                                                                                                                                                                |
| :--------------- | :------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `log`            | `Log`                            | [Configure logging behavior](/reference/logging) to either reduce/silence logs or to make them more verbose for debugging purposes.                                                                                                                                                                                                        |
| `source`         | `string[]`                       | An array of file path [globs](https://github.com/isaacs/node-glob) to design token files. Style Dictionary will do a deep merge of all of the token files, allowing you to organize your files however you want.                                                                                                                           |
| `include`        | `string[]`                       | An array of file path [globs](https://github.com/isaacs/node-glob) to design token files that contain default styles. Style Dictionary uses this as a base collection of design tokens. The tokens found using the "source" attribute will overwrite tokens found using include.                                                           |
| `tokens`         | `Object`                         | The tokens object is a way to include inline design tokens as opposed to using the `source` and `include` arrays.                                                                                                                                                                                                                          |
| `platforms`      | `Record<string, Platform>`       | An object containing [platform](#platform) config objects that describe how the Style Dictionary should build for that platform. You can add any arbitrary attributes on this object that will get passed to formats and actions (more on these in a bit). This is useful for things like build paths, name prefixes, variable names, etc. |
| `parsers`        | `Parser[]`                       | Custom [file parsers](/reference/hooks/parsers) to run on input files                                                                                                                                                                                                                                                                      |
| `preprocessors`  | `Record<string, Preprocessor>`   | Custom [preprocessors](/reference/hooks/preprocessors) to run on the full token dictionary, before any transforms run, can be registered using `.registerPreprocessor`. The keys in this object will be the preprocessor's name                                                                                                            |
| `transform`      | `Record<string, Transform>`      | Custom [transforms](/reference/hooks/transforms) you can include inline rather than using `.registerTransform`. The keys in this object will be the transform's name, the value should be an object with `type`                                                                                                                            |
| `transformGroup` | `Record<string, TransformGroup>` | Custom [transformGroups](/reference/hooks/transform_groups) you can include inline rather than using `.registerTransformGroup`. The keys in this object will be the transformGroup's name, the value should be an array with `transform`s                                                                                                  |
| `format`         | `Record<string, Format>`         | Custom [formats](/reference/hooks/formats) you can include inline in the configuration rather than using `.registerFormat`. The keys in this object will be for format's name and value should be the formatter function.                                                                                                                  |
| `action`         | `Record<string, Action>`         | Custom inline [actions](/reference/hooks/actions). The keys in this object will be the action's name and the value should be an object containing `do` and `undo` methods.                                                                                                                                                                 |
| `filter`         | `Record<string, Filter>`         | Custom [filters](/reference/hooks/filters). The keys in this object will be the filters' names and the values should be Filter functions.                                                                                                                                                                                                  |
| `fileHeader`     | `Record<string, FileHeader>`     | Custom [fileHeaders](/reference/hooks/file_headers). The keys in this object will be the fileHeaders' names and the values should be FileHeader functions.                                                                                                                                                                                 |
| `usesDtcg`       | `boolean`                        | Whether the tokens are using [DTCG Format](https://tr.designtokens.org/format/) or not. Usually you won't need to configure this, as style-dictionary will auto-detect this format.                                                                                                                                                        |

### Log

Log configuration object to configure the [logging behavior of Style Dictionary](/reference/logging).

### Platform

A platform is a build target that tells Style Dictionary how to properly transform and format your design tokens for output to a specific platform. You can have as many platforms as you need and you can name them anything, there are no restrictions.

| Attribute        | Type       | Description                                                                                                                                                                                                                                                                                                 |
| :--------------- | :--------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `transforms`     | `string[]` | An array of [transform](/reference/hooks/transforms) keys to be performed on the design tokens. These will transform the tokens in a non-destructive way, allowing each platform to transform the tokens. Transforms to apply sequentially to all tokens. Can be a built-in one or you can create your own. |
| `transformGroup` | `string`   | A string that maps to an array of transforms. This makes it easier to reference transforms by grouping them together. Can be combined with [transforms](/reference/hooks/transforms).                                                                                                                       |
| `buildPath`      | `string`   | Base path to build the files, must end with a trailing slash.                                                                                                                                                                                                                                               |
| `options`        | `Object`   | Options that apply to all files in the platform, for example `outputReferences` and `showFileHeader`                                                                                                                                                                                                        |
| `files`          | `File[]`   | [Files](#file) to be generated for this platform.                                                                                                                                                                                                                                                           |
| `actions`        | `string[]` | [Actions](/reference/hooks/actions) to be performed after the files are built for that platform. Actions can be any arbitrary code you want to run like copying files, generating assets, etc. You can use pre-defined actions or create custom actions.                                                    |

### File

A File configuration object represents a single output file. The `options` object on the file configuration will take precedence over the `options` object defined at the platform level. Apart from the options listed below, any other options can be added, which can then be used inside custom [formats](/reference/hooks/formats).

| Attribute                  | Type                           | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| :------------------------- | :----------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `destination`              | `string`                       | Location to build the file, will be appended to the buildPath.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `format`                   | `string`                       | [Format](/reference/hooks/formats) used to generate the file. Can be a built-in one or you can create your own via [registerFormat](/reference/api#registerformat).                                                                                                                                                                                                                                                                                                                                                                              |
| `filter`                   | `string \| function \| Object` | A function, string or object used to filter the tokens that will be included in the file. If a function is provided, each design token will be passed to the function and the result (true or false) will determine whether the design token is included. If an object is provided, each design token will be matched against the object using a partial deep comparison. If a match is found, the design token is included. If a string is passed, is considered a custom filter registered via [registerFilter](/reference/api#registerfilter) |
| `options`                  | `Object`                       | A set of extra options associated with the file. Includes `showFileHeader` and `outputReferences`.                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `options.showFileHeader`   | `boolean`                      | If the generated file should have a comment at the top about being generated. The default fileHeader comment has "Do not edit + Timestamp". By default is "true".                                                                                                                                                                                                                                                                                                                                                                                |
| `options.fileHeader`       | `string \|function`            | A custom fileHeader that can be either a name of a registered file header (string) or an inline [fileHeader](/reference/hooks/formats#customfileheader) function.                                                                                                                                                                                                                                                                                                                                                                                |
| `options.outputReferences` | `boolean`                      | If the file should keep token [references](/reference/hooks/formats#references-in-output-files). By default this is "false".                                                                                                                                                                                                                                                                                                                                                                                                                     |
