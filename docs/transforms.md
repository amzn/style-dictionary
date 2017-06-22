# Transforms

Transforms are functions that transform a property so that each platform can consume the property in different ways. A simple example is changing pixel values to point values for iOS and dp or sp for Android. Transforms are applied sequentially and in a non-destructive way so each platform can transform the properties.

A transform consists of 4 parts: type, name, matcher, and transformer. Transforms are run on all properties where the matcher returns true. *NOTE: if you don't provide a matcher function, it will match all properties.*

## Types
There are 3 types of transforms: attribute, name, and value.

### Attribute

An attribute transform adds to the attributes object on a property. This is for including any meta-data about a property such as it's CTI or other information.

### Name

A name transform transform the name of a property. You should really only be apply one name transformer because they will override each other if you use more than one.

### Value

The value transform is the most important as this is the one that changes the representation of the value. Colors can be turned into hex values, rgb, hsl, hsv, etc. Value transforms have a matcher function so that they only get run on certain properties. This allows us to only run a color transform on just the colors and not every property.

## Adding Custom Transforms
Having built-in transforms is nice, but the real power is in defining your own. You can add custom transforms in node with the `registerTransform` method on the style dictionary class.
```javascript
const StyleDictionary = require('style-dictionary');
const styleDictionary = StyleDictionary.extend('config.json');

styleDictionary.registerTransform({
  name: 'color/rgb',
  type: 'value',
  matcher: function (prop) {
    return prop.attributes.category === 'color'
  },
  transformer: function (prop, options) {
    return Color(prop.original.value).rgbString();
  }
});

styleDictionary.buildAllPlatforms();
```

You must supply a name, type, and transformer function to the registerTransform method. If you omit the matcher function, it will match all properties.

## [Default Transforms](https://amzn.github.io/style-dictionary/default_transforms)

## [Default Transform Groups](https://amzn.github.io/style-dictionary/default_transform_groups)
