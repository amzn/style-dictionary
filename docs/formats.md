# Formats

Formats are one of the ways to create files that act as interfaces for your style dictionary. For example, you want to be able to
use your style dictionary in CSS. You can use the `css/variables` template which will create a CSS file with variables from
your style dictionary. You can define custom formats with the [`registerFormat`](api.md#registerformat).

Templates and Formats serve the same purpose: use your style dictionary as data to build a file. You use formats in your config
file under platforms > [platform] > files > [file]

```json
{
  "source": ["properties/**/*.json"],
  "platforms": {
    "css": {
      "transformGroup": "css",
      "files": [
        {
          "template": "css/variables",
          "destination": "variables.css"
        }
      ]
    }
  }
}
```


>*__How are Templates different than Formats?__*

>Mainly syntactic sugar; anything you can do in a Template you can do in a Format. Use whichever is easier for you to write. We find
that Templates are good if you have a lot of boilerplate code around where the style dictionary will go (like writing ObjectiveC files).
Formats are better if there is little to no boilerplate code like a flat SCSS variables file.

----

## Pre-defined Formats

[lib/common/formats.js](https://github.com/amzn/style-dictionary/blob/master/lib/common/formats.js)

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


Creates a ES6 module of the style dictionary. You can filter the style dictionary
to only export properties of a certain type by adding a 'filter' attribute on the
file object in the config.

```json
{
  "platforms": {
    "js": {
      "files": [
        {
          "format": "javascript/es6",
          "destination": "colors.js",
          "filter": {
            "category": "color"
          }
        }
      ]
    }
  }
}
```

**Example**  
```js
export const BackgroundBase = '#ffffff';
export const BackgroundAlt = '#fcfcfcfc';
```

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
