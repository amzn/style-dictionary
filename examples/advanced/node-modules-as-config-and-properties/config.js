const StyleDictionary = require('style-dictionary');
// Rather than have Style Dictionary handle the merging of property files,
// you could use node module export/require to do it yourself. This will
// allow you to not have to copy object namespaces like you normally would.
// Take a look at any of the .js files in components/ or properties/
const properties = require('./properties');

const buildPath = 'build/';

// You can still add custom transforms and formats like you
// normally would and reference them in the config below.
StyleDictionary.registerTransform({
  name: 'myRegisteredTransform',
  type: 'value',
  matcher: (prop) => prop.attributes.category === 'size',
  transformer: (prop) => `${parseInt(prop.value) * 16}px`
});

StyleDictionary.registerFormat({
  name: 'myRegisteredFormat',
  formatter: (dictionary) => {
    return dictionary.allProperties.map((prop) => prop.value).join('\n');
  }
})

// You can export a plain JS object and point the Style Dictionary CLI to it,
// similar to webpack.
module.exports = {
  // We are relying on node modules to merge all the objects together
  // thus we only want to reference top level node modules that export
  // the whole objects.
  source: ['properties/index.js', 'components/index.js'],
  // If you don't want to call the registerTransform method a bunch of times
  // you can override the whole transform object directly. This works because
  // the .extend method copies everything in the config
  // to itself, allowing you to override things. It's also doing a deep merge
  // to protect from accidentally overriding nested attributes.
  transform: {
    // Now we can use the transform 'myTransform' below
    myTransform: {
      type: 'name',
      transformer: (prop) => prop.path.join('_').toUpperCase()
    }
  },
  // Same with formats, you can now write them directly to this config
  // object. The name of the format is the key.
  format: {
    myFormat: (dictionary, platform) => {
      return dictionary.allProperties.map(prop => `${prop.name}: ${prop.value}`).join('\n');
    }
  },
  // You can also bypass the merging of files Style Dictionary does
  // by adding a 'properties' object directly like this:
  //
  // properties: properties,
  platforms: {
    custom: {
      // Using the custom transforms we defined above
      transforms: ['attribute/cti', 'myTransform', 'myRegisteredTransform', 'color/hex'],
      buildPath: buildPath,
      files: [{
        destination: 'variables.yml',
        // Using the custom format defined above
        format: 'myFormat'
      }]
    },
    css: {
      transformGroup: 'css',
      buildPath: buildPath,
      files: [{
        destination: 'variables.css',
        format: 'css/variables'
      }]
    },

    scss: {
      // This works, we can create new transform arrays on the fly and edit built-ins
      transforms: StyleDictionary.transformGroup.scss.concat('color/rgb'),
      buildPath: buildPath,
      files: [{
        destination: 'variables.scss',
        format: 'scss/variables'
      }]
    },

    js: {
      transforms: StyleDictionary.transformGroup.js.concat('myRegisteredTransform'),
      buildPath: buildPath,
      // If you want to get super fancy, you can use node modules
      // to create a properties object first, and then you can
      // reference attributes of that object. This allows you to
      // output 1 file per color namespace.
      files: Object.keys(properties.color).map((colorType) => ({
        destination: `${colorType}.js`,
        format: 'javascript/es6',
        // Filters can be functions that return a boolean
        filter: (prop) => prop.attributes.type === colorType
      }))
    },

    // You can still use built-in transformGroups and formats like before
    json: {
      transformGroup: 'js',
      buildPath: buildPath,
      files: [{
        destination: 'properties.json',
        format: 'json'
      }]
    }
  }
}
