# Configuration

Style dictionaries are configuration driven.

## config.json
The default way is to use a config.json file in the root of your package. Here is a quick example:
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
        "template": "android/colors"
      }]
    }
  }
}
```

### source
An array of paths to JSON files which supports path globs. The Style Dictionary will do a deep merge of all of the JSON files so you can separate your properties into multiple files.

### platforms
An object containing platform config objects that describe how the Style Dictionary should build for that platform. You can add any arbitrary attributes on this object that will get passed to formats/templates and actions (more on these in a bit). This is useful for things like build paths, name prefixes, variable names, etc. Platforms have the following attributes:

#### transformGroup
A string that maps to an array of transforms. This makes it easier perform transforms by grouping them together.

#### transforms
An array of transforms to be performed on the style properties object. These will transform the properties in a non-desctructive way so each platform can transform the properties.
