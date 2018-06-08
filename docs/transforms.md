# Transforms

Transforms are functions that transform a property so that each platform can consume the property in different ways. A simple example is changing pixel values to point values for iOS and dp or sp for Android. Transforms are applied in a non-destructive way so each platform can transform the properties. Transforms are performed sequentially, so the order you use transforms matters. You can define custom transforms with the [`registerTransform`](api.md#registertransform).

You use transforms in your config file under platforms > [platform] > transforms

```json
{
  "source": ["properties/**/*.json"],
  "platforms": {
    "android": {
      "transforms": ["attribute/cti", "name/cti/kebab", "color/hex", "size/rem"]
    }
  }
}
```

A transform consists of 4 parts: type, name, matcher, and transformer. Transforms are run on all properties where the matcher returns true. *NOTE: if you don't provide a matcher function, it will match all properties.*

### Transform Types
There are 3 types of transforms: attribute, name, and value.

**Attribute:** An attribute transform adds to the attributes object on a property. This is for including any meta-data about a property such as it's CTI or other information.

**Name:** A name transform transform the name of a property. You should really only be apply one name transformer because they will override each other if you use more than one.

**Value:** The value transform is the most important as this is the one that changes the representation of the value. Colors can be turned into hex values, rgb, hsl, hsv, etc. Value transforms have a matcher function so that they only get run on certain properties. This allows us to only run a color transform on just the colors and not every property.

----

## Pre-defined Transforms

[lib/common/transforms.js](https://github.com/amzn/style-dictionary/blob/master/lib/common/transforms.js)

> All the pre-defined transforms included use the [CTI structure](package_structure.md#properties) for the match properties. If you structure your style properties differently you will need to write [custom transforms](#custom-transforms) or make sure the property CTIs are on the attributes of your properties.

### attribute/cti 


Adds: category, type, item, subitem, and state on the attributes object based on the location in the style dictionary.

```js
// Matches: all
// Returns:
{
  "category": "color",
  "type": "background",
  "item": "button",
  "subitem": "primary",
  "state": "active"
}
```


* * *

### attribute/color 


Adds: hex, hsl, hsv, rgb, red, blue, green.

```js
// Matches: prop.attributes.category === 'color'
// Returns
{
  "hex": "009688",
  "rgb": {"r": 0, "g": 150, "b": 136, "a": 1},
  "hsl": {"h": 174.4, "s": 1, "l": 0.294, "a": 1},
  "hsv": {"h": 174.4, "s": 1, "l": 0.588, "a": 1},
}
```


* * *

### name/human 


Creates a human-friendly name

```js
// Matches: All
// Returns:
"button primary"
```


* * *

### name/cti/camel 


Creates a camel case name. If you define a prefix on the platform in your config, it will prepend with your prefix

```js
// Matches: all
// Returns:
"colorBackgroundButtonPrimaryActive"
"prefixColorBackgroundButtonPrimaryActive"
```


* * *

### name/cti/kebab 


Creates a kebab case name. If you define a prefix on the platform in your config, it will prepend with your prefix

```js
// Matches: all
// Returns:
"color-background-button-primary-active"
"prefix-color-background-button-primary-active"
```


* * *

### name/cti/snake 


Creates a snake case name. If you define a prefix on the platform in your config, it will prepend with your prefix

```js
// Matches: all
// Returns:
"color_background_button_primary_active"
"prefix_color_background_button_primary_active"
```


* * *

### name/cti/constant 


Creates a constant-style name based on the full CTI of the property. If you define a prefix on the platform in your config, it will prepend with your prefix

```js
// Matches: all
// Returns:
"COLOR_BACKGROUND_BUTTON_PRIMARY_ACTIVE"
"PREFIX_COLOR_BACKGROUND_BUTTON_PRIMARY_ACTIVE"
```


* * *

### name/ti/constant 


Creates a constant-style name on just the type and item of the property. This is useful if you want to create different static classes/files for categories like `Color.BACKGROUND_BASE`. If you define a prefix on the platform in your config, it will prepend with your prefix.

```js
// Matches: all
// Returns:
"BACKGROUND_BUTTON_PRIMARY_ACTIVE"
"PREFIX_BACKGROUND_BUTTON_PRIMARY_ACTIVE"
```


* * *

### name/cti/pascal 


Creates a Pascal case name. If you define a prefix on the platform in your config, it will prepend with your prefix

```js
// Matches: all
// Returns:
"ColorBackgroundButtonPrimaryActive"
"PrefixColorBackgroundButtonPrimaryActive"
```


* * *

### color/rgb 


Transforms the value into an RGB string

```js
// Matches: prop.attributes.category === 'color'
// Returns:
"rgb(0, 150, 136)"
```


* * *

### color/hex 


Transforms the value into an 6-digit hex string

```js
// Matches: prop.attributes.category === 'color'
// Returns:
"#009688"
```


* * *

### color/hex8 


Transforms the value into an 8-digit hex string

```js
// Matches: prop.attributes.category === 'color'
// Returns:
"#009688ff"
```


* * *

### color/hex8android 


Transforms the value into an 8-digit hex string for Android because they put the alpha channel first

```js
// Matches: prop.attributes.category === 'color'
// Returns:
"#ff009688"
```


* * *

### color/UIColor 


Transforms the value into an UIColor class for iOS

```objectivec
// Matches: prop.attributes.category === 'color'
// Returns:
[UIColor colorWithRed:0.00f green:0.59f blue:0.53f alpha:1.0f]
```


* * *

### color/css 


Transforms the value into a hex or rgb string depending on if it has transparency

```css
// Matches: prop.attributes.category === 'color'
// Returns:
#000000
rgba(0,0,0,0.5)
```


* * *

### size/sp 


Transforms the value into a scale-independent pixel (sp) value for font sizes on Android. It will not scale the number.

```js
// Matches: prop.attributes.category === 'size' && prop.attributes.type === 'font'
// Returns:
"10.0sp"
```


* * *

### size/dp 


Transforms the value into a density-independent pixel (dp) value for non-font sizes on Android. It will not scale the number.

```js
// Matches: prop.attributes.category === 'size' && prop.attributes.type !== 'font'
// Returns:
"10.0dp"
```


* * *

### size/remToSp 


Transforms the value from a REM size on web into a scale-independent pixel (sp) value for font sizes on Android. It WILL scale the number by a factor of 16 (common base font size on web).

```js
// Matches: prop.attributes.category === 'size' && prop.attributes.type === 'font'
// Returns:
"16.0sp"
```


* * *

### size/remToDp 


Transforms the value from a REM size on web into a density-independent pixel (dp) value for font sizes on Android. It WILL scale the number by a factor of 16 (common base font size on web).

```js
// Matches: prop.attributes.category === 'size' && prop.attributes.type !== 'font'
// Returns:
"16.0dp"
```


* * *

### size/px 


Adds 'px' to the end of the number. Does not scale the number

```js
// Matches: prop.attributes.category === 'size'
// Returns:
"10px"
```


* * *

### size/rem 


Adds 'rem' to the end of the number. Does not scale the number

```js
// Matches: prop.attributes.category === 'size'
// Returns:
"10rem"
```


* * *

### size/remToPt 


Scales the number by 16 (default web font size) and adds 'pt' to the end.

```js
// Matches: prop.attributes.category === 'size'
// Returns:
"16pt"
```


* * *

### size/remToPx 


Scales the number by 16 (default web font size) and adds 'px' to the end.

```js
// Matches: prop.attributes.category === 'size'
// Returns:
"16px"
```


* * *

### content/icon 


Takes a unicode point and transforms it into a form CSS can use.

```js
// Matches: prop.attributes.category === 'content' && prop.attributes.type === 'icon'
// Returns:
"'\\E001'"
```


* * *

### content/quote 


Wraps the value in a single quoted string

```js
// Matches: prop.attributes.category === 'content'
// Returns:
"'string'"
```


* * *

### content/objC/literal 


Wraps the value in a double-quoted string and prepends an '@' to make a string literal.

```objectivec
// Matches: prop.attributes.category === 'content'
// Returns:

**&quot;string&quot;**: ```  

* * *

### font/objC/literal 


Wraps the value in a double-quoted string and prepends an '@' to make a string literal.

```objectivec
// Matches: prop.attributes.category === 'font'
// Returns: @"string"
```


* * *

### time/seconds 


Assumes a time in miliseconds and transforms it into a decimal

```js
// Matches: prop.attributes.category === 'time'
// Returns:
"0.5s"
```


* * *

### asset/base64 


Wraps the value in a double-quoted string and prepends an '@' to make a string literal.

```js
// Matches: prop.attributes.category === 'asset'
// Returns:
'IyBlZGl0b3Jjb25maWcub3JnCnJvb3QgPSB0cnVlCgpbKl0KaW5kZW50X3N0eWxlID0gc3BhY2UKaW5kZW50X3NpemUgPSAyCmVuZF9vZl9saW5lID0gbGYKY2hhcnNldCA9IHV0Zi04CnRyaW1fdHJhaWxpbmdfd2hpdGVzcGFjZSA9IHRydWUKaW5zZXJ0X2ZpbmFsX25ld2xpbmUgPSB0cnVlCgpbKi5tZF0KdHJpbV90cmFpbGluZ193aGl0ZXNwYWNlID0gZmFsc2U='
```


* * *

### asset/path 


Prepends the local file path

```js
// Matches: prop.attributes.category === 'asset'
// Returns:
"path/to/file/asset.png"
```


* * *

### asset/objC/literal 


Wraps the value in a double-quoted string and prepends an '@' to make a string literal.

```objectivec
// Matches: prop.attributes.category === 'asset'
// Returns: @"string"
```


* * *

