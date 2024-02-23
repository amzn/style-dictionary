# Extending

There is a straightforward way to extend Style Dictionary to meet your needs - since we don't know exactly how everyone will want to use style dictionaries in their project, we created custom transforms and formats as a manner to add your desired functionality.

## Extension Functions in the API

- [registerTransform](api.md#registertransform)
- [registerTransformGroup](api.md#registertransformgroup)
- [registerFilter](api.md#registerfilter)
- [registerFormat](api.md#registerformat)
- [registerAction](api.md#registeraction)
- [registerParser](api.md#registerparser)
- [registerPreprocessor](api.md#registerpreprocessor)

> Note: all of these now support async functions as well.

## Extension Examples

Importing a configuration, defining a new `time/seconds` transform, and building the style dictionary.

```javascript
import StyleDictionary from 'style-dictionary';

StyleDictionary.registerTransform({
  name: 'time/seconds',
  type: 'value',
  matcher: function (token) {
    return token.attributes.category === 'time';
  },
  transformer: function (token) {
    return (parseInt(token.original.value) / 1000).toString() + 's';
  },
});

const sd = new StyleDictionary('config.json');
await sd.buildAllPlatforms();
```

Export your extended style dictionary as a node module (without building) if you need other projects to depend on it.

```javascript
// package a
import StyleDictionary from 'style-dictionary';

StyleDictionary.registerTransform({
  name: 'name/uppercase',
  type: 'name',
  transformer: function (token) {
    return token.path.join('_').toUpperCase();
  },
});

const sd = new StyleDictionary('config.json');

export default sd;

// package b
import sd from 'package-a';
```
