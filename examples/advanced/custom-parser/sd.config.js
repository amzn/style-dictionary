const StyleDictionary = require('style-dictionary');

// You can use the .registerParser() method like this
StyleDictionary.registerParser({
  pattern: /\.json$/,
  parse: ({contents, filePath}) => {
    // Probably a good idea to wrap this in a try/catch block
    try {
      const object = JSON.parse(contents);
      // You can now perform any modifications to the file content
      // or perform any side-effects based on the file

      // Here we are going to grab the filepath and turn it into a prefix.
      // tokens/color/core.json will become 'color-core'. We will append this
      // to all token names.
      const pathParts = filePath.replace(__dirname + '/tokens/', '')
        .replace('.json','')
        .split('/')
        .join('-');

      const output = {};

      for (const key in object) {
        if (object.hasOwnProperty(key)) {
          const element = object[key];
          output[`${pathParts}-${key}`] = element;
        }
      }

      return output;
    } catch (error) {
      console.log(error);
    }
  }
});

// Or you can add parsers directly on the configuration object here like this:
// StyleDictionary.extend({
//   parsers: [{
//     pattern: /\.json$/,
//     parse: ({contents, filePath}) => {}
//   }],
//   source: [`tokens/**/*.json`],
//   platforms: {
//     css: {
//       transformGroup: 'css',
//       buildPath: 'build/',
//       files: [{
//         destination: 'variables.css',
//         format: 'css/variables'
//       }]
//     }
//   }
// }).buildAllPlatforms();

module.exports = {
  // Or you can add parsers directly on the configuration object here like this:
  // parsers: [{
  //   pattern: /\.json$/,
  //   parse: ({contents, filePath}) => {}
  // }],
  source: [`tokens/**/*.json`],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'build/',
      files: [{
        destination: 'variables.css',
        format: 'css/variables'
      }]
    }
  }
}
