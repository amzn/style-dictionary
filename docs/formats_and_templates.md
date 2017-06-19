# Formats and Templates

## Adding Custom Formats and Templates

```javascript
const StyleDictionary = require('style-dictionary');
const styleDictionary = StyleDictionary.extend('config.json');

styleDictionary.registerFormat({
  name: 'json',
  // dictionary has properties in object form, and allProperties as a flat array
  // platform is the current platform object defined in config.json so you can define
  // arbitrary information to be used in the formatter
  formatter: function(dictionary, platform) {
    return JSON.stringify(dictionary.properties, null, 2);
  }
});

styleDictionary.buildAllPlatforms();
```

### What if I want to use a different templating language?
**No problem!** You can just define a custom format and use your template library of choice in the formatter function.

```javascript
const StyleDictionary = require('style-dictionary');
const Handlebars = require('handlebars');
const styleDictionary = StyleDictionary.extend('config.json');

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

## [Default Formats](https://amzn.github.io/style-dictionary/default_formats)

This package comes with some default formats for you to use. These formats should be as generic as possible. If you have an idea for other formats or how to improve some, please file an issue.


## [Default Templates](https://amzn.github.io/style-dictionary/default_templates)
