---
title: Built-in transforms
---

:::tip
You can find the source code of the built-in transforms here:
[lib/common/transforms.js](https://github.com/amzn/style-dictionary/blob/main/lib/common/transforms.js)
:::

:::note
All the pre-defined transforms included in Style Dictionary **up until version 3** were using the [CTI structure](/info/tokens#category-type-item) for matching tokens.
If you structure your design tokens differently you will need to write [custom transforms](/reference/hooks/transforms#defining-custom-transforms) or make sure the proper CTIs are on the attributes of your design tokens.

From **version 4 onwards**, instead of using the CTI structure of a token object, we're determining the token's `type` by the `token.type` property.
Or, the `$type` property if you're using the [DTCG spec format](https://design-tokens.github.io/community-group/format/).

So instead of using `token.attributes.category` (v3), you will now use `token.type` (v4).
:::

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

---

### attribute/color

Adds: hex, hsl, hsv, rgb, red, blue, green.

```js
// Matches: token.type === 'color'
// Returns
{
  "hex": "009688",
  "rgb": {"r": 0, "g": 150, "b": 136, "a": 1},
  "hsl": {"h": 174.4, "s": 1, "l": 0.294, "a": 1},
  "hsv": {"h": 174.4, "s": 1, "l": 0.588, "a": 1},
}
```

---

### name/human

Creates a human-friendly name

```js
// Matches: All
// Returns:
'button primary';
```

---

### name/camel

Creates a camel case name. If you define a prefix on the platform in your config, it will prepend with your prefix

```js
// Matches: all
// Returns:
'colorBackgroundButtonPrimaryActive';
'prefixColorBackgroundButtonPrimaryActive';
```

---

### name/kebab

Creates a kebab case name. If you define a prefix on the platform in your config, it will prepend with your prefix

```js
// Matches: all
// Returns:
'color-background-button-primary-active';
'prefix-color-background-button-primary-active';
```

---

### name/snake

Creates a snake case name. If you define a prefix on the platform in your config, it will prepend with your prefix

```js
// Matches: all
// Returns:
'color_background_button_primary_active';
'prefix_color_background_button_primary_active';
```

---

### name/constant

Creates a constant-style name based on the full CTI of the token. If you define a prefix on the platform in your config, it will prepend with your prefix

```js
// Matches: all
// Returns:
'COLOR_BACKGROUND_BUTTON_PRIMARY_ACTIVE';
'PREFIX_COLOR_BACKGROUND_BUTTON_PRIMARY_ACTIVE';
```

---

### name/pascal

Creates a Pascal case name. If you define a prefix on the platform in your config, it will prepend with your prefix

```js
// Matches: all
// Returns:
'ColorBackgroundButtonPrimaryActive';
'PrefixColorBackgroundButtonPrimaryActive';
```

---

### color/rgb

Transforms the value into an RGB string

```js
// Matches: token.type === 'color'
// Returns:
'rgb(0, 150, 136)';
```

---

### color/hsl

Transforms the value into an HSL string or HSLA if alpha is present. Better browser support than color/hsl-4

```js
// Matches: token.type === 'color'
// Returns:
'hsl(174, 100%, 29%)';
'hsl(174, 100%, 29%, .5)';
```

---

### color/hsl-4

Transforms the value into an HSL string, using fourth argument if alpha is present.

```js
// Matches: token.type === 'color'
// Returns:
'hsl(174 100% 29%)';
'hsl(174 100% 29% / .5)';
```

---

### color/hex

Transforms the value into an 6-digit hex string

```js
// Matches: token.type === 'color'
// Returns:
'#009688';
```

---

### color/hex8

Transforms the value into an 8-digit hex string

```js
// Matches: token.type === 'color'
// Returns:
'#009688ff';
```

---

### color/hex8android

Transforms the value into an 8-digit hex string for Android because they put the alpha channel first

```js
// Matches: token.type === 'color'
// Returns:
'#ff009688';
```

---

### color/composeColor

Transforms the value into a Color class for Compose

```kotlin
// Matches: token.type === 'color'
// Returns:
Color(0xFF009688)
```

---

### color/UIColor

Transforms the value into an UIColor class for iOS

```objective-c
// Matches: token.type === 'color'
// Returns:
[UIColor colorWithRed:0.114f green:0.114f blue:0.114f alpha:1.000f]
```

---

### color/UIColorSwift

Transforms the value into an UIColor swift class for iOS

```swift
// Matches: token.type === 'color'
// Returns:
UIColor(red: 0.667, green: 0.667, blue: 0.667, alpha: 0.6)
```

---

### color/ColorSwiftUI

Transforms the value into an UIColor swift class for iOS

```swift
// Matches: token.type === 'color'
// Returns:
Color(red: 0.667, green: 0.667, blue: 0.667, opacity: 0.6)
```

---

### color/css

Transforms the value into a hex or rgb string depending on if it has transparency

```css
// Matches: token.type === 'color'
// Returns:
#000000
rgba(0,0,0,0.5)
```

---

### color/sketch

Transforms a color into an object with red, green, blue, and alpha
attributes that are floats from 0 - 1. This object is how Sketch stores
colors.

```js
// Matches: token.type === 'color'
// Returns:
{
  red: 0.5,
  green: 0.5,
  blue: 0.5,
  alpha: 1
}
```

---

### size/sp

Transforms the value into a scale-independent pixel (sp) value for font sizes on Android. It will not scale the number.

```js
// Matches: token.type === 'fontSize'
// Returns:
'10.0sp';
```

---

### size/dp

Transforms the value into a density-independent pixel (dp) value for non-font sizes on Android. It will not scale the number.

```js
// Matches: token.type === 'fontSize'
// Returns:
'10.0dp';
```

---

### size/object

Transforms the value into a useful object ( for React Native support )

```js
// Matches: token.type === 'dimension'
// Returns:
{
 original: "10px",
 number: 10,
 decimal: 0.1, // 10 divided by 100
 scale: 160, // 10 times 16
}
```

---

### size/remToSp

Transforms the value from a REM size on web into a scale-independent pixel (sp) value for font sizes on Android. It WILL scale the number by a factor of 16 (or the value of `basePxFontSize` on the platform in your config).

```js
// Matches: token.type === 'fontSize'
// Returns:
'16.0sp';
```

---

### size/remToDp

Transforms the value from a REM size on web into a density-independent pixel (dp) value for font sizes on Android. It WILL scale the number by a factor of 16 (or the value of `basePxFontSize` on the platform in your config).

```js
// Matches: token.type === 'fontSize'
// Returns:
'16.0dp';
```

---

### size/px

Adds 'px' to the end of the number. Does not scale the number

```js
// Matches: token.type === 'dimension'
// Returns:
'10px';
```

---

### size/rem

Adds 'rem' to the end of the number. Does not scale the number.

```js
// Matches: token.type === 'dimension'
// Returns:
'10rem';
```

---

### size/remToPt

Scales the number and adds 'pt' to the end.
The default `basePxFontSize` scale is `16`, [which can be configured on the platform in your config](https://styledictionary.com/reference/config/#platform).

```js
// Matches: token.type === 'dimension'
// Returns:
'16pt';
```

Configuring the `basePxFontSize`:

```json title="config.json"
{
  "platforms": {
    "css": {
      "transforms": ["size/rem"],
      "basePxFontSize": 14
    }
  }
}
```

---

### size/compose/remToSp

Transforms the value from a REM size on web into a scale-independent pixel (sp) value for font sizes in Compose. It WILL scale the number by a factor of 16 (or the value of `basePxFontSize` on the platform in your config).

```kotlin
// Matches: token.type === 'fontSize'
// Returns:
"16.0.sp"
```

---

### size/compose/remToDp

Transforms the value from a REM size on web into a density-independent pixel (dp) value for font sizes in Compose. It WILL scale the number by a factor of 16 (or the value of `basePxFontSize` on the platform in your config).

```kotlin
// Matches: token.type === 'fontSize'
// Returns:
"16.0.dp"
```

---

### size/compose/em

Adds the .em Compose extension to the end of a number. Does not scale the value

```kotlin
// Matches: token.type === 'fontSize'
// Returns:
"16.0em"
```

---

### size/swift/remToCGFloat

Scales the number by 16 (or the value of `basePxFontSize` on the platform in your config) to get to points for Swift and initializes a CGFloat

```js
// Matches: token.type === 'dimension'
// Returns: "CGFloat(16.00)""
```

---

### size/remToPx

Scales the number by 16 (or the value of `basePxFontSize` on the platform in your config) and adds 'px' to the end.

```js
// Matches: token.type === 'dimension'
// Returns:
'16px';
```

---

### size/pxToRem

Scales non-zero numbers to rem, and adds 'rem' to the end. If you define a "basePxFontSize" on the platform in your config, it will be used to scale the value, otherwise 16 (default web font size) will be used.

```js
// Matches: token.type === 'dimension'
// Returns:
'0';
'1rem';
```

---

### html/icon

Takes an HTML entity and transforms it into a form CSS can use.

```js
// Matches: token.type === 'html'
// Returns:
"'\\E001'";
```

---

### content/quote

Wraps the value in a single quoted string

```js
// Matches: token.type === 'content'
// Returns:
"'string'";
```

---

### content/objC/literal

Wraps the value in a double-quoted string and prepends an '@' to make a string literal.

```objective-c
// Matches: token.type === 'content'
// Returns:
**&quot;string&quot;**:
```

---

### content/swift/literal

Wraps the value in a double-quoted string to make a string literal.

```swift
// Matches: token.type === 'content'
// Returns:
"string"
```

---

### time/seconds

Assumes a time in miliseconds and transforms it into a decimal

```js
// Matches: token.type === 'time'
// Returns:
'0.5s';
```

---

### fontFamily/css

Transforms `fontFamily` type token (which can be an array) into a CSS string, putting single quotes around font names that contain spaces where necessary.
Also handles the `fontFamily` property inside `typography` type object-values.

[DTCG definition](https://design-tokens.github.io/community-group/format/#font-family)

```css
/**
 * Matches: token.type === 'fontFamily' || token.type === 'typography'
 * Returns:
 */
:root {
  --var: 'Arial Black', Helvetica, sans-serif;
}
```

---

### cubicBezier/css

Transforms `cubicBezier` type token into a CSS string, using the CSS `cubic-bezier` function.
Also handles the `timingFunction` property inside `transition` type object-values.

[DTCG definition](https://design-tokens.github.io/community-group/format/#cubic-bezier)

```css
/**
 * Matches: token.type === 'cubicBezier' || token.type === 'transition'
 * Returns:
 */
:root {
  --var: cubic-bezier(0, 0, 0.5, 1);
}
```

---

### strokeStyle/css/shorthand

Transforms `strokeStyle` type object-value token into a CSS string, using the CSS `dashed` fallback.

[DTCG definition](https://design-tokens.github.io/community-group/format/#stroke-style)

```css
/**
 * Matches: token.type === 'strokeStyle'
 * Returns:
 */
:root {
  --var: dashed;
}
```

---

### border/css/shorthand

Transforms `border` type object-value token into a CSS string, using the CSS `border` shorthand notation.

[DTCG definition](https://design-tokens.github.io/community-group/format/#border)

```css
/**
 * Matches: token.type === 'border'
 * Returns:
 */
:root {
  --var: 2px solid #000000;
}
```

---

### typography/css/shorthand

Transforms `typography` type object-value token into a CSS string, using the CSS `font` shorthand notation.

[DTCG definition](https://design-tokens.github.io/community-group/format/#typography)

```css
/**
 * Matches: token.type === 'typography'
 * Returns:
 */
:root {
  --var: italic 400 1.2rem/1.5 'Fira Sans', sans-serif;
}
```

---

### transition/css/shorthand

Transforms `transition` type object-value token into a CSS string, using the CSS `transition` shorthand notation.

[DTCG definition](https://design-tokens.github.io/community-group/format/#transition)

```css
/**
 * Matches: token.type === 'transition'
 * Returns:
 */
:root {
  --var: 200ms ease-in-out 50ms;
}
```

---

### shadow/css/shorthand

Transforms `shadow` type object-value token (which can also be an array) into a CSS string, using the CSS `shadow` shorthand notation.

[DTCG definition](https://design-tokens.github.io/community-group/format/#shadow)

```css
/**
 * Matches: token.type === 'shadow'
 * Returns:
 */
:root {
  --var: 2px 4px 8px 10px #000000, 1px 1px 4px #cccccc;
}
```

---

### asset/url

Wraps the value in a [CSS `url()` function](https://developer.mozilla.org/en-US/docs/Web/CSS/url)

```js
// Matches: token.type === 'asset'
// Returns:
url('https://www.example.com/style.css');
```

---

### asset/base64

Wraps the value in a double-quoted string and prepends an '@' to make a string literal.

```js
// Matches: token.type === 'asset'
// Returns:
'IyBlZGl0b3Jjb25maWcub3JnCnJvb3QgPSB0cnVlCgpbKl0KaW5kZW50X3N0eWxlID0gc3BhY2UKaW5kZW50X3NpemUgPSAyCmVuZF9vZl9saW5lID0gbGYKY2hhcnNldCA9IHV0Zi04CnRyaW1fdHJhaWxpbmdfd2hpdGVzcGFjZSA9IHRydWUKaW5zZXJ0X2ZpbmFsX25ld2xpbmUgPSB0cnVlCgpbKi5tZF0KdHJpbV90cmFpbGluZ193aGl0ZXNwYWNlID0gZmFsc2U=';
```

---

### asset/path

Prepends the local file path

```js
// Matches: token.type === 'asset'
// Returns:
'path/to/file/asset.png';
```

---

### asset/objC/literal

Wraps the value in a double-quoted string and prepends an '@' to make a string literal.

```objective-c
// Matches: token.type === 'asset'
// Returns: @"string"
```

---

### asset/swift/literal

Wraps the value in a double-quoted string to make a string literal.

```swift
// Matches: token.type === 'asset'
// Returns: "string"
```

---

### color/hex8flutter

Transforms the value into a Flutter Color object using 8-digit hex with the alpha chanel on start

```js
// Matches: token.type === 'color'
// Returns:
Color(0xff00ff5f);
```

---

### content/flutter/literal

Wraps the value in a double-quoted string to make a string literal.

```dart
// Matches: token.type === 'content'
// Returns: "string"
```

---

### asset/flutter/literal

Wraps the value in a double-quoted string to make a string literal.

```dart
// Matches: token.type === 'asset'
// Returns: "string"
```

---

### size/flutter/remToDouble

Scales the number by 16 (or the value of `basePxFontSize` on the platform in your config) to get to points for Flutter

```dart
// Matches: token.type === 'dimension'
// Returns: 16.00
```

---
