# Extending

There is a straightforward way to extend Style Dictionary to meet your needs - since we don't know exactly how everyone will want to use style dictionaries in their project, we created custom transforms and formats as a manner to add your desired functionality.

## Extension Functions in the API
* [registerTransform](api.md#registertransform)
* [registerTransformGroup](api.md#registertransformgroup)
* [registerFilter](api.md#registerfilter)
* [registerFormat](api.md#registerformat)
* [registerTemplate](api.md#registertemplate) (deprecated)
* [registerAction](api.md#registeraction)
* [registerParser](api.md#registerparser)

## Extension Examples
Importing a configuration, defining a new `time/seconds` transform, and building the style dictionary.

```javascript
const StyleDictionary = require('style-dictionary').extend('config.json');

StyleDictionary.registerTransform({
  name: 'time/seconds',
  type: 'value',
  matcher: function(token) {
    return token.attributes.category === 'time';
  },
  transformer: function(token) {
    return (parseInt(token.original.value) / 1000).toString() + 's';
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
  transformer: function(token) {
    return token.path.join('_').toUpperCase();
  }
});

module.exports = StyleDictionary;

// package b
const StyleDictionary = require('package-a');
```
