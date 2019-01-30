# Formats

Formats define the output of your created files. For example, to use your styles in CSS
you use the `css/variables` format. This will create a CSS file containing the variables from
your style dictionary.

### Using formats

You use formats in your config file under platforms > [platform] > files > [file] > format

```json
{
  "source": ["properties/**/*.json"],
  "platforms": {
    "css": {
      "transformGroup": "css",
      "files": [
        {
          "format": "css/variables",
          "destination": "variables.css"
        }
      ]
    }
  }
}
```

There is an extensive (but not exhaustive) list of [included formats](#pre-defined-formats) available in Style Dictionary.


### Creating formats

You can create custom formats using the [`registerFormat`](api.md#registerformat) function.


### Using a template / templating engine to create a format

A formatter is just a simple function and created easily with most templating engines. Templates are useful if there is a lot of boilerplate code to insert (e.g. ObjectiveC files). If the output consists of just the values (e.g. a flat SCSS variables file), writing a formatter function directly may be easier.

Any templating language can work as there is a node module for it. All you need to do is register a format that calls your template and returns a string.

Here is a quick example for Lodash.

```js
const styleDictionary = require('style-dictionary').extend('config.json');
const _ = require('lodash');

const template = _.template( fs.readFileSync('templates/myFormat.template') );

styleDictionary.registerFormat({
  name: 'my/format',
  formatter: template
});

// format: 'my/format' is now available for use...
```

And another example for Handlebars.

```js
const styleDictionary = require('style-dictionary').extend('config.json');
const Handlebars = require('handlebars');

const template = Handlebars.compile( fs.readFileSync('templates/MyTemplate.hbs').toString() );

styleDictionary.registerFormat({
  name: 'my/format',
  formatter: function(dictionary, platform) {
    return template({
      properties: dictionary.properties,
      options: platform
    });
  }
});

// format: 'my/format' is now available for use...
```

----

## Pre-defined Formats

These are the formats included in Style Dictionary by default, pulled from [lib/common/formats.js](https://github.com/amzn/style-dictionary/blob/master/lib/common/formats.js)

Want a format? [You can request it here](https://github.com/amzn/style-dictionary/issues).

You created a format and think it should be included? [Send us a PR](https://github.com/amzn/style-dictionary/pulls).


### css/variables


Creates a CSS file with variable definitions based on the style dictionary

**Example**
```css
:root {
  --color-background-base: #f0f0f0;
  --color-background-alt: #eeeeee;
}
```

* * *

### scss/map-flat


Creates a SCSS file with a flat map based on the style dictionary

**Example**
```scss
$tokens: (
  $color-background-base: #f0f0f0;
  $color-background-alt: #eeeeee;
)
```

* * *

### scss/map-deep


Creates a SCSS file with a deep map based on the style dictionary

**Example**
```scss
$color-background-base: #f0f0f0 !default;
$color-background-alt: #eeeeee !default;

$tokens: {
  'color': (
    'background': (
      'base': $color-background-base,
      'alt': $color-background-alt
    )
  )
)
```

* * *

### scss/variables


Creates a SCSS file with variable definitions based on the style dictionary

**Example**
```scss
$color-background-base: #f0f0f0;
$color-background-alt: #eeeeee;
```

* * *

### scss/icons


Creates a SCSS file with variable definitions and helper classes for icons

**Example**
```scss
$content-icon-email: '\E001';
.icon.email:before { content:$content-icon-email; }
```

* * *

### less/variables


Creates a LESS file with variable definitions based on the style dictionary

**Example**
```less
@color-background-base: #f0f0f0;
@color-background-alt: #eeeeee;
```

* * *

### less/icons


Creates a LESS file with variable definitions and helper classes for icons

**Example**
```less
@content-icon-email: '\E001';
.icon.email:before { content:@content-icon-email; }
```

* * *

### javascript/module


Creates a CommonJS module with the whole style dictionary

**Example**
```js
module.exports = {
  color: {
    base: {
       red: {
         value: '#ff000'
       }
    }
  }
}
```

* * *

### javascript/object


Creates a JS file a global var that is a plain javascript object of the style dictionary.
Name the variable by adding a 'name' attribute on the file object in your config.

**Example**
```js
var StyleDictionary = {
  color: {
    base: {
       red: {
         value: '#ff000'
       }
    }
  }
}
```

* * *

### javascript/umd


Creates a [UMD](https://github.com/umdjs/umd) module of the style
dictionary. Name the module by adding a 'name' attribute on the file object
in your config.

**Example**
```js
(function(root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else if (typeof exports === "object") {
    exports["_styleDictionary"] = factory();
  } else if (typeof define === "function" && define.amd) {
    define([], factory);
  } else {
    root["_styleDictionary"] = factory();
  }
}(this, function() {
  return {
    "color": {
      "red": {
        "value": "#FF0000"
      }
    }
  };
}))
```

* * *

### javascript/es6


Creates a ES6 module of the style dictionary.

```json
{
  "platforms": {
    "js": {
      "transformGroup": "js",
      "files": [
        {
          "format": "javascript/es6",
          "destination": "colors.js",
          "filter": {
            "attributes": {
              "category": "color"
            }
          }
        }
      ]
    }
  }
}
```

**Example**
```js
export const ColorBackgroundBase = '#ffffff';
export const ColorBackgroundAlt = '#fcfcfcfc';
```

* * *

### android/colors


Creates a color resource xml file with all the colors in your style dictionary.

**Example**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<resources>
 <color name="color_base_red_5">#fffaf3f2</color>
 <color name="color_base_red_30">#fff0cccc</color>
 <color name="color_base_red_60">#ffe19d9c</color>
```

* * *

### android/dimens


Creates a dimen resource xml file with all the sizes in your style dictionary.

**Example**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<resources>
 <dimen name="size_padding_tiny">5.00dp</dimen>
 <dimen name="size_padding_small">10.00dp</dimen>
 <dimen name="size_padding_medium">15.00dp</dimen>
```

* * *

### android/fontDimens


Creates a dimen resource xml file with all the font sizes in your style dictionary.

**Example**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<resources>
 <dimen name="size_font_tiny">10.00sp</dimen>
 <dimen name="size_font_small">13.00sp</dimen>
 <dimen name="size_font_medium">15.00sp</dimen>
```

* * *

### android/integers


Creates a resource xml file with all the integers in your style dictionary. It filters your
style properties by `prop.attributes.category === 'time'`

**Todo**

- Update the filter on this.

**Example**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<resources>
  <integer name="time_duration_short">1000</string>
  <integer name="time_duration_medium">2000</string>
  <integer name="time_duration_long">4000</string>
```

* * *

### android/strings


Creates a resource xml file with all the strings in your style dictionary. Filters your
style properties by `prop.attributes.category === 'content'`

**Example**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<resources>
  <string name="content_icon_email">&#xE001;</string>
  <string name="content_icon_chevron_down">&#xE002;</string>
  <string name="content_icon_chevron_up">&#xE003;</string>
```

* * *

### ios/macros


Creates an Objective-C header file with macros for style properties

**Example**
```objectivec
#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#define ColorFontLink [UIColor colorWithRed:0.00f green:0.47f blue:0.80f alpha:1.00f]
#define SizeFontTiny 176.00f
```

* * *

### ios/plist


Creates an Objective-C plist file

**Todo**

- Fix this template and add example and usage


* * *

### ios/singleton.m


Creates an Objective-C implementation file of a style dictionary singleton class

**Todo**

- Add example and usage


* * *

### ios/singleton.h


Creates an Objective-C header file of a style dictionary singleton class

**Todo**

- Add example and usage


* * *

### ios/static.h


Creates an Objective-C header file of a static style dictionary class

**Todo**

- Add example and usage


* * *

### ios/static.m


Creates an Objective-C implementation file of a static style dictionary class

**Todo**

- Add example and usage


* * *

### ios/colors.h


Creates an Objective-C header file of a color class

**Todo**

- Add example and usage


* * *

### ios/colors.m


Creates an Objective-C implementation file of a color class

**Todo**

- Add example and usage


* * *

### ios/strings.h


Creates an Objective-C header file of strings

**Todo**

- Add example and usage


* * *

### ios/strings.m


Creates an Objective-C implementation file of strings

**Todo**

- Add example and usage


* * *

### css/fonts.css


Creates CSS file with @font-face declarations

**Todo**

- Add example and usage


* * *

### json


Creates a JSON file of the style dictionary.

**Example**
```json
{
  "color": {
    "base": {
       "red": {
         "value": "#ff000"
       }
    }
  }
}
```

* * *

### json/asset


Creates a JSON file of just the assets defined in the style dictionary.

**Example**
```js
{
  "asset": {
    "image": {
       "logo": {
         "value": "assets/logo.png"
       }
    }
  }
}
```

* * *

### json/nested


Creates a JSON nested file of the style dictionary.

**Example**
```json
{
  "color": {
    "base": {
       "red": "#ff000"
    }
  }
}
```

* * *

### json/flat


Creates a JSON flat file of the style dictionary.

**Example**
```json
{
  "color-base-red": "#ff000"
}
```

* * *

### sketch/palette


Creates a sketchpalette file of all the base colors

**Example**
```json
{
  "compatibleVersion": "1.0",
  "pluginVersion": "1.1",
  "colors": [
    "#ffffff",
    "#ff0000",
    "#fcfcfc"
  ]
}
```

* * *
