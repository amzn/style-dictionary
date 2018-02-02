# Extending

The style dictionary build system is made to be extended. We don't know exactly how everyone will want to use style dictionaries in their project, which is why it is easy to create custom transforms, templates, and formats.

* [registerTransform](api.md#registertransform)
* [registerTransformGroup](api.md#registertransformgroup)
* [registerFormat](api.md#registerformat)
* [registerTemplate](api.md#registertemplate)
* [registerAction](api.md#registeraction)

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
StyleDictionary.registerTransform({
  name: 'name/uppercase',
  type: 'name',
  transformer: function(prop) {
    return prop.path.join('_').toUppercase();
  }
});

module.exports = StyleDictionary;

// package b
const StyleDictionary = require('package-a');
```
