# Quick Start

## Installation
*Note that you must have node (and npm) installed.*

If you want to use the CLI, you can install it globally via npm:
```bash
$ npm install -g style-dictionary
```

Or you can install it like a normal npm dependency. This is a build tool so you are most likely going to want to save it as a dev dependency:
```bash
$ npm install -D style-dictionary
```

If you want to install it with yarn:
```bash
$ yarn add style-dictionary --dev
```

## Creating a New Project
The CLI comes with some starter code to get a new project started easily.
```bash
$ mkdir MyStyleD
$ cd MyStyleD
$ style-dictionary init basic
```

This command will copy over the example files found in example in this repo and then run the `style-dictionary build` command to generate the build artifacts. You should see something like this output:
```
Reading config file from ./config.json
Building all platforms

scss
✔︎ build/scss/_variables.scss

android
✔︎ build/android/font_dimens.xml

ios
✔︎ build/ios/StyleDictionaryColor.h
✔︎ build/ios/StyleDictionaryColor.m
```

Pat yourself on the back, you just built your first style dictionary! Take a look at what you built. This should have created a build directory and it should look like this:
```
├── README.md
├── config.json
├── properties/
│   ├── color/
│       ├── base.json
│       ├── font.json
│   ├── size/
│       ├── font.json
│       ├── font.json
├── build/
│   ├── android/
│      ├── font_dimens.xml
│      ├── colors.xml
│   ├── scss/
│      ├── _variables.scss
│   ├── ios/
│      ├── StyleDictionaryColor.h
│      ├── StyleDictionaryColor.m
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
  <color name="color_font_base">#ff111111</color>
  <color name="color_font_secondary">#ff999999</color>
  <color name="color_font_tertiary">#ffcccccc</color>
</resources>
```

**SCSS**
```scss
$color-base-gray-light: rgb(204, 204, 204);
$color-base-gray-medium: rgb(153, 153, 153);
$color-base-gray-dark: rgb(17, 17, 17);
$color-font-base: rgb(17, 17, 17);
$color-font-secondary: rgb(153, 153, 153);
$color-font-tertiary: rgb(204, 204, 204);
$size-font-small: 0.75rem;
$size-font-medium: 1rem;
$size-font-large: 2rem;
$size-font-base: 1rem;
```

**iOS**
```objectivec
@implementation StyleDictionaryColor

+ (UIColor *)color:(StyleDictionaryColorName)colorEnum{
  return [[self values] objectAtIndex:colorEnum];
}

+ (NSArray *)values {
  static NSArray* colorArray;
  static dispatch_once_t onceToken;

  dispatch_once(&onceToken, ^{
    colorArray = @[
[UIColor colorWithRed:0.80f green:0.80f blue:0.80f alpha:1.0f],
[UIColor colorWithRed:0.60f green:0.60f blue:0.60f alpha:1.0f],
[UIColor colorWithRed:0.07f green:0.07f blue:0.07f alpha:1.0f],
[UIColor colorWithRed:0.07f green:0.07f blue:0.07f alpha:1.0f],
[UIColor colorWithRed:0.60f green:0.60f blue:0.60f alpha:1.0f],
[UIColor colorWithRed:0.80f green:0.80f blue:0.80f alpha:1.0f]
    ];
  });

  return colorArray;
}

@end
```

Pretty nifty! This shows a few things happening:
1. The build system does a deep merge of all the property JSON files defined in the `source` attribute of `config.json`. This allows you to split up the property JSON files however you want. There are 2 JSON files with `color` as the top level key, but they get merged properly.
1. The build system resolves references to other style properties. `{size.font.medium.value}` gets resolved properly
1. The build system handles references to property values in other files as well as you can see in `properties/color/font.json`
1. Values get transformed differently depending on the platform they are built to


## Making a change

Now lets make a change and see how that affects things. Open up `properties/color/base.json` and change `"#111111"` to `"#000000"`. After you make that change, save the file and re-run the build command `style-dictionary build`. Open up the build files and take a look. Now

**Android**
```xml
<!-- colors.xml -->
<resources>
  <color name="color_base_gray_light">#ffcccccc</color>
  <color name="color_base_gray_medium">#ff999999</color>
  <color name="color_base_gray_dark">#ff000000</color>
  <color name="color_font_base">#ff111111</color>
  <color name="color_font_secondary">#ff999999</color>
  <color name="color_font_tertiary">#ffcccccc</color>
</resources>
```
```scss
$color-base-gray-light: rgb(204, 204, 204);
$color-base-gray-medium: rgb(153, 153, 153);
$color-base-gray-dark: rgb(0, 0, 0);
$color-font-base: rgb(0, 0, 0);
$color-font-secondary: rgb(153, 153, 153);
$color-font-tertiary: rgb(204, 204, 204);
```
```objectivec
[UIColor colorWithRed:0.80f green:0.80f blue:0.80f alpha:1.00f],
[UIColor colorWithRed:0.60f green:0.60f blue:0.60f alpha:1.00f],
[UIColor colorWithRed:0.00f green:0.00f blue:0.00f alpha:1.00f],
[UIColor colorWithRed:0.00f green:0.00f blue:0.00f alpha:1.00f],
[UIColor colorWithRed:0.60f green:0.60f blue:0.60f alpha:1.00f],
[UIColor colorWithRed:0.80f green:0.80f blue:0.80f alpha:1.00f]
```

That's it! There is a lot more you can do with your style dictionary than just generate some files with color values. Take a look
at some [examples](examples.md) or take a deeper dive into [package structure](package_structure.md), [extending](extending.md), or how the [build process](build_process.md) works.

## Basic Usage
### CLI
```bash
$ style-dictionary build
```
Call this in the root directory of your project. The only thing needed is a `config.json` file. There are also arguments:

| Flag | Short Flag | Description |
| --- | --- | --- |
| --config \[path\] | -h | Set the config file to use. Must be a .json file |
| --platform \[platform\] | -p | Only build a specific platform defined in the config file. |
| --help | -h | Display help content |
| --version | -v | Display the version |

### Node
You can also use the style dictionary build system in node if you want to [extend](extending.md) the functionality or use it in another build system like Grunt or Gulp.
```javascript
const StyleDictionary = require('style-dictionary').extend('config.json');

StyleDictionary.buildAllPlatforms();
```

The `.extend()` method is an overloaded method that can also take an object with the configuration in the same format as a config.json file.
```javascript
const StyleDictionary = require('style-dictionary').extend({
  source: ['properties/**/*.json'],
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
