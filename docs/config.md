# Configuration

Style dictionaries are configuration driven. Your config file defines what executes and what to output when the style dictionary builds.

By default, Style Dictionary looks for a `config.json` file in the root of your package. If not found, it looks for a `config.js` file in the root of your package. You can also specify a custom location when you use the [CLI](using_the_cli.md). If you want a custom build system using the [npm module](using_the_npm_module.md), you can specify a custom location for a configuration file or use a plain Javascript object.

## config.js
You can find out more about creating configurations in JS in our documentation about using the [npm module](using_the_npm_module.md).

## config.json
 Here is a quick example:
```json
{
  "source": ["properties/**/*.json"],
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

| Attribute | Type | Description |
| :--- | :--- | :--- |
| parsers | Array[Object] (optional) | Custom token parsers to run on token files |
| parsers[].pattern | Regex | A file regular expression to match files the parser should run on. |
| parsers[].parser | Function | Parser function that takes the string content of the file and returns a plain Javascript object. |
| include | Array[String] (optional) | An array of path [globs](https://github.com/isaacs/node-glob) to Style Dictionary property files that contain default styles. The Style Dictionary uses this as a base collection of properties. The properties found using the "source" attribute will overwrite properties found using include. |
| source | Array[String] | An array of path [globs](https://github.com/isaacs/node-glob) to JSON files that contain style properties. The Style Dictionary will do a deep merge of all of the JSON files, allowing you to separate your properties into multiple files. |
| platforms | Object | An object containing platform config objects that describe how the Style Dictionary should build for that platform. You can add any arbitrary attributes on this object that will get passed to formats and actions (more on these in a bit). This is useful for things like build paths, name prefixes, variable names, etc.  |
| platform.transforms | Array[String] (optional) | An array of [transforms](transforms.md) to be performed on the style properties object. These will transform the properties in a non-destructive way, allowing each platform to transform the properties. Transforms to apply sequentially to all properties. Can be a built-in one or you can create your own. |
| platform.transformGroup | String (optional) | A string that maps to an array of transforms. This makes it easier to reference transforms by grouping them together. You must either define this or [transforms](transforms.md). |
| platform.buildPath | String (optional) | Base path to build the files, must end with a trailing slash. |
| platform.files | Array (optional) | Files to be generated for this platform. |
| platform.file.destination | String (optional) | Location to build the file, will be appended to the buildPath. |
| platform.file.format | String (optional) | [Format](formats.md) used to generate the file. Can be a built-in one or you can create your own via [registerFormat](api.md#registerformat). |
| platform.file.filter | String/Function/Object (optional) | A function, string or object used to filter the properties that will be included in the file. If a function is provided, each property will be passed to the function and the result (true or false) will determine whether the property is included. If an object is provided, each property will be matched against the object using a partial deep comparison. If a match is found, the property is included. If a string is passed, is considered a custom filter registered via [registerFilter](api.md#registerfilter) |
| platform.file.options | Object (optional) | A set of extra options associated with the file. Only includes 'showFileHeader' at this time. |
| platform.file.options.showFileHeader | Boolean | If the generated file should have a "Do not edit + Timestamp" header (where the format supports it). By default is "true". |
| platform.actions | Array[String] (optional) | [Actions](actions.md) to be performed after the files are built for that platform. Actions can be any arbitrary code you want to run like copying files, generating assets, etc. You can use pre-defined actions or create custom actions. |

----
