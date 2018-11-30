# Basic Style Dictionary

This example code is bare-bones to show you what this framework can do. If you have the style-dictionary module installed globally, just cd into this directory and run:
```bash
style-dictionary build
```

You should see something like this output:
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

Pat yourself on the back, you just built your first style dictionary! Moving on, take a look at what we have built. This should have created a build directory and it should look like this:
```
├── android/
│   ├── font_dimens.xml
│   ├── colors.xml
├── scss/
│   ├── _variables.scss
├── ios/
│   ├── StyleDictionaryColor.h
│   ├── StyleDictionaryColor.m
```

If you open `config.json` you will see there are 3 platforms defined: scss, android, ios. Each platform has a transformGroup, buildPath, and files. The buildPath and files of the platform should match up to the files what were built. The files built should look like these:

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
  <color name="color_base_gray_light">#CCCCCC</color>
  <color name="color_base_gray_medium">#999999</color>
  <color name="color_base_gray_dark">#111111</color>
  <color name="color_font_base">#111111</color>
  <color name="color_font_secondary">#999999</color>
  <color name="color_font_tertiary">#CCCCCC</color>
</resources>
```

**SCSS**
```scss
// variables.scss
$color-base-gray-light: #CCCCCC;
$color-base-gray-medium: #999999;
$color-base-gray-dark: #111111;
$color-font-base: #111111;
$color-font-secondary: #999999;
$color-font-tertiary: #CCCCCC;
$size-font-small: 0.75rem;
$size-font-medium: 1rem;
$size-font-large: 2rem;
$size-font-base: 1rem;
```

**iOS**
```objc
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

Now lets make a change and see how that affects things. Open up `properties/color/base.json` and change `"#111111"` to `"#000000"`. After you make that change, save the file and re-run the build command `style-dictionary build`. Open up the build files and take a look.

**Huzzah!**

Now go forth and create! Take a look at all the built-in [transforms](https://amzn.github.io/style-dictionary/#/transforms?id=pre-defined-transforms) and [formats](https://amzn.github.io/style-dictionary/#/formats?id=pre-defined-formats).
