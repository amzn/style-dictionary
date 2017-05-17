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

## Built-in Transforms
[lib/common/transforms.js](https://github.com/amznlabs/style-dictionary/blob/master/lib/common/transforms.js)

<table>
  <thead>
   <tr>
     <th>Name</th>
     <th>Type</th>
     <th>Matcher</th>
     <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>attribute/cti</td>
      <td>attribute</td>
      <td>all</td>
      <td>Adds: category, type, item, subitem, state. Based on path of the property.</td>
    </tr>
    <tr>
      <td>attribute/color</td>
      <td>attribute</td>
      <td>attributes.category === 'color'</td>
      <td>Adds: hex, hsl, hsv, rgb, red, blue, green</td>
    </tr>
    <tr>
      <td>name/human</td>
      <td>name</td>
      <td>all</td>
      <td>padding base</td>
    </tr>
    <tr>
      <td>name/cti/camel</td>
      <td>name</td>
      <td>all</td>
      <td>sizePaddingBase</td>
    </tr>
    <tr>
      <td>name/cti/kebab</td>
      <td>name</td>
      <td>all</td>
      <td>size-padding-base</td>
    </tr>
    <tr>
      <td>name/cti/snake</td>
      <td>name</td>
      <td>all</td>
      <td>size_padding_base</td>
    </tr>
    <tr>
      <td>name/cti/constant</td>
      <td>name</td>
      <td>all</td>
      <td>SIZE_PADDING_BASE</td>
    </tr>
    <tr>
      <td>name/ti/constant</td>
      <td>name</td>
      <td>all</td>
      <td>PADDING_BASE</td>
    </tr>
    <tr>
      <td>name/ti/pascal</td>
      <td>name</td>
      <td>all</td>
      <td>SizePaddingBase </td>
    </tr>
    <tr>
      <td>color/rgb</td>
      <td>value</td>
      <td>attributes.category === 'color'</td>
      <td>rgb(255,255,255)</td>
    </tr>
    <tr>
      <td>color/rgb</td>
      <td>value</td>
      <td>attributes.category === 'color'</td>
      <td>rgb(255,255,255)</td>
    </tr>
    <tr>
      <td>color/rgb_array</td>
      <td>value</td>
      <td>attributes.category === 'color'</td>
      <td>[255,255,255]</td>
    </tr>
    <tr>
      <td>color/hex</td>
      <td>value</td>
      <td>attributes.category === 'color'</td>
      <td>#ffffff</td>
    </tr>
    <tr>
      <td>color/UIColor</td>
      <td>value</td>
      <td>attributes.category === 'color'</td>
      <td>[UIColor colorWithRed:0.80f green:0.80f blue:0.80f alpha:1.0f]</td>
    </tr>
    <tr>
      <td>size/sp</td>
      <td>value</td>
      <td>attributes.category === 'size' && (prop.attributes.type === 'font' || prop.attributes.type === 'icon')</td>
      <td>10.0sp</td>
    </tr>
    <tr>
      <td>size/dp</td>
      <td>value</td>
      <td>attributes.category === 'size' && prop.attributes.type !== 'font' && prop.attributes.type !== 'icon'</td>
      <td>10.0dp</td>
    </tr>
    <tr>
      <td>size/remToSp</td>
      <td>value</td>
      <td>attributes.category === 'size' && (prop.attributes.type === 'font' || prop.attributes.type === 'icon')</td>
      <td>10.0sp</td>
    </tr>
    <tr>
      <td>size/remToDp</td>
      <td>value</td>
      <td>attributes.category === 'size' && prop.attributes.type !== 'font' && prop.attributes.type !== 'icon'</td>
      <td>10.0dp</td>
    </tr>
    <tr>
      <td>size/px</td>
      <td>value</td>
      <td>attributes.category === 'size'</td>
      <td>10px</td>
    </tr>
    <tr>
      <td>size/rem</td>
      <td>value</td>
      <td>attributes.category === 'size'</td>
      <td>10rem</td>
    </tr>
    <tr>
      <td>size/remToPt</td>
      <td>value</td>
      <td>attributes.category === 'size'</td>
      <td>10pt</td>
    </tr>
    <tr>
      <td>size/remToPx</td>
      <td>value</td>
      <td>attributes.category === 'size'</td>
      <td>10px</td>
    </tr>
  </tbody>
</table>
