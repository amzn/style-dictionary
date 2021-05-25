# Using the NPM Module

The Style Dictionary npm module exposes an [API](api.md) to interact with style dictionaries.

## Installation

To use the npm module, install it like a normal npm dependency. You are most likely going to want to save it as a dev dependency (The -D option) because it's a build tool:

```bash
$ npm install -D style-dictionary
```

## NPM Module Quick Start

To use the style dictionary build system in node, there are generally three steps:

1. Require/import the StyleDictionary module
1. Extend the module with a configuration, creating the fully defined dictionary (importing all properties and intended outputs)
1. Call one or more build calls for various platforms

To use the NPM module you will need to update your NPM script that runs Style Dictionary from using the CLI command to running Node on the file you are using.

```json5
// package.json
  "scripts": {
    "build": "style-dictionary build"
  }
```

becomes

```json5
// package.json
  "scripts": {
    "build": "node build.js"
  }
```

Update "build.js" to the name of the file you created. 

Using a JSON [configuration](config.md) file, that looks like this:

```javascript
const StyleDictionary = require('style-dictionary').extend('config.json');

StyleDictionary.buildAllPlatforms();
```

Alternatively, you can pass in a [configuration](config.md) object to the extend call. The `buildAllPlatforms` call is the same.

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

You can `extend` Style Dictionary multiple times and call `buildAllPlatforms` as many times as you need. This can be useful if you are creating nested (parent-child) themes with Style Dictionary.

```javascript
const StyleDictionary = require('style-dictionary');

const styleDictionary = StyleDictionary.extend({
  // add custom formats/transforms
});

styleDictionary.extend({
  // ...
}).buildAllPlatforms();

styleDictionary.extend({
  // ...
}).buildAllPlatforms();
```

Another way to do this is to loop over an array and apply different configurations to Style Dictionary:

```javascript
const StyleDictionary = require('style-dictionary');

const brands = [`brand-1`, `brand-2`, `brand-3`];
brands.forEach(brand => {
  StyleDictionary.extend({
    include: [`tokens/default/**/*.json`],
    source: [`tokens/${brand}/**/*.json`],
    // ...
  }).buildAllPlatforms();
});
```

The [multi-brand-multi-platform example](https://github.com/amzn/style-dictionary/tree/main/examples/advanced/multi-brand-multi-platform) uses this method.

----

## NPM Module API

The [complete npm module API is documented here](api.md).
