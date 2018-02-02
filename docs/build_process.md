# Build Process

Here is what the build system is doing under the hood.

![build structure](assets/build-diagram.png)

## CLI

1. The build system looks for a config file. By default it looks for config.json in the current directory, or you can specify the config path with the `-c --config` flag.
1. If there is an `includes` attribute in the config, it will take those JSON files and deep merge them into the `properties` object.
1. It then takes all the JSON files in the `source` attribute in the config and performs a deep merge onto the `properties` object.
1. Then it iterates over the platforms in the config and:
  1. Perform all transforms, in order, defined in the transforms attribute or transformGroup.
  1. Build all files defined in the files array
  1. Perform any actions defined in the actions attribute


## Node

If you use this as a node module, the steps are slightly different, but the overall.

1. When you call the [`extend`](api.md#extend) method, you can either pass it a path to a JSON config file, or give it a plain object that has the configuration. This will perform steps 1-3 above.
1. Then you can now call `buildAllPlatforms` or other methods like `buildPlatform('scss')` or `exportPlatform('javascript')`. This is equivalent to step 4 above.

```javascript
const StyleDictionary = require('style-dictionary');

const styleDictionary = StyleDictionary.extend( 'config.json' );
// is equivalent to this:
// const styleDictionary = StyleDictionary.extend(
//   JSON.parse( fs.readFileSync( 'config.json' ) )
// )

// You can also extend with an object
// const styleDictionary = StyleDictionary.extend({ /* config options */ });

// This will perform step 3 above, for each platform:
// 1. Apply transforms
// 2. Build files
// 3. Perform actions
styleDictionary.buildAllPlatforms();
```
