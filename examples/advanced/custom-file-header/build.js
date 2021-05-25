const crypto = require('crypto');
const StyleDictionary = require('style-dictionary');
const version = require('./package.json').version;

// You can use the `fileHeader` format helper function
// This function will use any custom file headers or the default
// file header
const {fileHeader} = StyleDictionary.formatHelpers;

const myCustomFormat = ({ dictionary, file }) => {
  return `${fileHeader({file, commentStyle: 'short'})}${dictionary.allTokens.map(token => {
    return `--${token.name}: ${token.value};`
  }).join(`\n`)}`
}

const styleDictionary = StyleDictionary.extend({
  // You can add custom file headers directly on the configuration by
  // adding a `fileHeader` object. The keys inside are the names of
  // the file headers
  fileHeader: {
    // defaultMessage is the built-in file header message:
    // Do not edit directly
    // Generated on Sat, 01 Jan 2000 00:00:00 GMT
    myFileHeader: (defaultMessage) => {
      // A file header function is expected to return an array of strings.
      // This array will be mapped to the proper comment style for a given format.
      // For example, Android XML formats use XML comments: <!-- -->,
      // whereas other languages have short and long style comments, // and /* */
      return [
        ...defaultMessage,
        'hello, world!'
      ];
    }
  },

  format: {
    myCustomFormat
  },

  source: [`tokens/**/*.json`],

  platforms: {
    css: {
      transformGroup: `css`,
      buildPath: `build/`,
      files: [{
        destination: `variables.css`,
        format: `css/variables`,
        options: {
          // You can now reference a custom file header in a file's options.
          fileHeader: `myFileHeader`
        }
      },{
        destination: `variables1.css`,
        format: `myCustomFormat`,
        options: {
          fileHeader: `myFileHeader`
        }
      },{
        destination: `variables2.css`,
        format: `css/variables`,
        options: {
          // You can also directly pass a function to the `fileHeader` option:
          fileHeader: () => {
            return [
              `build version ${version}`
            ]
          }
        }
      }]
    },
    js: {
      transformGroup: `js`,
      buildPath: `build/`,
      // You can also add a header at the platform level.
      // Platform-level options cascade down to files.
      options: {
        fileHeader: `customFileHeader`
      },
      files: [{
        destination: `colors.js`,
        format: `javascript/es6`
      },{
        destination: `colors2.js`,
        format: `javascript/es6`,
        // This file won't get the custom header because it defines the
        // showFileHeader option to false
        options: {
          showFileHeader: false
        }
      },{
        destination: `colors3.js`,
        format: `javascript/es6`,
        // This file will use the custom header defined here because the file's
        // options take precedence over the platform's options.
        options: {
          fileHeader: () => [`Header overridden`]
        }
      }]
    }
  }
});

// Create a hash of style dictionary tokens object to use in a file header
const hash = crypto.createHash('md5')
  .update(JSON.stringify(styleDictionary.tokens))
  .digest('hex');

// Adding a custom file header with the `.registerFileHeader`
styleDictionary.registerFileHeader({
  name: `customFileHeader`,
  fileHeader: () => {
    return [
      `Do not edit directly`,
      `build hash ${hash}`
    ]
  }
});

styleDictionary.buildAllPlatforms();