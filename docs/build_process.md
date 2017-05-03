# Build Process

Here is what the build system is doing under the hood. 

![build structure](https://github.com/amznlabs/style-dictionary/blob/master/images/build-diagram.png)

1. The build system looks for a config file, if you don't specify it looks for config.json in the current directory.
1. It finds all the JSON files in the source attribute in the config and performs a deep merge.
1. From this all properties object, we iterate over the platforms in the config and:
  1. Perform all transforms, in order, defined in the transforms attribute or transformGroup.
  1. Build all files defined in the files array
  1. Perform any actions defined in the actions attribute


## Node

If you use this as a node module, steps 1 and 2 are slightly different. 

```javascript
const StyleDictionary = require('style-dictionary');

// extend performs the deep merge of the properties
const styleDictionary = StyleDictionary.extend( 'config.json' );

// You can also extend with an object
// const styleDictionary = StyleDictionary.extend({ /* config options */ });

// This will perform step 3 above, for each platform:
// 1. Apply transforms
// 2. Build files
// 3. Perform actions
styleDictionary.buildAllPlatforms();
```
