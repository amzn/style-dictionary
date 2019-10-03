# Extending

The style dictionary build system is easily extended. We don't know exactly how everyone will want to use style dictionaries in their project, which is why we made it simple to create custom transforms and formats.

## Extension Functions in the API
* [registerTransform](api.md#registertransform)
* [registerTransformGroup](api.md#registertransformgroup)
* [registerFilter](api.md#registerfilter)
* [registerFormat](api.md#registerformat)
* [registerTemplate](api.md#registertemplate) (deprecated)
* [registerAction](api.md#registeraction)

## Extension Examples
Importing a configuration, defining a new `time/seconds` transform, and building the style dictionary.

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


Export your extended style dictionary as a node module (without building) if you need other projects to depend on it.

```javascript
// package a
const StyleDictionary = require('style-dictionary').extend('config.json');
StyleDictionary.registerTransform({
  name: 'name/uppercase',
  type: 'name',
  transformer: function(prop) {
    return prop.path.join('_').toUpperCase();
  }
});

module.exports = StyleDictionary;

// package b
const StyleDictionary = require('package-a');
```
