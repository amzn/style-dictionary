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

## Built in Formats
[lib/common/formats.js](https://github.com/amznlabs/style-dictionary/blob/master/lib/common/formats.js)

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>css/variables</td>
      <td></td>
    </tr>
    <tr>
      <td>scss/variables</td>
      <td></td>
    </tr>
    <tr>
      <td>scss/icons</td>
      <td></td>
    </tr>
    <tr>
      <td>javascript/module</td>
      <td></td>
    </tr>
    <tr>
      <td>javascript/object</td>
      <td></td>
    </tr>
    <tr>
      <td>javascript/es6</td>
      <td></td>
    </tr>
    <tr>
      <td>json</td>
      <td></td>
    </tr>
    <tr>
      <td>json/asset</td>
      <td></td>
    </tr>
    <tr>
      <td>sketch/palette</td>
      <td></td>
    </tr>
  </tbody>
</table>
