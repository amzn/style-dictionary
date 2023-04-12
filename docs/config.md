# Configuration

Style dictionaries are configuration driven. Your configuration lets Style Dictionary know:

1. Where to find your [design tokens](tokens.md)
1. How to transform and format them to generate output files

Here is an example configuration: 

```json
{
  "source": ["tokens/**/*.json"],
  "platforms": {
    "scss": {
      "transformGroup": "scss",
      "prefix": "sd",
      "buildPath": "build/scss/",
      "files": [{
        "destination": "_variables.scss",
        "format": "scss/variables"
      }],
      "actions": ["copy_assets"]
    },
    "android": {
      "transforms": ["attribute/cti", "name/cti/snake", "color/hex", "size/remToSp", "size/remToDp"],
      "buildPath": "build/android/src/main/res/values/",
      "files": [{
        "destination": "style_dictionary_colors.xml",
        "format": "android/colors"
      }]
    }
  }
}
```

## Configuration file formats

Style Dictionary supports configuration files in these file formats:

* JSON
* JSONC
* JSON5
* Javascript (CommonJS)

Here is an example using a CommonJS module for configuration:

```javascript
// config.js
module.exports = {
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
      transformer: (token) => token.path.join('_').toUpperCase()
    }
  },
  // Same with formats, you can now write them directly to this config
  // object. The name of the format is the key.
  format: {
    myFormat: ({dictionary, platform}) => {
      return dictionary.allTokens.map(token => `${token.name}: ${token.value}`).join('\n');
    }
  },
  platforms: {
    // ...
  }
}
```

Some interesting things you can do in a CommonJS file that you cannot do in a JSON file:

* Add custom transforms, formats, filters, actions, and parsers
* Programmatically generate your configuration


----


## Using configuration files

By default, the Style Dictionary [CLI](using_the_cli.md) looks for a `config.json` or `config.js` file in the root of your package.

```json5
// package.json
"scripts": {
  "build": "style-dictionary build"
}
```

You can also specify a custom location when you use the [CLI](using_the_cli.md) with the `--config` parameter.

```json5
// package.json
"scripts": {
  "build": "style-dictionary build --config ./sd.config.js"
}
```

## Using in Node

You can also use Style Dictionary as an [npm module](using_the_npm_module.md) and further customize how Style Dictionary is run, for example running Style Dictionary multiple times with different configurations. To do this you would create a Javascript file that imports the Style Dictionary npm module and calls the [`.extend`](api.md#extend) and [`.buildAllPlatforms`](api.md#buildallplatforms) functions.

```javascript
// build.js
const StyleDictionary = require('style-dictionary');

const myStyleDictionary = StyleDictionary.extend({
  // configuration
});

myStyleDictionary.buildAllPlatforms();

// You can also extend Style Dictionary multiple times:
const myOtherStyleDictionary = myStyleDictionary.extend({
  // new configuration
});

myOtherStyleDictionary.buildAllPlatforms();
```

You would then change your npm script or CLI command to run that file with Node:

```json5
// package.json
"scripts": {
  "build": "node build.js"
}
```

----


## Attributes

| Attribute | Type | Description |
| :--- | :--- | :--- |
| transform | Object (optional) | Custom [transforms](transforms.md) you can include inline rather than using `.registerTransform`. The keys in this object will be the transform's name, the value should be an object with `type`
| format | Object (optional) | Custom [formats](formats.md) you can include inline in the configuration rather than using `.registerFormat`. The keys in this object will be for format's name and value should be the formatter function.
| action | Object (optional) | Custom inline [actions](actions.md). The keys in this object will be the action's name and the value should be an object containing `do` and `undo` methods.
| parsers | Array[Parser] (optional) | Custom [file parsers](parsers.md) to run on input files |
| include | Array[String] (optional) | An array of file path [globs](https://github.com/isaacs/node-glob) to design token files that contain default styles. Style Dictionary uses this as a base collection of design tokens. The tokens found using the "source" attribute will overwrite tokens found using include. |
| source | Array[String] | An array of file path [globs](https://github.com/isaacs/node-glob) to design token files. Style Dictionary will do a deep merge of all of the token files, allowing you to organize your files however you want. |
| tokens | Object | The tokens object is a way to include inline design tokens as opposed to using the `source` and `include` arrays. 
| properties | Object | **DEPRECATED** The properties object has been renamed to `tokens`. Using the `properties` object will still work for backwards compatibility. 
| platforms | Object[Platform] | An object containing [platform](#platform) config objects that describe how the Style Dictionary should build for that platform. You can add any arbitrary attributes on this object that will get passed to formats and actions (more on these in a bit). This is useful for things like build paths, name prefixes, variable names, etc.

### Platform

A platform is a build target that tells Style Dictionary how to properly transform and format your design tokens for output to a specific platform. You can have as many platforms as you need and you can name them anything, there are no restrictions.

| Attribute | Type | Description |
| :--- | :--- | :--- |
| transforms | Array[String] (optional) | An array of [transforms](transforms.md) to be performed on the design tokens. These will transform the tokens in a non-destructive way, allowing each platform to transform the tokens. Transforms to apply sequentially to all tokens. Can be a built-in one or you can create your own.
| transformGroup | String (optional) | A string that maps to an array of transforms. This makes it easier to reference transforms by grouping them together. You must either define this or [transforms](transforms.md).
| buildPath | String (optional) | Base path to build the files, must end with a trailing slash.
| options | Object (optional) | Options that apply to all files in the platform, for example `outputReferences` and `showFileHeader`
| files | Array[File] (optional) | [Files](#file) to be generated for this platform.
| actions | Array[String] (optional) | [Actions](actions.md) to be performed after the files are built for that platform. Actions can be any arbitrary code you want to run like copying files, generating assets, etc. You can use pre-defined actions or create custom actions.

### File

A File configuration object represents a single output file. The `options` object on the file configuration will take precedence over the `options` object defined at the platform level.

| Attribute | Type | Description |
| :--- | :--- | :--- |
| destination | String | Location to build the file, will be appended to the buildPath. |
| format | String (optional) | [Format](formats.md) used to generate the file. Can be a built-in one or you can create your own via [registerFormat](api.md#registerformat). |
| filter | String/Function/Object (optional) | A function, string or object used to filter the tokens that will be included in the file. If a function is provided, each design token will be passed to the function and the result (true or false) will determine whether the design token is included. If an object is provided, each design token will be matched against the object using a partial deep comparison. If a match is found, the design token is included. If a string is passed, is considered a custom filter registered via [registerFilter](api.md#registerfilter) |
| options | Object (optional) | A set of extra options associated with the file. Includes `showFileHeader` and `outputReferences`. |
| options.showFileHeader | Boolean | If the generated file should have a comment at the top about being generated. The default fileHeader comment has "Do not edit + Timestamp". By default is "true". |
| options.fileHeader | String/Function (optional) | A custom fileHeader that can be either a name of a registered file header (string) or an inline [fileHeader](formats.md#customfileheader) function.
| options.outputReferences | Boolean | If the file should keep token [references](formats.md#references-in-output-files). By default this is "false".
