# Using the NPM Module

The Style Dictionary npm module exposes an [API](api.md) to interact with style dictionaries.


# Installation
To use the npm module, install it like a normal npm dependency. You are most likely going to want to save it as a dev dependency (The -D option) because it's a build tool:
```bash
$ npm install -D style-dictionary
```


# NPM Module Quick Start
To use the style dictionary build system in node, there are generally three steps:
1. Require/import the StyleDictionary module
1. Extend the module with a configuration, creating the fully defined dictionary (importing all properties and intended outputs)
1. Call one or more build calls for various platforms

Using a JSON [configuration](config.md) file, that looks like this:
```javascript
const StyleDictionary = require('style-dictionary').extend('config.json');

StyleDictionary.buildAllPlatforms();
```

Alternatively, you can pass in a [configuration](config.md) object to the extend call. The buildAllPlatforms call is the same.
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


# NPM Module API
The [complete npm module API is documented here](api.md).
