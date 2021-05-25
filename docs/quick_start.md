# Quick Start

## Installation

*Note that you must have [node (and npm) installed](https://www.npmjs.com/get-npm) before you can follow this guide.*

If you want to use the CLI, you can install it globally via npm:

```bash
$ npm install -g style-dictionary
```

Or you can install it like a normal npm dependency. Style Dictionary is a build tool, and you are most likely to use it as a dev dependency:

```bash
$ npm install -D style-dictionary
```

## Creating a New Project

The CLI comes with some starter code to get a new project started easily.

```bash
$ mkdir MyStyleD
$ cd MyStyleD
$ style-dictionary init basic
```

This command will copy over the example files found in the [basic example](https://github.com/amzn/style-dictionary/tree/main/examples/basic) in this repo and then run the `style-dictionary build` command to generate the build artifacts. You should see something like this output:

```
Copying starter files...

Source style dictionary starter files created!

Running `style-dictionary build` for the first time to generate build artifacts.


scss
✔︎  build/scss/_variables.scss

android
✔︎  build/android/font_dimens.xml
✔︎  build/android/colors.xml

compose
✔︎ build/compose/StyleDictionaryColor.kt
✔︎ build/compose/StyleDictionarySize.kt

ios
✔︎  build/ios/StyleDictionaryColor.h
✔︎  build/ios/StyleDictionaryColor.m
✔︎  build/ios/StyleDictionarySize.h
✔︎  build/ios/StyleDictionarySize.m

ios-swift
✔︎  build/ios-swift/StyleDictionary.swift

ios-swift-separate-enums
✔︎  build/ios-swift/StyleDictionaryColor.swift
✔︎  build/ios-swift/StyleDictionarySize.swift
```

Pat yourself on the back, you built your first style dictionary! Take a look at what you built. This should have created a build directory and it should look like this:
```
├── README.md
├── config.json
├── tokens/
│   ├── color/
│       ├── base.json
│       ├── font.json
│   ├── size/
│       ├── font.json
├── build/
│   ├── android/
│      ├── font_dimens.xml
│      ├── colors.xml
│   ├── compose/
│      ├── StyleDictionaryColor.kt
│      ├── StyleDictionarySize.kt
│   ├── scss/
│      ├── _variables.scss
│   ├── ios/
│      ├── StyleDictionaryColor.h
│      ├── StyleDictionaryColor.m
│      ├── StyleDictionarySize.h
│      ├── StyleDictionarySize.m
│   ├── ios-swift/
│      ├── StyleDictionary.swift
│      ├── StyleDictionaryColor.swift
│      ├── StyleDictionarySize.swift
```

If you open `config.json` you will see there are 3 platforms defined: scss, android, ios. Each platform has a transformGroup, buildPath, and files defined. The buildPath and files of the platform should match up to the files what were built. Those files should look like these:

**Android**
```xml
<!-- font_dimens.xml -->
<resources>
  <dimen name="size_font_small">12.00sp</dimen>
  <dimen name="size_font_medium">16.00sp</dimen>
  <dimen name="size_font_large">32.00sp</dimen>
  <dimen name="size_font_base">16.00sp</dimen>
</resources>

<!-- colors.xml -->
<resources>
  <color name="color_base_gray_light">#ffcccccc</color>
  <color name="color_base_gray_medium">#ff999999</color>
  <color name="color_base_gray_dark">#ff111111</color>
  <color name="color_base_red">#ffff0000</color>
  <color name="color_base_green">#ff00ff00</color>
  <color name="color_font_base">#ff111111</color>
  <color name="color_font_secondary">#ff999999</color>
  <color name="color_font_tertiary">#ffcccccc</color>
</resources>
```

**Compose**
```kotlin
object StyleDictionaryColor {
  val colorBaseGrayDark = Color(0xff111111)
  val colorBaseGrayLight = Color(0xffcccccc)
  val colorBaseGrayMedium = Color(0xff999999)
  val colorBaseGreen = Color(0xff00ff00)
  val colorBaseRed = Color(0xffff0000)
  val colorFontBase = Color(0xffff0000)
  val colorFontSecondary = Color(0xff00ff00)
  val colorFontTertiary = Color(0xffcccccc)
}

object StyleDictionarySize {
  /** the base size of the font */
  val sizeFontBase = 16.00.sp
  /** the large size of the font */
  val sizeFontLarge = 32.00.sp
  /** the medium size of the font */
  val sizeFontMedium = 16.00.sp
  /** the small size of the font */
  val sizeFontSmall = 12.00.sp
}
```

**SCSS**
```scss
$color-base-gray-light: #cccccc;
$color-base-gray-medium: #999999;
$color-base-gray-dark: #111111;
$color-base-red: #ff0000;
$color-base-green: #00ff00;
$color-font-base: #ff0000;
$color-font-secondary: #00ff00;
$color-font-tertiary: #cccccc;
$size-font-small: 0.75rem;
$size-font-medium: 1rem;
$size-font-large: 2rem;
$size-font-base: 1rem;
```

**iOS**
```objectivec
#import "StyleDictionaryColor.h"

@implementation StyleDictionaryColor

+ (UIColor *)color:(StyleDictionaryColorName)colorEnum{
  return [[self values] objectAtIndex:colorEnum];
}

+ (NSArray *)values {
  static NSArray* colorArray;
  static dispatch_once_t onceToken;

  dispatch_once(&onceToken, ^{
    colorArray = @[
[UIColor colorWithRed:0.800f green:0.800f blue:0.800f alpha:1.000f],
[UIColor colorWithRed:0.600f green:0.600f blue:0.600f alpha:1.000f],
[UIColor colorWithRed:0.067f green:0.067f blue:0.067f alpha:1.000f],
[UIColor colorWithRed:1.000f green:0.000f blue:0.000f alpha:1.000f],
[UIColor colorWithRed:0.000f green:1.000f blue:0.000f alpha:1.000f],
[UIColor colorWithRed:1.000f green:0.000f blue:0.000f alpha:1.000f],
[UIColor colorWithRed:0.000f green:1.000f blue:0.000f alpha:1.000f],
[UIColor colorWithRed:0.800f green:0.800f blue:0.800f alpha:1.000f]
    ];
  });

  return colorArray;
}

@end
```

Pretty nifty! This shows a few things happening:
1. The build system does a deep merge of all the design token files defined in the `source` attribute of `config.json`. This allows you to split up the design token files however you want. There are 2 JSON files with `color` as the top level key, but they get merged properly.
1. The build system resolves references to other design tokens. `{size.font.medium.value}` is resolved properly.
1. The build system handles references to design token values in other files as well (as you can see in `tokens/color/font.json`).
1. Values are transformed specifically for each platform.


## Making a change

Now let's make a change and see how that affects things. Open up `tokens/color/base.json` and change `"#111111"` to `"#000000"`. After you make that change, save the file and re-run the build command `style-dictionary build`. Open up the build files and take a look. Now:

**Android**
```xml
<!-- colors.xml -->
<resources>
  <color name="color_base_gray_light">#ffcccccc</color>
  <color name="color_base_gray_medium">#ff999999</color>
  <color name="color_base_gray_dark">#ff000000</color>
  <color name="color_base_red">#ffff0000</color>
  <color name="color_base_green">#ff00ff00</color>
  <color name="color_font_base">#ffff0000</color>
  <color name="color_font_secondary">#ff00ff00</color>
  <color name="color_font_tertiary">#ffcccccc</color>
</resources>
```
```kotlin
object StyleDictionaryColor {
  val colorBaseGrayDark = Color(0xff000000)
  val colorBaseGrayLight = Color(0xffcccccc)
  val colorBaseGrayMedium = Color(0xff999999)
  val colorBaseGreen = Color(0xff00ff00)
  val colorBaseRed = Color(0xffff0000)
  val colorFontBase = Color(0xffff0000)
  val colorFontSecondary = Color(0xff00ff00)
  val colorFontTertiary = Color(0xffcccccc)
}
```
```scss
$color-base-gray-light: #cccccc;
$color-base-gray-medium: #999999;
$color-base-gray-dark: #000000;
$color-base-red: #ff0000;
$color-base-green: #00ff00;
$color-font-base: #ff0000;
$color-font-secondary: #00ff00;
$color-font-tertiary: #cccccc;
```
```objectivec
[UIColor colorWithRed:0.800f green:0.800f blue:0.800f alpha:1.000f],
[UIColor colorWithRed:0.600f green:0.600f blue:0.600f alpha:1.000f],
[UIColor colorWithRed:0.000f green:0.000f blue:0.000f alpha:1.000f],
[UIColor colorWithRed:1.000f green:0.000f blue:0.000f alpha:1.000f],
[UIColor colorWithRed:0.000f green:1.000f blue:0.000f alpha:1.000f],
[UIColor colorWithRed:1.000f green:0.000f blue:0.000f alpha:1.000f],
[UIColor colorWithRed:0.000f green:1.000f blue:0.000f alpha:1.000f],
[UIColor colorWithRed:0.800f green:0.800f blue:0.800f alpha:1.000f]
```

That's it! There is a lot more you can do with your style dictionary than generating files with color values. Take a look
at some [examples](examples.md) or take a deeper dive into [package structure](package_structure.md), [extending](extending.md), or how the [build process](build_process.md) works.

## Basic Usage
### Command Line Interface (CLI)
```bash
$ style-dictionary build
```
Call this in the root directory of your project, which must include a [configuration](config.md) file.

More detailed information about [using the Style Dictionary CLI is available here](using_the_cli.md).

### Node

You can also use the style dictionary build system in node if you want to [extend](extending.md) the functionality or use it in another build system like Grunt or Gulp.

```javascript
const StyleDictionary = require('style-dictionary').extend('config.json');

StyleDictionary.buildAllPlatforms();
```

The `.extend()` method is an overloaded method that can also take a [configuration](config.md) object.

```javascript
const StyleDictionary = require('style-dictionary').extend({
  source: ['tokens/**/*.json'],
  platforms: {
    scss: {
      transformGroup: 'scss',
      buildPath: 'build/',
      files: [{
        destination: 'variables.scss',
        format: 'scss/variables'
      }]
    }
    // ...
  }
});

StyleDictionary.buildAllPlatforms();
```

More detailed information about [using the Style Dictionary npm module is available here](using_the_npm_module.md).
