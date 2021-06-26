const StyleDictionary = require('style-dictionary');

const {
  createPropertyFormatter,
  fileHeader,
  formattedVariables,
  sortByReference
} = StyleDictionary.formatHelpers;

module.exports = {
  format: {
    myFormat: ({ dictionary, options, file }) => {
      const { outputReferences } = options;
      // createPropertyFormatter will return a function that can be passed to
      // .map() to format each token. Pass it the `outputReferences` and dictionary
      // along with a formatting object that tells the function how to format
      // each line.
      const formatProperty = createPropertyFormatter({
        outputReferences,
        dictionary,
        formatting: {
          prefix: '$',
          separator: ':',
          suffix: ';'
        }
      });

      // fileHeader takes in the file configuration as well as a commentStyle
      // or formatting object and will generate a file header comment in the
      // proper style. If the file has a custom file header defined, or
      // showFileHeader option, it will honor those.
      return fileHeader({file, commentStyle: 'short'}) +
        dictionary.allTokens
          // sortByReference returns a function that can be used as to sort
          // an array. This will sort the array so that references always
          // come after their instantiation so that there are no errors
          // when consuming this file.
          .sort(sortByReference(dictionary))
          .map(formatProperty)
          .join('\n');
    },

    // You could also use the formattedVariables function which is a quicker
    // way to do all the steps above. It will take formatting information
    // and sort and map all the tokens.
    myOtherFormat: ({ dictionary, options, file }) => {
      const { outputReferences } = options;
      const lineSeparator = `\n`;

      // Here we are using fileHeader with a formatting object,
      // this will show the file header with a block-style comment
      return fileHeader({file, formatting: {
        lineSeparator,
        prefix: ` * `,
        header: `/**${lineSeparator}`,
        footer: `${lineSeparator} */${lineSeparator}${lineSeparator}`
      }}) +
        formattedVariables({
          dictionary,
          outputReferences,
          formatting: {
            prefix: '$',
            separator: ':',
            suffix: ';'
          }
        });
    }
  },
  source: ['tokens/**/*'],
  platforms: {
    scss: {
      transformGroup: 'scss',
      buildPath: 'build/',
      files: [{
        destination: 'variables.scss',
        format: 'myFormat'
      },{
        destination: 'variablesWithReferences.scss',
        format: 'myOtherFormat',
        options: {
          outputReferences: true,
          // Creates a custom file header message
          // the `fileHeader` format helper function will use this file header
          // for this file.
          fileHeader: (defaultMessage) => [
            ...defaultMessage,
            "hello",
            "is it me you're looking for?"
          ]
        }
      }]
    }
  }
}