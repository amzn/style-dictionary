# Templates

Templates are one of the ways to create files that act as interfaces for your style dictionary. For example, you want to be able to
use your style dictionary in Android. You can use the `android/colors` template which will create an Anroid resource XML file from
your style dictionary. You can define custom templates with the [`registerTemplate`](api.md#registertemplate).

Templates and Formats serve the same purpose: use your style dictionary as data to build a file. You use templates in your config
file under platforms > [platform] > files > [file]

```json
{
  "source": ["properties/**/*.json"],
  "platforms": {
    "android": {
      "transformGroup": "android",
      "files": [
        {
          "template": "android/colors",
          "destination": "colors.xml"
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

### Using a different templating language

If you are partial to Handlebars or some other templating language, anything will work as long as there is a node module for it.
All you need to do is register a custom format which calls your template and returns a string. Here is a quick example for Handlebars.

```js
const StyleDictionary = require('style-dictionary').extend('config.json');
const Handlebars = require('handlebars');

const template = Handlebars.compile( fs.readFileSync('templates/MyTemplate.hbs') );

styleDictionary.registerFormat({
  name: 'myTemplate',
  formatter: function(dictionary, platform) {
    return template({
      properties: dictionary.properties,
      options: platform
    });
  }
});

styleDictionary.buildAllPlatforms();
```

----

## Pre-defined Templates

[lib/common/templates.js](https://github.com/amzn/style-dictionary/blob/master/lib/common/templates.js)

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

### static-style-guide/index.html 


Creates a generic static html page

**Todo**

- Add example and usage


* * *

