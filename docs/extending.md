# Extending

The style dictionary build system is made to be extended. We don't know exactly how everyone will want to use style dictionaries in their project, which is why it is easy to create custom transforms, templates, and formats.

```javascript
const StyleDictionary = require('style-dictionary').extend('config.json');

StyleDictionary.registerTransform({
  name: 'time/seconds',
  type: 'value',
  matcher: function(prop) {
    return prop.attributes.category === 'time';
  },
  transformer: function(prop) {
    return (parseInt(prop.original.value) / 1000).toString() + 's';
  }
});

StyleDictionary.buildAllPlatforms();
```

You can also export your extended style dictionary as a node module if you need other projects to depend on it. 
 
```javascript
// package a
const StyleDictionary = require('style-dictionary').extend('config.json');
module.exports = StyleDictionary;

// package b
const StyleDictionary = require('package-a');
```

## Transforms

```javascript
const StyleDictionary = require('style-dictionary').extend('config.json');

StyleDictionary.registerTransform({
  name: 'time/seconds',
  type: 'value',
  matcher: function(prop) {
    return prop.attributes.category === 'time';
  },
  transformer: function(prop) {
    return (parseInt(prop.original.value) / 1000).toString() + 's';
  }
});

StyleDictionary.buildAllPlatforms();
```

## TransformGroup

To register a new transform group you just need a name and an array of transforms (as strings). You will get an error if any of the transforms you include are not already registered. Point being: register transforms first, then transform groups. 

```javascript
const StyleDictionary = require('style-dictionary').extend('config.json');

StyleDictionary.registerTransformGroup({
  name: 'Swift',
  transforms: [
    'attribute/cti',
    'size/pt',
    'name/cti'
  ]
});

StyleDictionary.buildAllPlatforms();
```

## Formats

```javascript
const StyleDictionary = require('style-dictionary').extend('config.json');

StyleDictionary.registerFormat({
  name: 'Swift/colors',
  formatter: function(dictionary, config) {
    // dictionary is has 2 attributes: properties and allProperties
    // properties is the merged data structure of the style dictionary
    // allProperties is a flat array of all properties
    //
    // config is the platform this is being called in (defined in config.json)
    // You can access to arbitrary values in the config this way like config.prefix
    //
    // 'this' is bound to the file object this format is being used for
    // You can access values here specific to the file being generated
    // so that the format can be re-used with different configuration.
  }
});

StyleDictionary.buildAllPlatforms();
```


## Templates

```javascript
const StyleDictionary = require('style-dictionary').extend('config.json');

StyleDictionary.registerTemplate({
  name: 'Swift/colors',
  template: __dirname + '/templates/swift/colors.template'
});

StyleDictionary.buildAllPlatforms();
```

## Actions

```javascript
const StyleDictionary = require('style-dictionary').extend('config.json');

StyleDictionary.registerAction({
  name: 'copy_assets',
  action: function(dictionary, config) {
    console.log('Copying assets directory');
    fs.copySync('assets', config.buildPath + 'assets');
  }
});

StyleDictionary.buildAllPlatforms();
```
